<script lang="ts">
	let { label, value }: { label: string; value: string | number } = $props();
</script>

<div class="flex min-w-[70px] flex-col items-center justify-center rounded bg-base-200 p-2">
	<div class="text-[10px] tracking-widest uppercase opacity-70">{label}</div>
	<div class="text-lg font-bold">{value}</div>
</div>
