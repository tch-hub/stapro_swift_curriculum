<script lang="ts">
	import { fade } from 'svelte/transition';
	import GameContainer from './shared/GameContainer.svelte';
	import ScoreBox from './shared/ScoreBox.svelte';
	import GameTile from './shared/GameTile.svelte';
	import GameOverlay from './shared/GameOverlay.svelte';

	// Game State
	let score = $state(0);
	let bestScore = $state(0);
	let isFocused = $state(false);
	let gameContainer = $state<HTMLDivElement | null>(null);
	let isGameWon = $derived(score >= 10);

	function handleClick(index?: number) {
		if (isGameWon) return;
		score++;
		if (score > bestScore) bestScore = score;
	}

	function reset() {
		score = 0;
	}
</script>

<GameContainer
	title="Sample Game"
	subtitle="10回クリックして勝利を目指そう"
	bind:isFocused
	bind:gameContainer
	gridSize={4}
	items={Array(16)}
	onReset={() => reset()}
	onKeyDown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') handleClick();
	}}
>
	{#snippet scoreBoard()}
		<ScoreBox label="Score" value={score} />
		<ScoreBox label="Best" value={bestScore} />
	{/snippet}

	{#snippet overlay()}
		<GameOverlay
			visible={isGameWon}
			title="You Win!"
			primaryAction={{ label: 'Play Again', onclick: reset }}
		/>
	{/snippet}

	{#snippet gameBoard(_, i)}
		<GameTile onclick={() => handleClick(i)}>
			{i + 1}
		</GameTile>
	{/snippet}

	{#snippet controls()}
		<div class="flex items-center gap-1 text-xs">
			<kbd class="kbd kbd-sm">Space</kbd>
			<span>/</span>
			<kbd class="kbd kbd-sm">Enter</kbd>
			<span>to Click</span>
		</div>
	{/snippet}
</GameContainer>
