<script>
	import { base } from '$app/paths';
	import TimerProject from '$lib/components/projects/TimerProject.svelte';
	import ToDoListProject from '$lib/components/projects/ToDoListProject.svelte';
	import OriginalAppProject from '$lib/components/projects/OriginalAppProject.svelte';

	export let data;

	const projectComponents = {
		timer: TimerProject,
		todolist: ToDoListProject,
		'original-app': OriginalAppProject
	};

	$: ProjectComponent = projectComponents[data.projectId];
</script>

{#if ProjectComponent}
	<svelte:component this={ProjectComponent} />
{:else}
	<div class="container mx-auto px-4 py-8">
		<h1 class="mb-4 text-3xl font-bold">プロジェクトが見つかりません</h1>
		<p>URLが正しいか確認してください。</p>
	</div>
{/if}
