<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';
	import { SvelteMap } from 'svelte/reactivity';
	import GameContainer from './shared/GameContainer.svelte';
	import ScoreBox from './shared/ScoreBox.svelte';
	import GameOverlay from './shared/GameOverlay.svelte';

	const SIZE = 4;
	const CELL_COUNT = SIZE * SIZE;
	const GOAL_TILES = Array.from({ length: CELL_COUNT }, (_, i) => (i + 1) % CELL_COUNT);
	const GOAL_KEY = GOAL_TILES.join(',');

	let pdb1: Uint8Array;
	let pdb2: Uint8Array;
	let pdb3: Uint8Array;
	let pdbReady = $state(false);
	let pdbLoadFailed = $state(false);

	// State (Svelte 5 Runes)
	// 0 represents the empty tile
	let tiles = $state([...GOAL_TILES]);
	let moves = $state(0);
	let bestScore = $state(0); // Lower is better for 15 puzzle
	let isFocused = $state(false);
	let gameContainer: HTMLDivElement | undefined = $state();
	let touchStart = { x: 0, y: 0 };
	let isInitialized = $state(false);

	// Derived State
	const isSolved = $derived(isGoalState(tiles));

	function isGoalState(state: number[]) {
		return getStateKey(state) === GOAL_KEY;
	}

	function getStateKey(state: number[]) {
		return state.join(',');
	}

	function swapState(state: number[], indexA: number, indexB: number) {
		const next = [...state];
		[next[indexA], next[indexB]] = [next[indexB], next[indexA]];
		return next;
	}

	// Heuristic: Manhattan Distance + Linear Conflict (Optimized)
	function calculateHeuristic(currentTiles: number[]) {
		let md = 0;
		let lc = 0;

		// Map simplified for performance (flattened)
		for (let i = 0; i < 16; i++) {
			const tile = currentTiles[i];
			if (tile === 0) continue;

			// Current
			const row = (i / SIZE) | 0;
			const col = i % SIZE;

			// Target (1-based value -> 0-based index)
			const targetIndex = tile - 1;
			const targetRow = (targetIndex / SIZE) | 0;
			const targetCol = targetIndex % SIZE;

			md += Math.abs(row - targetRow) + Math.abs(col - targetCol);

			// Linear Conflict
			if (row === targetRow) {
				for (let k = i + 1; k < (row + 1) * SIZE; k++) {
					const other = currentTiles[k];
					if (other !== 0) {
						const otherTargetRow = ((other - 1) / SIZE) | 0;
						if (otherTargetRow === row && tile > other) {
							lc++;
						}
					}
				}
			}
			if (col === targetCol) {
				for (let k = i + SIZE; k < 16; k += SIZE) {
					const other = currentTiles[k];
					if (other !== 0) {
						const otherTargetCol = (other - 1) % SIZE;
						if (otherTargetCol === col && tile > other) {
							lc++;
						}
					}
				}
			}
		}

		return md + 2 * lc;
	}

	const fact = [1];
	for (let i = 1; i <= 16; i++) fact[i] = fact[i - 1] * i;

	// Optimization: bitCount for 32-bit integer
	function bitCount(n: number) {
		n = n - ((n >>> 1) & 0x55555555);
		n = (n & 0x33333333) + ((n >>> 2) & 0x33333333);
		return Math.imul((n + (n >>> 4)) & 0x0f0f0f0f, 0x01010101) >>> 24;
	}

	function rankPattern(state: number[], items: number[]) {
		let rank = 0;
		let available = 0xffff;

		for (let i = 0; i < items.length; i++) {
			const val = items[i];
			const pos = state.indexOf(val);

			// Count available slots before pos
			const mask = available & ((1 << pos) - 1);
			const count = bitCount(mask);

			const n = 16 - 1 - i;
			const k = items.length - 1 - i;

			// perm(n, k) is fact[n] / fact[n-k]
			rank += count * (fact[n] / fact[n - k]);

			available &= ~(1 << pos);
		}
		return rank;
	}

	// Pre-allocate items arrays (including 0 for blank)
	const items1 = [0, 1, 2, 3, 4, 5, 6]; // 6-6-3
	const items2 = [0, 7, 8, 9, 10, 11, 12];
	const items3 = [0, 13, 14, 15];

	function heuristicPDB(state: number[]) {
		if (!pdbReady) return calculateHeuristic(state);

		const r1 = rankPattern(state, items1);
		const r2 = rankPattern(state, items2);
		const r3 = rankPattern(state, items3);

		if (pdb1[r1] === 255 || pdb2[r2] === 255 || pdb3[r3] === 255) {
			return calculateHeuristic(state);
		}

		return pdb1[r1] + pdb2[r2] + pdb3[r3];
	}

	let exactMoves = $state<number | null>(null);
	let isComputing = $state(false);

	let solveVersion = 0;
	let solveDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	const EXACT_SOLVE_DEBOUNCE_MS = 150;
	const exactCache = new SvelteMap<string, number>();
	const prefetchingKeys = new SvelteMap<string, boolean>();
	let prefetchVersion = 0;
	let prefetchTimer: ReturnType<typeof setTimeout> | null = null;
	const PREFETCH_DELAY_MS = 60;
	const PREFETCH_MAX_STATES = 12;

	$effect(() => {
		const currentTiles = [...tiles];
		const cacheKey = getStateKey(currentTiles);

		if (solveDebounceTimer) {
			clearTimeout(solveDebounceTimer);
			solveDebounceTimer = null;
		}

		if (!pdbReady && !pdbLoadFailed) {
			isComputing = false;
			return;
		}

		if (exactCache.has(cacheKey)) {
			exactMoves = exactCache.get(cacheKey) ?? null;
			isComputing = false;
			scheduleNextStatePrefetch(currentTiles);
			return;
		}

		// 既にソルブ済みなら即座に反映して計算中フラグを解除する
		if (isGoalState(currentTiles)) {
			exactMoves = 0;
			exactCache.set(cacheKey, 0);
			isComputing = false;
			return;
		}

		const version = ++solveVersion;
		// キャッシュ未ヒット時は前回値を維持し、初回だけローディング表示する
		isComputing = exactMoves === null;

		solveDebounceTimer = setTimeout(() => {
			if (version !== solveVersion) return;

			isComputing = true;

			(async () => {
				try {
					if (prefetchingKeys.has(cacheKey)) {
						return;
					}
					const result = await solve15Async(currentTiles, () => version === solveVersion);
					if (version === solveVersion && result !== Infinity) {
						exactCache.set(cacheKey, result);
						exactMoves = result;
						scheduleNextStatePrefetch(currentTiles);
					}
				} catch (err) {
					// エラー時はコンソールに出力して計算中フラグを解除する
					console.error('solve15Async failed', err);
				} finally {
					if (version === solveVersion) {
						isComputing = false;
					}
				}
			})();
		}, EXACT_SOLVE_DEBOUNCE_MS);
	});

	const NEIGHBORS_BY_INDEX = Array.from({ length: CELL_COUNT }, (_, index) => {
		const neighbors: number[] = [];
		const row = Math.floor(index / SIZE);
		const col = index % SIZE;
		if (row > 0) neighbors.push(index - SIZE);
		if (row < SIZE - 1) neighbors.push(index + SIZE);
		if (col > 0) neighbors.push(index - 1);
		if (col < SIZE - 1) neighbors.push(index + 1);
		return neighbors;
	});

	function getNeighborStates(state: number[]): number[][] {
		const emptyIndex = state.indexOf(0);
		const neighbors = getNeighbors(emptyIndex);
		return neighbors.map((neighborIndex) => swapState(state, emptyIndex, neighborIndex));
	}

	function getPrefetchTargetsTwoPly(sourceTiles: number[]) {
		const sourceKey = getStateKey(sourceTiles);
		const level1 = getNeighborStates(sourceTiles);
		const results: number[][] = [];
		const seen: Record<string, true> = {};

		const addState = (state: number[]) => {
			const key = getStateKey(state);
			if (key === sourceKey) return;
			if (seen[key]) return;
			seen[key] = true;
			results.push(state);
		};

		for (const state of level1) addState(state);
		for (const state of level1) {
			for (const state2 of getNeighborStates(state)) {
				addState(state2);
				if (results.length >= PREFETCH_MAX_STATES) {
					return results;
				}
			}
		}

		return results;
	}

	function scheduleNextStatePrefetch(sourceTiles: number[]) {
		if (!pdbReady && !pdbLoadFailed) return;

		if (prefetchTimer) {
			clearTimeout(prefetchTimer);
			prefetchTimer = null;
		}

		const source = [...sourceTiles];
		const version = ++prefetchVersion;

		prefetchTimer = setTimeout(() => {
			void prefetchNextStates(source, version);
		}, PREFETCH_DELAY_MS);
	}

	async function prefetchNextStates(sourceTiles: number[], version: number) {
		const nextStates = getPrefetchTargetsTwoPly(sourceTiles);

		for (const nextState of nextStates) {
			if (version !== prefetchVersion) return;

			const key = getStateKey(nextState);
			if (exactCache.has(key)) continue;
			if (prefetchingKeys.has(key)) continue;

			prefetchingKeys.set(key, true);

			try {
				const result = await solve15Async(nextState, () => version === prefetchVersion);
				if (version !== prefetchVersion) return;
				if (result === Infinity) return;

				exactCache.set(key, result);
			} finally {
				prefetchingKeys.delete(key);
			}
			await new Promise(requestAnimationFrame);
		}
	}

	async function solve15Async(startTiles: number[], isCurrent: () => boolean): Promise<number> {
		const tiles = [...startTiles];
		let blank = tiles.indexOf(0);

		let bound = heuristicPDB(tiles);
		let nodeCounter = 0;
		const YIELD_INTERVAL = 1000;

		async function search(g: number, h: number, previousBlank: number): Promise<number> {
			if (!isCurrent()) return Infinity;

			const f = g + h;
			if (f > bound) return f;
			if (h === 0) return -1;

			let min = Infinity;

			nodeCounter++;
			if (nodeCounter % YIELD_INTERVAL === 0) {
				await new Promise(requestAnimationFrame);
			}

			for (const next of getNeighbors(blank)) {
				if (next === previousBlank) continue;
				const tile = tiles[next];

				// swap
				tiles[blank] = tile;
				tiles[next] = 0;

				const newH = heuristicPDB(tiles);

				const oldBlank = blank;
				blank = next;

				const tRes = await search(g + 1, newH, oldBlank);

				blank = oldBlank;

				// undo
				tiles[next] = tile;
				tiles[blank] = 0;

				if (tRes === Infinity) return Infinity;
				if (tRes === -1) return -1;
				if (tRes < min) min = tRes;
			}

			return min;
		}

		while (true) {
			if (!isCurrent()) return Infinity;

			nodeCounter = 0;
			const t = await search(0, heuristicPDB(tiles), -1);
			if (t === -1) return bound;
			if (t === Infinity) return Infinity;
			bound = t;
		}
	}

	// Persistence (自動保存)
	$effect(() => {
		if (isInitialized) {
			localStorage.setItem('15-puzzle-state', JSON.stringify({ tiles, moves, bestScore }));
		}
	});

	onMount(async () => {
		try {
			const saved = JSON.parse(localStorage.getItem('15-puzzle-state') || 'null');
			if (saved?.tiles && saved.tiles.length === 16) {
				tiles = saved.tiles;
				moves = saved.moves;
				bestScore = saved.bestScore || 0;
			} else {
				reset();
			}
		} catch {
			reset();
		}
		isInitialized = true;
		gameContainer?.focus();

		try {
			const [r1, r2, r3] = await Promise.all([
				fetch(`${base}/pdb6_1.bin`),
				fetch(`${base}/pdb6_2.bin`),
				fetch(`${base}/pdb6_3.bin`)
			]);

			if (!r1.ok || !r2.ok || !r3.ok) {
				throw new Error('Failed to fetch one or more PDB files');
			}

			pdb1 = new Uint8Array(await r1.arrayBuffer());
			pdb2 = new Uint8Array(await r2.arrayBuffer());
			pdb3 = new Uint8Array(await r3.arrayBuffer());

			pdbReady = true;
			console.log('PDB loaded');
		} catch (e) {
			pdbLoadFailed = true;
			console.error('PDB load failed', e);
		}
	});

	// Game Logic
	function reset(fullReset = false) {
		if (fullReset) bestScore = 0;
		moves = 0;
		solveVersion++;
		if (solveDebounceTimer) {
			clearTimeout(solveDebounceTimer);
			solveDebounceTimer = null;
		}
		prefetchVersion++;
		if (prefetchTimer) {
			clearTimeout(prefetchTimer);
			prefetchTimer = null;
		}
		prefetchingKeys.clear();
		exactCache.clear();
		exactMoves = null;
		isComputing = false;
		// Initialize solved state
		tiles = [...GOAL_TILES];
		shuffle();
	}

	function shuffle() {
		// Shuffle by performing random valid moves to ensure solvability
		let previousIndex = -1;
		let emptyIndex = tiles.indexOf(0);
		let shuffleMoves = 100;

		while (shuffleMoves > 0) {
			const neighbors = getNeighbors(emptyIndex);
			// Prevent undoing the immediate last move to make shuffling more effective
			const validNeighbors = neighbors.filter((n) => n !== previousIndex);
			const randomNeighbor = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];

			if (randomNeighbor !== undefined) {
				// Swap without animation or checking win condition
				[tiles[emptyIndex], tiles[randomNeighbor]] = [tiles[randomNeighbor], tiles[emptyIndex]];
				previousIndex = emptyIndex;
				emptyIndex = randomNeighbor;
				shuffleMoves--;
			}
		}
		moves = 0; // Reset moves count after shuffle
	}

	function getNeighbors(index: number): number[] {
		return NEIGHBORS_BY_INDEX[index];
	}

	function move(tileIndex: number) {
		// ソルブ状態での移動は、ソルブ状態が初期ロードされた場合などは許可するが、
		// ゲームプレイとして完了した後の意図しない移動は防ぐべきかもしれない。
		// ここでは元のロジックを踏襲する。

		const emptyIndex = tiles.indexOf(0);
		const neighbors = getNeighbors(emptyIndex);

		if (neighbors.includes(tileIndex)) {
			// Swap
			const newTiles = [...tiles];
			[newTiles[emptyIndex], newTiles[tileIndex]] = [newTiles[tileIndex], newTiles[emptyIndex]];
			tiles = newTiles;
			moves++;

			// Check win
			if (isSolved) {
				if (bestScore === 0 || moves < bestScore) {
					bestScore = moves;
				}
			}
		}
	}

	function handleKey(e: KeyboardEvent) {
		if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
			// GameContainer prevents default for these keys if onKeyDown is passed
			const emptyIndex = tiles.indexOf(0);
			const row = Math.floor(emptyIndex / SIZE);
			const col = emptyIndex % SIZE;
			let targetIndex = -1;

			// Logic matches the direction the user wants a TILE to move
			if (e.key === 'ArrowUp' && row < SIZE - 1) targetIndex = emptyIndex + SIZE;
			if (e.key === 'ArrowDown' && row > 0) targetIndex = emptyIndex - SIZE;
			if (e.key === 'ArrowLeft' && col < SIZE - 1) targetIndex = emptyIndex + 1;
			if (e.key === 'ArrowRight' && col > 0) targetIndex = emptyIndex - 1;

			if (targetIndex !== -1) {
				move(targetIndex);
			}
		}
	}

	function handleTouch(e: TouchEvent, type: 'start' | 'end') {
		if (type === 'start') {
			touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
		} else if (touchStart.x || touchStart.y) {
			const dx = e.changedTouches[0].clientX - touchStart.x;
			const dy = e.changedTouches[0].clientY - touchStart.y;
			if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
				const emptyIndex = tiles.indexOf(0);
				const row = Math.floor(emptyIndex / SIZE);
				const col = emptyIndex % SIZE;
				let targetIndex = -1;

				if (Math.abs(dx) > Math.abs(dy)) {
					// Horizontal swipe
					if (dx > 0 && col > 0)
						targetIndex = emptyIndex - 1; // Swipe Right -> move Left tile into empty
					else if (dx < 0 && col < SIZE - 1) targetIndex = emptyIndex + 1; // Swipe Left -> move Right tile into empty
				} else {
					// Vertical swipe
					if (dy > 0 && row > 0)
						targetIndex = emptyIndex - SIZE; // Swipe Down -> move Up tile into empty
					else if (dy < 0 && row < SIZE - 1) targetIndex = emptyIndex + SIZE; // Swipe Up -> move Down tile into empty
				}

				if (targetIndex !== -1) {
					move(targetIndex);
				}
			}
		}
	}
