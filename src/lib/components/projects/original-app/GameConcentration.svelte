<script lang="ts">
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import GameContainer from './shared/GameContainer.svelte';
	import ScoreBox from './shared/ScoreBox.svelte';
	import GameOverlay from './shared/GameOverlay.svelte';
	import GameTile from './shared/GameTile.svelte';

	const SIZE = 4;
	const PAIRS_COUNT = (SIZE * SIZE) / 2;

	type Card = {
		id: number;
		value: number;
		isFlipped: boolean;
		isMatched: boolean;
	};

	let cards: Card[] = $state([]);
	let moves = $state(0);
	let bestScore = $state(0);
	let isFocused = $state(false);
	let isInitialized = $state(false);
	let isProcessing = $state(false);
	let flippedIndices: number[] = $state([]);
	let gameContainer = $state<HTMLDivElement | null>(null);

	const isGameWon = $derived(cards.length > 0 && cards.every((c) => c.isMatched));

	// Persistence
	$effect(() => {
		if (isInitialized) {
			localStorage.setItem(
				'concentration-state',
				JSON.stringify({
					cards,
					moves,
					bestScore,
					flippedIndices: [] // Don't persist temporary flipped state to avoid stuck state
				})
			);
		}
	});

	onMount(() => {
		try {
			const saved = JSON.parse(localStorage.getItem('concentration-state') || 'null');
			if (saved?.cards && saved.cards.length === SIZE * SIZE) {
				cards = saved.cards;
				moves = saved.moves;
				bestScore = saved.bestScore || 0;
				// Reset any cards that were flipped but not matched
				cards.forEach((c: Card) => {
					if (!c.isMatched) c.isFlipped = false;
				});
				flippedIndices = [];
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
		flippedIndices = [];
		isProcessing = false;

		const newCards: Card[] = [];
		for (let i = 1; i <= PAIRS_COUNT; i++) {
			// Add pairs
			newCards.push({ id: i * 2 - 1, value: i, isFlipped: false, isMatched: false });
			newCards.push({ id: i * 2, value: i, isFlipped: false, isMatched: false });
		}

		// Shuffle
		for (let i = newCards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newCards[i], newCards[j]] = [newCards[j], newCards[i]];
		}

		cards = newCards;
	}

	function handleCardClick(index: number) {
		if (isProcessing || cards[index].isFlipped || cards[index].isMatched) return;

		cards[index].isFlipped = true;
		flippedIndices = [...flippedIndices, index];

		if (flippedIndices.length === 2) {
			isProcessing = true;
			moves++;
			checkForMatch();
		}
	}

	function checkForMatch() {
		const [firstIndex, secondIndex] = flippedIndices;
		const match = cards[firstIndex].value === cards[secondIndex].value;

		if (match) {
			setTimeout(() => {
				cards[firstIndex].isMatched = true;
				cards[secondIndex].isMatched = true;
				flippedIndices = [];
				isProcessing = false;

				if (isGameWon) {
					if (bestScore === 0 || moves < bestScore) {
						bestScore = moves;
					}
				}
			}, 500);
		} else {
			setTimeout(() => {
				cards[firstIndex].isFlipped = false;
				cards[secondIndex].isFlipped = false;
				flippedIndices = [];
				isProcessing = false;
			}, 1000);
		}
	}

	function handleKey(e: KeyboardEvent) {
		// Basic keyboard navigation could be implemented here
		// For now, allow restarting
		if (e.key === 'r' || e.key === 'R') {
			reset();
		}
	}

	const getCardContent = (value: number) => {
		// Material Symbols icon names
		const icons = ['pets', 'bolt', 'star', 'favorite', 'diamond', 'rocket', 'anchor', 'key'];
		// @ts-ignore
		return icons[value - 1] || 'help';
	};
</script>

<GameContainer
	title="Concentration"
	subtitle="ペアを揃えて記憶力を試そう"
	bind:isFocused
	bind:gameContainer
	gridSize={SIZE}
	items={cards}
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
			title="Great Job!"
			message={`Moves: ${moves}`}
			primaryAction={{ label: 'Play Again', onclick: () => reset() }}
		/>
	{/snippet}

	{#snippet gameBoard(card, i)}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<GameTile
			onclick={() => handleCardClick(i)}
			disabled={isProcessing}
			isFlipped={card.isFlipped || card.isMatched}
			color="secondary"
			aria-label={card.isMatched || card.isFlipped
				? `Card ${i + 1}, matched or flipped, value ${card.value}`
				: `Card ${i + 1}, hidden`}
		>
			{#snippet back()}
				<div class="text-2xl font-bold">?</div>
			{/snippet}

			{#if card.isFlipped || card.isMatched}
				<span
					in:scale={{ duration: 200, start: 0.5 }}
					class="material-symbols-outlined text-4xl select-none"
				>
					{getCardContent(card.value)}
				</span>
			{/if}
		</GameTile>
	{/snippet}
</GameContainer>
