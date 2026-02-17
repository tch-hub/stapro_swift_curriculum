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
	let moves = $state(0);
	let bestScore = $state(0);
	let isFocused = $state(false);
	let isInitialized = $state(false);
	let gameContainer = $state<HTMLDivElement | null>(null);

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
					moves,
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
	});

	function reset(resetBest = false) {
		if (resetBest) bestScore = 0;
		moves = 0;

		// Create a soluble board by starting with all lights off and simulating random clicks
		// This ensures the puzzle is always solvable
		const newGrid = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

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

		grid = newGrid;
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

		moves++;

		if (isGameWon) {
			if (bestScore === 0 || moves < bestScore) {
				bestScore = moves;
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
		<ScoreBox label="Best" value={bestScore === 0 ? '-' : bestScore} />
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
