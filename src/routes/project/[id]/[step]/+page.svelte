<script>
	import { base, resolve } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { marked } from 'marked';
	import Step1 from '$lib/components/projects/original-app/steps/Step1.svelte';
	import Step2 from '$lib/components/projects/original-app/steps/Step2.svelte';
	import Step3 from '$lib/components/projects/original-app/steps/Step3.svelte';
	import Step4 from '$lib/components/projects/original-app/steps/Step4.svelte';
	import Step5 from '$lib/components/projects/original-app/steps/Step5.svelte';

	let { data } = $props();

	const parserOptions = { headerIds: false };

	const originalAppStepComponents = {
		step1: Step1,
		step2: Step2,
		step3: Step3,
		step4: Step4,
		step5: Step5
	};

	let parsedTokens = $derived(data.content ? marked.lexer(data.content, parserOptions) : []);
	let tokensWithoutTitle = $derived.by(() => {
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
	});
	let renderedBlocks = $derived.by(() =>
		tokensWithoutTitle
			.filter((token) => token.type !== 'space')
			.map((token) => {
				if (token.type === 'code') {
					let fileName = '';
					let lang = token.lang || 'swift';
					let meta = token.meta || '';

					// langに空白が含まれている場合、メタデータとして扱う
					const spaceIndex = lang.indexOf(' ');
					if (spaceIndex !== -1) {
						meta = lang.slice(spaceIndex + 1) + (meta ? ' ' + meta : '');
						lang = lang.slice(0, spaceIndex);
					}

					if (meta) {
						const titleMatch = meta.match(/title="([^"]+)"/);
						if (titleMatch) {
							fileName = titleMatch[1];
						}
					}

					return {
						type: 'code',
						code: token.text,
						language: lang,
						fileName
					};
				}

				let html = marked.parser([token], parserOptions);

				if (base) {
					const normalizedBase = (base || '').replace(/\/$/, '');
					html = html.replace(/(src|href)=(['"])\/(?!\/)([^'"]*)/g, (m, attr, q, rest) => {
						return `${attr}=${q}${normalizedBase}/${rest}`;
					});
					html = html.replace(/url\((['"]?)\/(?!\/)([^)'"]*)\)/g, (m, q, rest) => {
						return `url(${q}${normalizedBase}/${rest})`;
					});
				}

				return {
					type: 'html',
					html
				};
			})
	);
</script>

{#if data.projectId === 'original-app'}
	{@const StepComponent = originalAppStepComponents[data.stepId]}
	<StepComponent />
{:else}
	<div class="container mx-auto px-4 py-8 pb-32">
		<!-- パンくずリスト（簡易版） -->
		<div class="breadcrumbs mb-6 text-sm">
			<ul>
				<li><a href={resolve('/project/' + data.projectId)}>プロジェクト概要</a></li>
				<li>{data.title}</li>
			</ul>
		</div>

		<header class="mb-8 text-center">
			<h1 class="mb-4 text-4xl font-bold">{data.title}</h1>
			<p class="text-lg opacity-90">{data.summary}</p>
		</header>

		<section class="prose prose-sm max-w-none">
			{#each renderedBlocks as block, index (block.type + '-' + index)}
				{#if block.type === 'code'}
					<div class="mb-6">
						{#key block.code}
							<CodeBlock code={block.code} language={block.language} fileName={block.fileName} />
						{/key}
					</div>
				{:else}
					<div class="mb-4">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -- マークダウンを表示するため -->
						{@html block.html}
					</div>
				{/if}
			{/each}
		</section>

		<!-- 固定ナビゲーションフッター -->
		<div
			class="fixed right-0 bottom-0 left-0 z-50 border-t border-base-300 bg-base-100/90 p-4 backdrop-blur"
		>
			<div class="container mx-auto flex max-w-4xl items-center justify-between">
				<!-- 前へボタン -->
				<div class="w-24">
					{#if data.prevStep}
						<a
							href={resolve('/project/' + data.projectId + '/' + data.prevStep.id)}
							class="btn gap-2 btn-ghost btn-sm"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg
							>
							<span class="hidden sm:inline">前へ</span>
						</a>
					{/if}
				</div>

				<!-- ステップ切り替えメニュー -->
				<div class="dropdown dropdown-center dropdown-top">
					<div tabindex="0" role="button" class="btn font-normal normal-case btn-ghost btn-sm">
						<span class="text-xs opacity-70"
							>Step {data.allSteps.findIndex((s) => s.id === data.stepId) + 1} / {data.allSteps
								.length}</span
						>
						<span class="ml-1 max-w-[150px] truncate font-bold sm:max-w-xs">{data.title}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"><path d="m18 15-6-6-6 6" /></svg
						>
					</div>
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<ul
						tabindex="0"
						class="dropdown-content menu z-[1] mb-2 max-h-[60vh] w-72 flex-nowrap overflow-y-auto rounded-box border border-base-200 bg-base-100 p-2 shadow"
					>
						{#each data.allSteps as step, i}
							<li>
								<a
									href={resolve('/project/' + data.projectId + '/' + step.id)}
									class:active={step.id === data.stepId}
									class="flex flex-col items-start gap-1 py-3"
								>
									<span class="text-xs opacity-70">Step {i + 1}</span>
									<span class="leading-tight font-bold">{step.title}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- 次へボタン -->
				<div class="flex w-24 justify-end">
					{#if data.nextStep}
						<a
							href={resolve('/project/' + data.projectId + '/' + data.nextStep.id)}
							class="btn gap-2 btn-sm btn-primary"
						>
							<span class="hidden sm:inline">次へ</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
							>
						</a>
					{:else}
						<a href={resolve('/project/' + data.projectId)} class="btn btn-outline btn-sm">
							完了
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
