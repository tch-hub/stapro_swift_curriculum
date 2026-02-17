<script lang="ts">
	import { type Snippet } from 'svelte';

	let {
		children,
		onclick,
		primary = false
	}: { children: Snippet; onclick?: (e: MouseEvent) => void; primary?: boolean } = $props();
</script>

<button
	class="rounded-full px-6 py-2 font-bold shadow-sm transition hover:scale-105 active:scale-95 {primary
		? 'bg-base-100 text-base-content hover:bg-base-200'
		: 'bg-neutral text-neutral-content hover:bg-neutral/80'}"
	onclick={(e) => {
		e.stopPropagation();
		onclick?.(e);
	}}
>
	{@render children()}
</button>
