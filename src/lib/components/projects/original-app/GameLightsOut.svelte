<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	const SIZE = 4;

	// State
	let grid = $state(Array.from({ length: SIZE }, () => Array(SIZE).fill(false)));
	let moves = $state(0);
	let bestScore = $state(0);
	let isFocused = $state(false);
	let isInitialized = $state(false);
	let gameContainer: HTMLDivElement;

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
		aria-label="Lights Out Game Board"
		bind:this={gameContainer}
		onkeydown={handleKey}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
	>
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h2 class="text-3xl font-bold text-base-content">Lights Out</h2>
				<p class="text-xs text-base-content/60">全てのライトを消そう</p>
			</div>
			<div class="flex gap-2 text-right">
				{@render scoreBox('Moves', moves)}
				{@render scoreBox('Best', bestScore === 0 ? '-' : bestScore)}
			</div>
		</div>

		<div
			class="relative aspect-square touch-none rounded-lg border border-base-content/10 bg-base-300/50 p-2 select-none"
		>
			{#if isGameWon}
				<div
					transition:fade={{ duration: 200 }}
					class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-accent/90 text-accent-content backdrop-blur-sm"
				>
					<div class="mb-4 text-4xl font-bold drop-shadow-md">Cleared!</div>
					<div class="mb-2 text-lg">Moves: {moves}</div>
					<div class="flex gap-3">
						{@render btn('Play Again', () => reset(), true)}
					</div>
				</div>
			{/if}

			<div class="grid h-full gap-2" style="grid-template-columns: repeat({SIZE}, minmax(0, 1fr));">
				{#each grid as row, r}
					{#each row as isOn, c}
						<button
							class="relative h-full w-full rounded-md shadow-sm transition-all duration-300 active:scale-95
                            {isOn
								? 'border border-warning-content/20 bg-warning text-warning-content shadow-[0_0_15px_oklch(var(--wa)/0.6)]'
								: 'border border-base-content/5 bg-base-300/50 text-base-content/20'}"
							onclick={() => handleClick(r, c)}
							aria-label={`Toggle light at row ${r}, column ${c}, currently ${isOn ? 'on' : 'off'}`}
						>
							<!-- Bulb icon or just color -->
							<div class="absolute inset-0 flex items-center justify-center">
								{#if isOn}
									<span in:scale={{ duration: 200 }} class="text-2xl">💡</span>
								{/if}
							</div>
						</button>
					{/each}
				{/each}
			</div>
		</div>

		<div class="mt-4 flex items-center justify-between text-sm text-base-content/60">
			<div>
				{#if !isFocused}
					<span class="animate-pulse font-bold text-primary">クリックして開始</span>
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
