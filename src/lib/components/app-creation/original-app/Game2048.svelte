<script lang="ts">
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import GameContainer from './shared/GameContainer.svelte';
	import ScoreBox from './shared/ScoreBox.svelte';
	import GameOverlay from './shared/GameOverlay.svelte';
	import GameTile from './shared/GameTile.svelte';

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

	// タイルの色を決定するマップ (GameTile.svelteの色名を参照)
	const colorMap: Record<
		number,
		| 'default'
		| 'gradient1'
		| 'gradient2'
		| 'gradient3'
		| 'gradient4'
		| 'gradient5'
		| 'gradient6'
		| 'gradient7'
		| 'gradient8'
		| 'gradient9'
		| 'primary'
	> = {
		2: 'default',
		4: 'gradient1',
		8: 'gradient2',
		16: 'gradient3',
		32: 'gradient4',
		64: 'gradient5',
		128: 'gradient6',
		256: 'gradient7',
		512: 'gradient8',
		1024: 'gradient9',
		2048: 'primary'
	};

	// ヘルパー関数: 値に対応する色を返す
	const getTileColor = (
		v: number
	):
		| 'default'
		| 'gradient1'
		| 'gradient2'
		| 'gradient3'
		| 'gradient4'
		| 'gradient5'
		| 'gradient6'
		| 'gradient7'
		| 'gradient8'
		| 'gradient9'
		| 'primary' => {
		return colorMap[v] || 'default';
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
		<GameTile
			color={cell > 0 ? getTileColor(cell) : 'default'}
			disabled={cell === 0}
			aria-label={`2048 tile at row ${r}, column ${c}, value ${cell || 'empty'}`}
		>
			{#if cell > 0}
				{#key `${r}-${c}-${cell}`}
					<div in:scale={{ duration: 200, start: 0.5 }} style="display: contents;">
						{cell}
					</div>
				{/key}
			{/if}
		</GameTile>
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
