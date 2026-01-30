<script>
	import { base, resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import tutorialData from '$lib/data/tutorial.json';

	let loading = false;

	onMount(() => {
		const next = $page.url.searchParams.get('next');
		const prev = $page.url.searchParams.get('prev');
		if (next || prev) {
			loading = true;
			setTimeout(() => {
				goto(resolve('/tutorial/' + (next || prev)));
			}, 500);
		}
	});
</script>

{#if loading}
	<div class="flex h-screen items-center justify-center">
		<span class="loading loading-lg loading-spinner"></span>
		<p class="ml-4">ページ移動中...</p>
	</div>
{:else}
	<div class="container mx-auto px-4 py-8" data-base={base}>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each tutorialData.sections as section, index (section.id)}
				<div
					class="card border border-base-300 bg-base-100 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
				>
					<div class="card-body">
						<div class="mb-4 flex items-center">
							<div
								class="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-content"
							>
								{index + 1}
							</div>
							<h2 class="card-title text-lg">
								<a href={resolve('/tutorial/' + section.id)} class="hover:link-accent">
									{section.title}
								</a>
							</h2>
						</div>
						<p class="mb-4 text-sm text-base-content opacity-80">{section.description}</p>
						<div class="flex items-center justify-between">
							<span class="badge badge-outline badge-primary"
								>コード例: {section.codeBlocks.length}個</span
							>
							<a href={resolve('/tutorial/' + section.id)} class="btn btn-sm btn-primary"
								>学習する</a
							>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
