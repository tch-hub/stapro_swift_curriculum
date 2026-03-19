<script>
	import { base, resolve } from '$app/paths';
	import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
	import { useMarkdownRenderer } from '$lib/composables/useMarkdownRenderer.svelte.js';

	let { data } = $props();

	// マークダウンレンダリングロジックをcomposableから取得
	const markdown = $derived(useMarkdownRenderer(data.content, base));
</script>

<div class="container mx-auto px-4 py-8 pb-32">
	<header class="mb-8 text-center">
		<h1 class="mb-4 text-4xl font-bold">{data.title}</h1>
		<p class="text-lg opacity-90">{data.summary}</p>
	</header>

	<section>
		<MarkdownRenderer blocks={markdown.renderedBlocks} />
	</section>

	<!-- ナビゲーション -->
	<div class="fixed right-0 bottom-0 left-0 z-50 border-t border-base-300 bg-base-100/90 p-4 shadow-lg backdrop-blur">
		<div class="container mx-auto flex max-w-4xl items-center justify-between">
			<div class="w-32">
				{#if data.prevStep}
					<a
						href={resolve('/swiftui-basics/' + data.prevStep.id)}
						class="btn btn-ghost btn-sm gap-2 whitespace-nowrap"
					>
						<span class="material-symbols-outlined">chevron_left</span>
						前の項目
					</a>
				{/if}
			</div>

			<div class="hidden sm:block">
				<span class="text-sm opacity-70">
					{data.allSteps.findIndex(s => s.id === data.id) + 1} / {data.allSteps.length}
				</span>
			</div>

			<div class="flex w-32 justify-end">
				{#if data.nextStep}
					<a
						href={resolve('/swiftui-basics/' + data.nextStep.id)}
						class="btn btn-primary btn-sm gap-2 whitespace-nowrap"
					>
						次の項目
						<span class="material-symbols-outlined">chevron_right</span>
					</a>
				{:else}
					<a href={resolve('/swiftui-basics')} class="btn btn-outline btn-sm whitespace-nowrap">
						一覧に戻る
					</a>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	:global(.prose h2) {
		clear: both;
		margin-top: 3rem !important;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
		color: var(--color-primary);
	}



	/* コードブロックが画像と横並びになれるようにする */
	:global(.overflow-x-auto) {
		display: flow-root;
	}
</style>
