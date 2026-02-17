<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import GameContainer from './shared/GameContainer.svelte';
	import ScoreBox from './shared/ScoreBox.svelte';
	import GameTile from './shared/GameTile.svelte';
	import GameOverlay from './shared/GameOverlay.svelte';

	const SIZE = 4;

	// State
	let grid = $state(Array.from({ length: SIZE }, () => Array(SIZE).fill(false)));
	let actualClicks = $state(0);
	let bestScore = $state(-1);
	let minMoves = $state(0);
	let isFocused = $state(false);
	let isInitialized = $state(false);
	let gameContainer = $state<HTMLDivElement | null>(null);

	// 表示用のムーブス（最短手数からカウントダウン）
	const moves = $derived(minMoves - actualClicks);

	// Derived
	// ライツアウトは通常「すべて消灯」を目指すが、実装によっては「すべて点灯」の場合もある。
	// ここでは「すべて消灯 (false)」を勝利条件とする。
	const isGameWon = $derived(grid.every((row) => row.every((cell) => !cell)));

	// Persistence
	$effect(() => {
		if (isInitialized) {
			localStorage.setItem(
				'lightsout-state',
				JSON.stringify({
					grid,
					actualClicks,
					bestScore
				})
			);
		}
	});

	onMount(() => {
		try {
			const saved = JSON.parse(localStorage.getItem('lightsout-state') || 'null');
			if (saved?.grid && saved.grid.length === SIZE) {
				grid = saved.grid;
				actualClicks = saved.actualClicks || 0;
				bestScore = saved.bestScore || -1;
			} else {
				reset();
			}
		} catch {
			reset();
		}
		isInitialized = true;
		gameContainer?.focus();
	});

	// グリッドを一意の状態に変換する (Boolean配列 -> 数値)
	function gridToState(gridToConvert: boolean[][]): number {
		let state = 0;
		let bit = 0;
		for (let r = 0; r < SIZE; r++) {
			for (let c = 0; c < SIZE; c++) {
				if (gridToConvert[r][c]) {
					state |= 1 << bit;
				}
				bit++;
			}
		}
		return state;
	}

	// 状態から隣接する状態を生成する
	function getNextStates(state: number): number[] {
		const nextStates: number[] = [];
		for (let r = 0; r < SIZE; r++) {
			for (let c = 0; c < SIZE; c++) {
				const newState = state ^ getToggleMask(r, c);
				nextStates.push(newState);
			}
		}
		return nextStates;
	}

	// 指定された位置をクリックした時のマスク値を取得する
	function getToggleMask(r: number, c: number): number {
		let mask = 0;
		const setBit = (row: number, col: number) => {
			if (row >= 0 && row < SIZE && col >= 0 && col < SIZE) {
				mask |= 1 << (row * SIZE + col);
			}
		};
		setBit(r, c);
		setBit(r - 1, c);
		setBit(r + 1, c);
		setBit(r, c - 1);
		setBit(r, c + 1);
		return mask;
	}

	// BFSで最短手数を計算する
	function calculateMinMoves(gridToSolve: boolean[][]): number {
		const initialState = gridToState(gridToSolve);
		const goalState = 0; // すべて消灯

		if (initialState === goalState) {
			return 0;
		}

		const visited = new Set<number>();
		const queue: Array<{ state: number; moves: number }> = [{ state: initialState, moves: 0 }];
		visited.add(initialState);

		while (queue.length > 0) {
			const { state, moves: currentMoves } = queue.shift()!;

			for (const nextState of getNextStates(state)) {
				if (nextState === goalState) {
					return currentMoves + 1;
				}

				if (!visited.has(nextState)) {
					visited.add(nextState);
					queue.push({ state: nextState, moves: currentMoves + 1 });
				}
			}
		}

		// これは到達不可能な状態を意味する（生成時は発生しないはず）
		return -1;
	}

	function reset(resetBest = false) {
		if (resetBest) bestScore = -1;
		actualClicks = 0;

		// 最短手数が4以上になるまで盤面を生成する
		let newGrid: boolean[][];
		let calculatedMinMoves: number;

		do {
			// Create a soluble board by starting with all lights off and simulating random clicks
			// This ensures the puzzle is always solvable
			newGrid = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

			// Apply random moves
			for (let i = 0; i < 20; i++) {
				const r = Math.floor(Math.random() * SIZE);
				const c = Math.floor(Math.random() * SIZE);
				toggleCell(newGrid, r, c);
			}

			// If simply by chance we ended up with all lights off, do it again
			if (newGrid.every((row) => row.every((cell) => !cell))) {
				const r = Math.floor(Math.random() * SIZE);
				const c = Math.floor(Math.random() * SIZE);
				toggleCell(newGrid, r, c);
			}

			calculatedMinMoves = calculateMinMoves(newGrid);
		} while (calculatedMinMoves < 4);

		grid = newGrid;
		minMoves = calculatedMinMoves;
	}

	function toggleCell(targetGrid: boolean[][], r: number, c: number) {
		const toggle = (row: number, col: number) => {
			if (row >= 0 && row < SIZE && col >= 0 && col < SIZE) {
				targetGrid[row][col] = !targetGrid[row][col];
			}
		};

		toggle(r, c);
		toggle(r - 1, c);
		toggle(r + 1, c);
		toggle(r, c - 1);
		toggle(r, c + 1);
	}

	function handleClick(r: number, c: number) {
		if (isGameWon) return;

		// Deep copy to trigger updates if needed, though $state with nested arrays usually needs careful handling.
		// Svelte 5 proxies should handle nested updates, but for matrix mutation explicitly:
		const newGrid = grid.map((row) => [...row]);
		toggleCell(newGrid, r, c);
		grid = newGrid;

		actualClicks++;

		if (isGameWon) {
			const difference = actualClicks - minMoves;
			if (bestScore === -1 || difference < bestScore) {
				bestScore = difference;
			}
		}
	}

	function handleKey(e: KeyboardEvent) {
		if (e.key === 'r' || e.key === 'R') {
			reset();
		}
	}
</script>

<GameContainer
	title="Lights Out"
	subtitle="全てのライトを消そう"
	bind:isFocused
	bind:gameContainer
	gridSize={SIZE}
	items={grid.flat()}
	onReset={() => reset()}
	onKeyDown={handleKey}
>
	{#snippet scoreBoard()}
		<ScoreBox label="Moves" value={moves} />
		<ScoreBox label="Best" value={bestScore === -1 ? '-' : `+${bestScore}`} />
	{/snippet}

	{#snippet overlay()}
		<GameOverlay
			visible={isGameWon}
			title="Cleared!"
			message={`Moves: ${moves}`}
			primaryAction={{ label: 'Play Again', onclick: () => reset() }}
		/>
	{/snippet}

	{#snippet gameBoard(isOn, i)}
		{@const r = Math.floor(i / SIZE)}
		{@const c = i % SIZE}
		<GameTile
			active={isOn}
			onclick={() => handleClick(r, c)}
			class={isOn ? 'text-4xl text-warning-content' : ''}
			icon={isOn ? 'lightbulb' : ''}
			aria-label={`Toggle light at row ${r}, column ${c}, currently ${isOn ? 'on' : 'off'}`}
		/>
	{/snippet}
</GameContainer>
