<script lang="ts">
	import { type Snippet } from 'svelte';

	let {
		title,
		subtitle,
		isFocused = $bindable(false),
		gameContainer = $bindable(),
		gridSize, // Optional: if provided, wraps gameBoard in a grid
		onReset,
		onKeyDown,
		ontouchstart,
		ontouchend,

		// Snippets
		scoreBoard,
		gameBoard,
		overlay,
		controls,
		items
	}: {
		title: string;
		subtitle: string;
		isFocused?: boolean;
		gameContainer?: HTMLDivElement;
		gridSize?: number;
		onReset?: () => void;
		onKeyDown?: (e: KeyboardEvent) => void;
		ontouchstart?: (e: TouchEvent) => void;
		ontouchend?: (e: TouchEvent) => void;

		scoreBoard?: Snippet;
		gameBoard?: Snippet<[any, number]>;
		overlay?: Snippet;
		controls?: Snippet;

		items?: any[];
	} = $props();
</script>

<div
	class="color-base-100 mockup-window w-full border border-base-300 p-4"
	onmousedown={(e) => {
		if (gameContainer && !gameContainer.contains(e.target as Node)) {
			e.preventDefault();
			gameContainer.focus();
		}
	}}
	role="presentation"
>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="mx-auto flex w-full max-w-md flex-col items-center ring-offset-2 outline-none"
		tabindex="0"
		role="application"
		aria-label="{title} Game Board"
		bind:this={gameContainer}
		onkeydown={(e) => {
			if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(e.key)) {
				e.preventDefault();
			}
			onKeyDown?.(e);
		}}
		onfocus={() => (isFocused = true)}
		onblur={(e) => {
			// コンテナ内の要素にフォーカスが移動した場合はフォーカスが外れたとみなさない
			if (gameContainer?.contains(e.relatedTarget as Node)) return;
			isFocused = false;
		}}
	>
		<div class="w-full text-center">
			<h2 class="text-3xl font-bold text-base-content" {title}>{title}</h2>
			<p class="text-xs text-base-content/60" title={subtitle}>{subtitle}</p>
		</div>

		<div
			class="relative mt-4 w-80 rounded-lg border border-base-content/10 bg-base-300/50 p-2 select-none"
			{ontouchstart}
			{ontouchend}
		>
			{@render overlay?.()}

			<div class="mb-2 flex justify-center gap-2">
				{@render scoreBoard?.()}
			</div>

			<div class="relative aspect-square touch-none">
				{#if gridSize}
					<div
						class="grid h-full gap-2"
						style="grid-template-columns: repeat({gridSize}, minmax(0, 1fr)); grid-template-rows: repeat({gridSize}, minmax(0, 1fr));"
					>
						{#if items}
							{#each items as item, i}
								{@render gameBoard?.(item, i)}
							{/each}
						{:else}
							{@render gameBoard?.(undefined, -1)}
						{/if}
					</div>
				{:else}
					{@render gameBoard?.(undefined, -1)}
				{/if}
			</div>
		</div>

		<div class="mt-4 flex w-full items-center justify-between text-sm text-base-content/60">
			<div class="flex h-6 items-center">
				{#if !isFocused}
					<span class="animate-pulse font-bold text-primary">クリックして開始</span>
				{:else if controls}
					{@render controls()}
				{/if}
			</div>
			<button class="transition-colors hover:text-primary hover:underline" onclick={onReset}>
				リセット
			</button>
		</div>
	</div>
</div>