</script>

<GameContainer
	title="15 Puzzle"
	subtitle="数字を順番に並べよう"
	bind:isFocused
	bind:gameContainer
	gridSize={SIZE}
	items={tiles}
	onReset={() => reset()}
	onKeyDown={handleKey}
	ontouchstart={(e) => handleTouch(e, 'start')}
	ontouchend={(e) => handleTouch(e, 'end')}
>
	{#snippet scoreBoard()}
		<ScoreBox label="残り" value={exactMoves ?? '-'} loading={isComputing && exactMoves === null} />
		<ScoreBox label="Moves" value={moves} />
		<ScoreBox label="Best" value={bestScore === 0 ? '-' : bestScore} />
	{/snippet}

	{#snippet overlay()}
		<GameOverlay
			visible={isSolved && moves > 0}
			title="Solved!"
			message={`Moves: ${moves}`}
			primaryAction={{ label: 'Play Again', onclick: () => reset() }}
		/>
	{/snippet}

	{#snippet gameBoard(tile, i)}
		<div class="h-full w-full">
			{#if tile !== 0}
				<button
					class="flex h-full w-full items-center justify-center rounded-md text-2xl
					font-bold shadow-sm transition-colors active:scale-95
					{isSolved
						? 'bg-accent text-accent-content'
						: tile === i + 1
							? 'bg-success text-success-content'
							: 'border border-base-content/10 bg-base-200 text-base-content hover:bg-base-300'}"
					onclick={() => move(tiles.indexOf(tile))}
					tabindex="-1"
				>
					{tile}
				</button>
			{/if}
		</div>
	{/snippet}

	{#snippet controls()}
		<div class="flex items-center gap-2 text-xs">
			<div class="flex gap-1">
				<kbd class="kbd kbd-sm">←</kbd>
				<kbd class="kbd kbd-sm">↓</kbd>
				<kbd class="kbd kbd-sm">↑</kbd>
				<kbd class="kbd kbd-sm">→</kbd>
			</div>
			<span>or スワイプ</span>
		</div>
	{/snippet}
</GameContainer>
