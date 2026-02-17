<script lang="ts">
	import { type Snippet } from 'svelte';

	let {
		children,
		onclick,
		color = 'default',
		active = false,
		disabled = false,
		isSolved = false, // If true, apply accent color
		class: className = '' // Allow passing extra classes
	}: {
		children?: Snippet;
		onclick?: () => void;
		color?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
		active?: boolean; // If true, apply 'active' styling (e.g. pressed state or toggle)
		disabled?: boolean;
		isSolved?: boolean;
		class?: string;
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
</script>

<button
	class="flex h-full w-full items-center justify-center rounded-md border text-xl font-bold shadow-sm transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 {colorClass} {className}"
	{onclick}
	tabindex="-1"
	{disabled}
>
	{@render children?.()}
</button>
