<script>
	import { base } from '$app/paths';
	import TimerAppCreation from '$lib/components/app-creation/TimerAppCreation.svelte';
	import ToDoListAppCreation from '$lib/components/app-creation/ToDoListAppCreation.svelte';
	import OriginalAppCreation from '$lib/components/app-creation/OriginalAppCreation.svelte';

	export let data;

	const projectComponents = {
		timer: TimerAppCreation,
		todolist: ToDoListAppCreation,
		'original-app': OriginalAppCreation
	};

	$: ProjectComponent = projectComponents[data.projectId];
</script>

<div data-base={base}>
	{#if ProjectComponent}
		<svelte:component this={ProjectComponent} />
	{:else}
		<div class="container mx-auto px-4 py-8">
			<h1 class="mb-4 text-3xl font-bold">アプリ制作が見つかりません</h1>
			<p>URLが正しいか確認してください。</p>
		</div>
	{/if}
</div>
