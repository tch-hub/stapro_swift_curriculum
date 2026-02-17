<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	const SIZE = 4;

	let pdb1: Uint8Array;
	let pdb2: Uint8Array;
	let pdb3: Uint8Array;
	let pdbReady = $state(false);

	// State (Svelte 5 Runes)
	// 0 represents the empty tile
	let tiles = $state(Array.from({ length: SIZE * SIZE }, (_, i) => (i + 1) % (SIZE * SIZE)));
	// ... (lines 16-83 skipped)
	let moves = $state(0);
	let bestScore = $state(0); // Lower is better for 15 puzzle
	let isFocused = $state(false);
	let gameContainer: HTMLDivElement;
	let touchStart = { x: 0, y: 0 };
	let isInitialized = $state(false);

	// Derived State
	const isSolved = $derived(
		tiles.every((tile, index) => tile === (index + 1) % (SIZE * SIZE)) && tiles[15] === 0
	);

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

	function perm(n: number, k: number) {
		if (k < 0 || k > n) return 0;
		return fact[n] / fact[n - k];
	}

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

	const estimatedMoves = $derived(heuristicPDB(tiles));

	let exactMoves = $state<number | null>(null);
	let isComputing = $state(false);

	let solveVersion = 0;

	$effect(() => {
		const currentTiles = [...tiles];
		exactMoves = null;

		if (currentTiles.every((t, i) => (i === 15 ? t === 0 : t === i + 1))) {
			exactMoves = 0;
			return;
		}

		const version = ++solveVersion;
		isComputing = true;

		(async () => {
			const result = await solve15Async(currentTiles);

			if (version === solveVersion) {
				exactMoves = result;
				isComputing = false;
			}
		})();
	});

	// Simple IDA* implementation
	async function solve15Async(startTiles: number[]): Promise<number> {
		const SIZE = 4;
		const tiles = [...startTiles];
		let blank = tiles.indexOf(0);

		const opposite = [1, 0, 3, 2]; // U,D,L,R
		const dirs = [-4, 4, -1, 1];

		let bound = heuristicPDB(tiles);
		let nodeCounter = 0;
		const YIELD_INTERVAL = 1000;

		async function search(g: number, h: number, prevMove: number): Promise<number> {
			const f = g + h;
			if (f > bound) return f;
			if (h === 0) return -1;

			let min = Infinity;

			nodeCounter++;
			if (nodeCounter % YIELD_INTERVAL === 0) {
				await new Promise(requestAnimationFrame);
			}

			const row = (blank / 4) | 0;
			const col = blank % 4;

			for (let move = 0; move < 4; move++) {
				if (prevMove !== -1 && move === opposite[prevMove]) continue;

				if (move === 0 && row === 0) continue;
				if (move === 1 && row === 3) continue;
				if (move === 2 && col === 0) continue;
				if (move === 3 && col === 3) continue;

				const next = blank + dirs[move];
				const tile = tiles[next];

				// swap
				tiles[blank] = tile;
				tiles[next] = 0;

				const newH = heuristicPDB(tiles);

				const oldBlank = blank;
				blank = next;

				const tRes = await search(g + 1, newH, move);

				blank = oldBlank;

				// undo
				tiles[next] = tile;
				tiles[blank] = 0;

				if (tRes === -1) return -1;
				if (tRes < min) min = tRes;
			}

			return min;
		}

		while (true) {
			nodeCounter = 0;
			const t = await search(0, heuristicPDB(tiles), -1);
			if (t === -1) return bound;
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
				fetch('/pdb6_1.bin'),
				fetch('/pdb6_2.bin'),
				fetch('/pdb6_3.bin')
			]);

			pdb1 = new Uint8Array(await r1.arrayBuffer());
			pdb2 = new Uint8Array(await r2.arrayBuffer());
			pdb3 = new Uint8Array(await r3.arrayBuffer());

			pdbReady = true;
			console.log('PDB loaded');
		} catch (e) {
			console.error('PDB load failed', e);
		}
	});

	// Game Logic
	function reset(fullReset = false) {
		if (fullReset) bestScore = 0;
		moves = 0;
		// Initialize solved state
		tiles = Array.from({ length: SIZE * SIZE }, (_, i) => (i + 1) % (SIZE * SIZE));
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
		const neighbors = [];
		const row = Math.floor(index / SIZE);
		const col = index % SIZE;

		if (row > 0) neighbors.push(index - SIZE); // Up
		if (row < SIZE - 1) neighbors.push(index + SIZE); // Down
		if (col > 0) neighbors.push(index - 1); // Left
		if (col < SIZE - 1) neighbors.push(index + 1); // Right

		return neighbors;
	}

	function move(tileIndex: number) {
		if (isSolved && moves > 0) return; // Don't move if already won (unless it was just loaded as valid)

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
			e.preventDefault();
			const emptyIndex = tiles.indexOf(0);
			const row = Math.floor(emptyIndex / SIZE);
			const col = emptyIndex % SIZE;
			let targetIndex = -1;

			// Logic matches the direction the user wants a TILE to move
			// e.g. ArrowUp means user wants a tile BELOW the empty space to move UP (into the empty space)
			// So we look for the neighbor 'Down' from the empty space.
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

<div
	class="color-base-100 mockup-window w-full border border-base-300 p-4"
	onclick={() => gameContainer?.focus()}
	role="button"
	tabindex="-1"
	onkeydown={() => {}}
>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="mx-auto max-w-sm ring-offset-2 transition-all outline-none"
		tabindex="0"
		role="application"
		aria-label="15 Puzzle Game Board"
		bind:this={gameContainer}
		onkeydown={handleKey}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
	>
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h2 class="text-3xl font-bold text-base-content">15 Puzzle</h2>
				<p class="text-xs text-base-content/60">数字を順番に並べよう</p>
			</div>
			<div class="flex gap-2 text-right">
				{@render scoreBox(
					'残り',
					exactMoves !== null ? exactMoves : isComputing ? '...' : estimatedMoves
				)}
				{@render scoreBox('Moves', moves)}
				{@render scoreBox('Best', bestScore === 0 ? '-' : bestScore)}
			</div>
		</div>

		<div
			class="relative aspect-square touch-none rounded-lg border border-base-content/10 bg-base-300/50 p-2 select-none"
			ontouchstart={(e) => handleTouch(e, 'start')}
			ontouchend={(e) => handleTouch(e, 'end')}
		>
			{#if isSolved && moves > 0}
				<div
					transition:fade={{ duration: 200 }}
					class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-accent/90 text-accent-content backdrop-blur-sm"
				>
					<div class="mb-4 text-4xl font-bold drop-shadow-md">Solved!</div>
					<div class="mb-2 text-lg">Moves: {moves}</div>
					<div class="flex gap-3">
						{@render btn('Play Again', () => reset(), true)}
					</div>
				</div>
			{/if}

			<div class="grid h-full grid-cols-4 grid-rows-4 gap-2">
				{#each tiles as tile, i (tile)}
					<!-- Using a button here for better semantics and interactivity on individual tiles -->
					<div animate:flip={{ duration: 200, easing: cubicOut }} class="h-full w-full">
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
						<!-- Empty slot renders nothing visible but takes up space in grid -->
					</div>
				{/each}
			</div>
		</div>

		<div class="mt-4 flex items-center justify-between text-sm text-base-content/60">
			<div>
				{#if !isFocused}
					<span class="animate-pulse font-bold text-primary">クリックして開始</span>
				{:else}
					<span class="mr-2 inline-block rounded bg-base-300 px-2 py-1 text-xs"
						>矢印キー or スワイプ</span
					>
				{/if}
			</div>
			<button class="transition-colors hover:text-primary hover:underline" onclick={() => reset()}>
				リセット
			</button>
		</div>
	</div>
</div>

{#snippet scoreBox(label, value)}
	<div class="flex min-w-[70px] flex-col items-center justify-center rounded bg-base-200 p-2">
		<div class="text-[10px] tracking-widest uppercase opacity-70">{label}</div>
		<div class="text-lg font-bold">{value}</div>
	</div>
{/snippet}

{#snippet btn(text, act, primary)}
	<button
		class="rounded-full px-6 py-2 font-bold shadow-sm transition hover:scale-105 active:scale-95 {primary
			? 'bg-base-100 text-base-content hover:bg-base-200'
			: 'hover:bg-neutral-focus bg-neutral text-neutral-content'}"
		onclick={(e) => {
			e.stopPropagation();
			act();
		}}
	>
		{text}
	</button>
{/snippet}
