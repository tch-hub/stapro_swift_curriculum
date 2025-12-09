<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { marked } from 'marked';

	export let data;

	const parserOptions = { headerIds: false };

	$: parsedTokens = data.content ? marked.lexer(data.content, parserOptions) : [];
	$: tokensWithoutTitle = (() => {
		if (!parsedTokens.length) return parsedTokens;
		const [firstToken, ...restTokens] = parsedTokens;
		if (
			firstToken.type === 'heading' &&
			firstToken.depth === 1 &&
			firstToken.text.trim() === data.title?.trim()
		) {
			return restTokens;
		}
		return parsedTokens;
	})();
	$: renderedBlocks = tokensWithoutTitle
		.filter((token) => token.type !== 'space')
		.map((token) => {
			if (token.type === 'code') {
				// title="FileName.swift" から FileName.swift を抽出
				let fileName = '';
				if (token.meta) {
					const titleMatch = token.meta.match(/title="([^"]+)"/);
					if (titleMatch) {
						fileName = titleMatch[1];
					}
				}

				return {
					type: 'code',
					code: token.text,
					language: token.lang || 'swift',
					fileName: fileName
				};
			}

			return {
				type: 'html',
				html: marked.parser([token], parserOptions)
			};
		});
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6 flex flex-wrap items-center justify-between gap-4">
		<div class="flex flex-wrap gap-3">
			{#if data.stepId === 'step1'}
				<a href="{base}/project/todolist" class="btn btn-outline btn-sm">← プロジェクト概要</a>
			{/if}
			{#if data.prevStep}
				<a href="{base}/project/todolist/{data.prevStep.id}" class="btn btn-outline btn-sm">
					← {data.prevStep.title}
				</a>
			{/if}
		</div>
		{#if data.nextStep}
			<a href="{base}/project/todolist/{data.nextStep.id}" class="btn btn-sm btn-primary">
				{data.nextStep.title} →
			</a>
		{/if}
	</div>

	<header class="mb-8 text-center">
		<h1 class="mb-4 text-4xl font-bold">{data.title}</h1>
		<p class="text-lg opacity-90">{data.summary}</p>
	</header>

	<section class="prose prose-sm max-w-none">
		{#each renderedBlocks as block, index}
			{#if block.type === 'code'}
				<div class="mb-6">
					{#key block.code}
						<CodeBlock code={block.code} language={block.language} fileName={block.fileName} />
					{/key}
				</div>
			{:else}
				<div class="mb-4">
					{@html block.html}
				</div>
			{/if}
		{/each}
	</section>

	<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
		{#if data.prevStep}
			<a href="{base}/project/todolist/{data.prevStep.id}" class="btn btn-outline btn-sm">
				← {data.prevStep.title}
			</a>
		{/if}
		{#if data.stepId === 'step1'}
			<a href="{base}/project/todolist" class="btn btn-sm btn-secondary">ステップ一覧に戻る</a>
		{/if}
		{#if data.nextStep}
			<a href="{base}/project/todolist/{data.nextStep.id}" class="btn btn-sm btn-primary">
				{data.nextStep.title} →
			</a>
		{/if}
	</div>
</div>
