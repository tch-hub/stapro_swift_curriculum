<script lang="ts">
	import { fade } from 'svelte/transition';
	import { type Snippet } from 'svelte';
	import GameButton from './GameButton.svelte';

	let {
		visible = false,
		title = 'You Win!',
		message,
		primaryAction, // e.g. "Play Again"
		secondaryAction, // e.g. "Back to Menu"
		children
	}: {
		visible: boolean;
		title?: string;
		message?: string;
		primaryAction?: { label: string; onclick: () => void };
		secondaryAction?: { label: string; onclick: () => void };
		children?: Snippet;
	} = $props();
</script>

{#if visible}
	<div
		transition:fade={{ duration: 200 }}
		class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-accent/90 p-4 text-center text-accent-content backdrop-blur-sm"
	>
		<div class="mb-4 text-4xl font-bold drop-shadow-md">{title}</div>
		{#if message}
			<div class="mb-4 text-lg">{message}</div>
		{/if}

		{@render children?.()}

		<div class="flex gap-3">
			{#if primaryAction}
				<GameButton onclick={primaryAction.onclick} primary={true}>
					{primaryAction.label}
				</GameButton>
			{/if}
			{#if secondaryAction}
				<GameButton onclick={secondaryAction.onclick} primary={false}>
					{secondaryAction.label}
				</GameButton>
			{/if}
		</div>
	</div>
{/if}
