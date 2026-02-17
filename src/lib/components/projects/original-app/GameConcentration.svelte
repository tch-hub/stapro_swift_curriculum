<script lang="ts">
	import { onMount } from 'svelte';
	import { scale, fade } from 'svelte/transition';

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
	let gameContainer: HTMLDivElement;

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
				cards.forEach((c) => {
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
		// Simple emoji or number mapping for cards
		const icons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
		return icons[value - 1] || value;
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
		aria-label="Concentration Game Board"
		bind:this={gameContainer}
		onkeydown={handleKey}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
	>
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h2 class="text-3xl font-bold text-base-content">Concentration</h2>
				<p class="text-xs text-base-content/60">ペアを揃えて記憶力を試そう</p>
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
					<div class="mb-4 text-4xl font-bold drop-shadow-md">Great Job!</div>
					<div class="mb-2 text-lg">Moves: {moves}</div>
					<div class="flex gap-3">
						{@render btn('Play Again', () => reset(), true)}
					</div>
				</div>
			{/if}

			<div class="grid h-full grid-cols-4 gap-2">
				{#each cards as card, i (card.id)}
					<button
						class="perspective-1000 relative h-full w-full transform rounded-md transition-all duration-300"
						onclick={() => handleCardClick(i)}
						disabled={isProcessing}
						tabindex="-1"
					>
						<div
							class="transform-style-3d relative h-full w-full duration-500 {card.isFlipped ||
							card.isMatched
								? 'rotate-y-180'
								: ''}"
						>
							<!-- Back of card (Hidden state) -->
							<div
								class="absolute inset-0 flex items-center justify-center rounded-md bg-secondary text-2xl font-bold text-secondary-content shadow-sm backface-hidden hover:brightness-110"
							>
								?
							</div>

							<!-- Front of card (Revealed state) -->
							<div
								class="absolute inset-0 flex rotate-y-180 transform items-center justify-center rounded-md border-2 border-primary bg-base-100 text-4xl shadow-md backface-hidden"
							>
								{#if card.isFlipped || card.isMatched}
									<span in:scale={{ duration: 200, start: 0.5 }}>
										{getCardContent(card.value)}
									</span>
								{/if}
							</div>
						</div>
					</button>
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

<style>
	/* Utility for 3D card flip */
	.perspective-1000 {
		perspective: 1000px;
	}
	.transform-style-3d {
		transform-style: preserve-3d;
	}
	.backface-hidden {
		backface-visibility: hidden;
	}
	.rotate-y-180 {
		transform: rotateY(180deg);
	}
</style>
