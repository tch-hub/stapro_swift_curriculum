<script lang="ts">
	// loading=true のときに小さなスピナーを表示する
	let {
		label,
		value,
		loading = false
	}: { label: string; value: string | number; loading?: boolean } = $props();
</script>

<div class="flex h-[70px] w-[70px] flex-col items-center justify-center rounded bg-base-200 p-2">
	<div class="text-[10px] tracking-widest uppercase opacity-70">{label}</div>
	<div class="text-lg font-bold">
		<span>{value}</span>
		{#if loading}
			<!-- 小さなアクセシブルスピナー -->
			<svg class="ml-2 inline-block h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
					fill="none"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
				></path>
			</svg>
		{/if}
	</div>
</div>
