<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	const SIZE = 4;

	// State (Svelte 5 Runes)
	let grid = $state(Array.from({ length: SIZE }, () => Array(SIZE).fill(0)));
	let score = $state(0);
	let bestScore = $state(0);
	let gameWonContinues = $state(false);
	let isFocused = $state(false);
	let gameContainer: HTMLDivElement;
	let touchStart = { x: 0, y: 0 };
	let isInitialized = $state(false);

	// Derived State
	const flatGrid = $derived(grid.flat());
	const isGameWon = $derived(!gameWonContinues && flatGrid.some((v) => v >= 2048));
	const isGameOver = $derived(
		!flatGrid.includes(0) &&
			grid.every((r, i) => r.every((v, j) => v !== grid[i + 1]?.[j] && v !== r[j + 1]))
	);

	// Persistence (自動保存)
	$effect(() => {
		// データの復元が終わるまでは保存処理をブロックする
		if (isInitialized) {
			localStorage.setItem(
				'2048-state',
				JSON.stringify({ grid, score, gameWonContinues, bestScore })
			);
		}
	});

	onMount(() => {
		try {
			const saved = JSON.parse(localStorage.getItem('2048-state') || 'null');
			// saved.gridが存在し、かつ盤面に1つ以上の数字(0より大きい値)が含まれているかを確認
			if (saved?.grid && saved.grid.flat().some((v: number) => v > 0)) {
				grid = saved.grid;
				score = saved.score;
				bestScore = saved.bestScore;
				gameWonContinues = saved.gameWonContinues;
			} else {
				// データが無い、あるいはすべて0の場合はリセット(初期配置)する
				reset();
			}
		} catch {
			reset();
		}
		isInitialized = true; // 復元処理が完了したのでフラグを有効化
		gameContainer?.focus();
	});

	// Game Logic
	function reset(clearBest = false) {
		grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
		score = 0;
		gameWonContinues = false;
		if (clearBest) bestScore = 0;
		addNumber();
		addNumber();
	}

	function addNumber() {
		const opts: { x: number; y: number }[] = [];
		grid.forEach((r, x) => r.forEach((v, y) => v === 0 && opts.push({ x, y })));
		if (opts.length) {
			const { x, y } = opts[Math.floor(Math.random() * opts.length)];
			grid[x][y] = Math.random() > 0.1 ? 2 : 4;
		}
	}

	function processRow(row: number[]) {
		let v = row.filter((x) => x),
			gain = 0;
		for (let i = 0; i < v.length - 1; i++) {
			if (v[i] === v[i + 1]) {
				v[i] *= 2;
				gain += v[i];
				v.splice(i + 1, 1);
			}
		}
		return { newRow: [...v, ...Array(SIZE - v.length).fill(0)], gain };
	}

	function move(key: string) {
		if (isGameWon || (isGameOver && !isGameWon)) return;

		const strategies: Record<
			string,
			{ get: (r: number, c: number) => number; set: (r: number, c: number, v: number) => void }
		> = {
			ArrowLeft: { get: (r, c) => grid[r][c], set: (r, c, v) => (grid[r][c] = v) },
			ArrowRight: { get: (r, c) => grid[r][3 - c], set: (r, c, v) => (grid[r][3 - c] = v) },
			ArrowUp: { get: (r, c) => grid[c][r], set: (r, c, v) => (grid[c][r] = v) },
			ArrowDown: { get: (r, c) => grid[3 - c][r], set: (r, c, v) => (grid[3 - c][r] = v) }
		};

		const strategy = strategies[key];
		if (!strategy) return;

		const oldGridJSON = JSON.stringify(grid);
		let gain = 0;

		for (let i = 0; i < SIZE; i++) {
			const line = Array.from({ length: SIZE }, (_, j) => strategy.get(i, j));
			const res = processRow(line);
			gain += res.gain;
			res.newRow.forEach((v, j) => strategy.set(i, j, v));
		}

		if (JSON.stringify(grid) !== oldGridJSON) {
			score += gain;
			if (score > bestScore) bestScore = score;
			addNumber();
		}
	}

	// Input Handlers
	function handleKey(e: KeyboardEvent) {
		if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
			e.preventDefault();
			move(e.key);
		}
	}

	function handleTouch(e: TouchEvent, type: 'start' | 'end') {
		if (type === 'start') {
			touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
		} else if (touchStart.x || touchStart.y) {
			const dx = e.changedTouches[0].clientX - touchStart.x;
			const dy = e.changedTouches[0].clientY - touchStart.y;
			if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
				move(
					Math.abs(dx) > Math.abs(dy)
						? dx > 0
							? 'ArrowRight'
							: 'ArrowLeft'
						: dy > 0
							? 'ArrowDown'
							: 'ArrowUp'
				);
			}
		}
	}

	// Helpers
	const getTileColor = (v: number) => {
		if (v > 2048)
			return 'bg-neutral text-neutral-content text-xl shadow-lg border border-neutral-content/20';
		return (
			{
				2: 'bg-base-200 text-base-content font-bold border border-base-300',
				4: 'bg-base-300 text-base-content font-bold border border-base-content/10',
				8: 'bg-warning/20 text-warning-content font-bold border border-warning/30',
				16: 'bg-warning/40 text-warning-content font-bold border border-warning/50',
				32: 'bg-warning/60 text-warning-content font-bold border border-warning/70',
				64: 'bg-warning text-warning-content font-bold',
				128: 'bg-error/60 text-error-content text-3xl font-bold',
				256: 'bg-error/80 text-error-content text-3xl font-bold',
				512: 'bg-error text-error-content text-3xl font-bold',
				1024: 'bg-secondary text-secondary-content text-2xl font-bold',
				2048: 'bg-accent text-accent-content text-2xl font-bold shadow-[0_0_15px_oklch(var(--a)/0.5)]'
			}[v] || 'bg-base-200 text-base-content'
		);
	};
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
		aria-label="2048 Game Board"
		bind:this={gameContainer}
		onkeydown={handleKey}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
	>
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h2 class="text-3xl font-bold text-base-content">2048</h2>
				<p class="text-xs text-base-content/60">数字を合体させて2048を目指そう</p>
			</div>
			<div class="flex gap-2 text-right">
				{@render scoreBox('Score', score)}
				{@render scoreBox('Best', bestScore)}
			</div>
		</div>

		<div
			class="relative aspect-square touch-none rounded-lg border border-base-content/10 bg-base-300/50 p-2 select-none"
			ontouchstart={(e) => handleTouch(e, 'start')}
			ontouchend={(e) => handleTouch(e, 'end')}
		>
			{#if isGameOver && !isGameWon}
				<div
					transition:fade={{ duration: 200 }}
					class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-base-300/90 text-base-content backdrop-blur-sm"
				>
					<div class="mb-4 text-4xl font-bold drop-shadow-md">Game Over!</div>
					<div class="flex gap-3">
						{@render btn('Replay', () => reset(), true)}
					</div>
				</div>
			{/if}

			{#if isGameWon}
				<div
					transition:fade={{ duration: 200 }}
					class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-accent/90 text-accent-content backdrop-blur-sm"
				>
					<div class="mb-4 text-4xl font-bold drop-shadow-md">You Win!</div>
					<div class="flex gap-3">
						{@render btn('Continue', () => (gameWonContinues = true), true)}
						{@render btn('Restart', () => reset(), false)}
					</div>
				</div>
			{/if}

			<div class="grid h-full grid-cols-4 grid-rows-4 gap-2">
				{#each grid as row, r}
					{#each row as cell, c}
						{@render tile(cell, r, c)}
					{/each}
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

{#snippet tile(cell: number, r: number, c: number)}
	<div class="relative h-full w-full rounded-md bg-base-200/50">
		{#if cell > 0}
			{#key `${r}-${c}-${cell}`}
				<div
					class="absolute inset-0 flex items-center justify-center rounded-md font-bold transition-all duration-100 {getTileColor(
						cell
					)}"
					in:scale={{ duration: 150, start: 0.5 }}
				>
					{cell}
				</div>
			{/key}
		{/if}
	</div>
{/snippet}
