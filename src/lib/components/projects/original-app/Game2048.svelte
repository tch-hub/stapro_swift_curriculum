<script lang="ts">
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import GameContainer from './shared/GameContainer.svelte';
	import ScoreBox from './shared/ScoreBox.svelte';
	import GameOverlay from './shared/GameOverlay.svelte';

	const SIZE = 4;

	// State (Svelte 5 Runes)
	let grid = $state(Array.from({ length: SIZE }, () => Array(SIZE).fill(0)));
	let score = $state(0);
	let bestScore = $state(0);
	let gameWonContinues = $state(false);
	let isFocused = $state(false);
	let gameContainer: HTMLDivElement | undefined = $state();
	let touchStart = { x: 0, y: 0 };
	let isInitialized = $state(false);

	// Derived State
	const flatGrid = $derived(grid.flat());
	// 2048に到達し、かつ「続ける」を選択していない場合に勝利とみなす
	const isGameWon = $derived(!gameWonContinues && flatGrid.some((v) => v >= 2048));
	// 動きようがない場合
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
			// GameContainer prevents default for these keys if we pass the handler
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

<GameContainer
	title="2048"
	subtitle="数字を合体させて2048を目指そう"
	bind:isFocused
	bind:gameContainer
	gridSize={SIZE}
	items={flatGrid}
	onReset={() => reset()}
	onKeyDown={handleKey}
	ontouchstart={(e) => handleTouch(e, 'start')}
	ontouchend={(e) => handleTouch(e, 'end')}
>
	{#snippet scoreBoard()}
		<ScoreBox label="Score" value={score} />
		<ScoreBox label="Best" value={bestScore} />
	{/snippet}

	{#snippet overlay()}
		<GameOverlay
			visible={isGameWon}
			title="You Win!"
			message="おめでとう！"
			primaryAction={{ label: 'Continue', onclick: () => (gameWonContinues = true) }}
			secondaryAction={{ label: 'Restart', onclick: () => reset() }}
		/>
		<GameOverlay
			visible={isGameOver && !isGameWon}
			title="Game Over!"
			message="残念！また挑戦してね"
			primaryAction={{ label: 'Replay', onclick: () => reset() }}
		/>
	{/snippet}

	{#snippet gameBoard(cell, i)}
		{@const r = Math.floor(i / SIZE)}
		{@const c = i % SIZE}
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
