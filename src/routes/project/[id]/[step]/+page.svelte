<script>
	import { base, resolve } from '$app/paths';
	import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
	import StepPractice from '$lib/components/StepPractice.svelte';
	import { useMarkdownRenderer } from '$lib/composables/useMarkdownRenderer.svelte.js';

	let { data } = $props();

	// マークダウンレンダリングロジックをcomposableから取得
	const markdown = useMarkdownRenderer(data.content, base);

	// ドロワーUI用の状態
	let isShowcaseDrawerOpen = $state(false);

	// メタデータから完成イメージを取得
	let showcaseImage = $derived.by(() => ({
		image: data.showcaseImage ? markdown.normalizeUrlWithBase(data.showcaseImage) : null,
		alt: data.showcaseImageAlt || '完成イメージ'
	}));

	// 表示用からは画像を削除する
	let displayPracticeBlocks = $derived(
		markdown.createDisplayPracticeBlocks(markdown.practiceBlocks)
	);
</script>

<div class="container mx-auto px-4 py-8 pb-32">
	<header class="mb-8 text-center">
		<h1 class="mb-4 text-4xl font-bold">{data.title}</h1>
		<p class="text-lg opacity-90">{data.summary}</p>
	</header>

	<section>
		<MarkdownRenderer blocks={markdown.renderedBlocks} />

		{#if markdown.hasPractice}
			{#snippet practiceContent()}
				<MarkdownRenderer blocks={displayPracticeBlocks} />
			{/snippet}

			{#snippet answerContent()}
				<MarkdownRenderer blocks={markdown.answerBlocks} />
			{/snippet}

			<StepPractice
				practiceImage={markdown.practiceImage}
				practiceImageAlt={markdown.practiceImageAlt}
				practiceImageClass={markdown.practiceImageClass}
				{practiceContent}
				answerContent={markdown.hasAnswer ? answerContent : undefined}
			/>
		{/if}
	</section>

	<!-- 完成イメージドロワー -->
	{#if showcaseImage.image}
		<aside class:open={isShowcaseDrawerOpen} class="lesson-showcase-drawer">
			<button
				class="lesson-showcase-drawer-close btn btn-circle btn-ghost btn-sm"
				onclick={() => (isShowcaseDrawerOpen = false)}
				aria-label="ドロワーを閉じる"
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
					stroke-linejoin="round"
				>
					<path d="M18 6l-12 12M6 6l12 12" />
				</svg>
			</button>
			<div class="lesson-showcase-drawer-content">
				<img src={showcaseImage.image} alt={showcaseImage.alt} class="lesson-showcase-image" />
				<p class="text-center text-sm font-medium">{showcaseImage.alt}</p>
			</div>
		</aside>

		<!-- 完成イメージを表示ボタン -->
		<button
			class="lesson-showcase-drawer-button btn btn-circle btn-primary"
			onclick={() => (isShowcaseDrawerOpen = !isShowcaseDrawerOpen)}
			aria-label="完成イメージを表示"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="3" y="3" width="18" height="18" rx="2" />
				<circle cx="8.5" cy="8.5" r="1.5" />
				<path d="m21 15-5-5L5 21" />
			</svg>
		</button>
	{/if}
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
					{#each data.allSteps as step, i (step.id)}
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
					<a href={resolve('/project/' + data.projectId)} class="btn btn-outline btn-sm"> 完了 </a>
				{/if}
			</div>
		</div>
	</div>
</div>
