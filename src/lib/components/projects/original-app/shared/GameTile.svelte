<script lang="ts">
	import { type Snippet } from 'svelte';

	let {
		children,
		onclick,
		color = 'default',
		active = false,
		disabled = false,
		isSolved = false, // If true, apply accent color
		class: className = '', // Allow passing extra classes
		icon, // Material Symbols icon name

		// Flip functionality
		back, // Snippet for the back of the card (initial view)
		isFlipped = false,

		...rest // Allow passing arbitrary attributes like aria-label
	}: {
		children?: Snippet;
		onclick?: () => void;
		color?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
		active?: boolean; // If true, apply 'active' styling (e.g. pressed state or toggle)
		disabled?: boolean;
		isSolved?: boolean;
		class?: string;
		icon?: string;

		back?: Snippet;
		isFlipped?: boolean;

		[key: string]: any;
	} = $props();

	// Color mapping
	const colorMap = {
		default: 'bg-base-200 text-base-content hover:bg-base-300 border-base-content/10',
		primary: 'bg-primary text-primary-content hover:bg-primary/90 border-primary',
		secondary: 'bg-secondary text-secondary-content hover:bg-secondary/90 border-secondary',
		accent: 'bg-accent text-accent-content hover:bg-accent/90 border-accent',
		success: 'bg-success text-success-content hover:bg-success/90 border-success',
		warning: 'bg-warning text-warning-content hover:bg-warning/90 border-warning',
		error: 'bg-error text-error-content hover:bg-error/90 border-error'
	};

	let colorClass = $derived(
		isSolved ? colorMap['accent'] : active ? colorMap['warning'] : colorMap[color]
	);

	let baseButtonClass = $derived(
		'relative h-full w-full rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 ' +
			className
	);

	// Classes for static (non-flippable) mode
	let staticClass = $derived(
		`flex items-center justify-center border text-xl font-bold shadow-sm active:scale-95 ${colorClass}`
	);

	// Classes for flip wrapper
	let flipWrapperClass =
		'perspective-1000 outline-none focus-visible:ring-2 focus-visible:ring-primary';
</script>

<button
	class="{baseButtonClass} {back ? flipWrapperClass : staticClass}"
	{onclick}
	tabindex="-1"
	{disabled}
	{...rest}
>
	{#if back}
		<div
			class="transform-style-3d relative h-full w-full duration-500 {isFlipped
				? 'rotate-y-180'
				: ''}"
		>
			<!-- Back of card (Initial view) -->
			<!-- When not flipped (0deg), this is visible. It's the "back" of the card conceptually (e.g. the pattern), but visually the front-facing side initially. -->
			<div
				class="absolute inset-0 flex items-center justify-center rounded-md border text-xl font-bold shadow-sm backface-hidden {colorClass}"
			>
				{@render back()}
			</div>

			<!-- Front of card (Revealed view) -->
			<!-- When flipped (180deg), this becomes visible. It's the "content" of the card. -->
			<div
				class="absolute inset-0 flex rotate-y-180 transform items-center justify-center rounded-md border-2 border-primary bg-base-100 text-4xl shadow-md backface-hidden"
			>
				{@render children?.()}
			</div>
		</div>
	{:else}
		{#if icon}
			<span class="material-symbols-outlined select-none" style="font-size: inherit;">
				{icon}
			</span>
		{/if}
		{@render children?.()}
	{/if}
</button>

<style>
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
