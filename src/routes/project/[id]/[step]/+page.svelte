<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { marked } from 'marked';
	import Step1 from '$lib/components/projects/original-app/steps/Step1.svelte';
	import Step2 from '$lib/components/projects/original-app/steps/Step2.svelte';
	import Step3 from '$lib/components/projects/original-app/steps/Step3.svelte';
	import Step4 from '$lib/components/projects/original-app/steps/Step4.svelte';
	import Step5 from '$lib/components/projects/original-app/steps/Step5.svelte';

	export let data;

	const parserOptions = { headerIds: false };

	const originalAppStepComponents = {
		step1: Step1,
		step2: Step2,
		step3: Step3,
		step4: Step4,
		step5: Step5
	};

	$: projectPath = `${base}/project/${data.projectId}`;
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
					fileName
				};
			}

			let html = marked.parser([token], parserOptions);

			if (base) {
				const normalizedBase = (base || '').replace(/\/$/, '');
				html = html.replace(/(src|href)=(['"])\/(?!\/)([^'\"]*)/g, (m, attr, q, rest) => {
					return `${attr}=${q}${normalizedBase}/${rest}`;
				});
				html = html.replace(/url\((['"]?)\/(?!\/)([^)'\"]*)\)/g, (m, q, rest) => {
					return `url(${q}${normalizedBase}/${rest})`;
				});
			}

			return {
				type: 'html',
				html
			};
		});
</script>

{#if data.projectId === 'original-app'}
	<svelte:component this={originalAppStepComponents[data.stepId]} />
{:else}
	<div class="container mx-auto px-4 py-8">
		<div class="mb-6 flex flex-wrap items-center justify-between gap-4">
			<div class="flex flex-wrap gap-3">
				{#if data.stepId === 'step1'}
					<a href={projectPath} class="btn btn-outline btn-sm">← プロジェクト概要</a>
				{/if}
				{#if data.prevStep}
					<a href="{projectPath}/{data.prevStep.id}" class="btn btn-outline btn-sm">
						← {data.prevStep.title}
					</a>
				{/if}
			</div>
			{#if data.nextStep}
				<a href="{projectPath}/{data.nextStep.id}" class="btn btn-sm btn-primary">
					{data.nextStep.title} →
				</a>
			{/if}
		</div>

		<header class="mb-8 text-center">
			<h1 class="mb-4 text-4xl font-bold">{data.title}</h1>
			<p class="text-lg opacity-90">{data.summary}</p>
		</header>

		<section class="prose prose-sm max-w-none">
			{#each renderedBlocks as block}
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
				<a href="{projectPath}/{data.prevStep.id}" class="btn btn-outline btn-sm">
					← {data.prevStep.title}
				</a>
			{/if}
			{#if data.stepId === 'step1'}
				<a href={projectPath} class="btn btn-sm btn-secondary">ステップ一覧に戻る</a>
			{/if}
			{#if data.nextStep}
				<a href="{projectPath}/{data.nextStep.id}" class="btn btn-sm btn-primary">
					{data.nextStep.title} →
				</a>
			{/if}
		</div>
	</div>
{/if}
