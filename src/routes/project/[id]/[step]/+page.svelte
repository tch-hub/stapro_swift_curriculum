<script>
	import { base, resolve } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import StepPractice from '$lib/components/StepPractice.svelte';
	import { marked } from 'marked';

	let { data } = $props();

	const parserOptions = { headerIds: false };
	const showcaseKeyword = '完成イメージ';
	const showcaseClassName = 'lesson-showcase-image';

	function normalizeUrlWithBase(url) {
		if (!url) return url;
		if (base && url.startsWith('/')) {
			const normalizedBase = (base || '').replace(/\/$/, '');
			return `${normalizedBase}${url}`;
		}
		return url;
	}

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

	// 「## 練習問題」でトークンをメインコンテンツと練習問題コンテンツに分割する
	let mainTokens = $derived.by(() => {
		const practiceIndex = tokensWithoutTitle.findIndex(
			(t) => t.type === 'heading' && t.depth === 2 && t.text.trim() === '練習問題'
		);
		return practiceIndex !== -1 ? tokensWithoutTitle.slice(0, practiceIndex) : tokensWithoutTitle;
	});

	let practiceTokens = $derived.by(() => {
		const practiceIndex = tokensWithoutTitle.findIndex(
			(t) => t.type === 'heading' && t.depth === 2 && t.text.trim() === '練習問題'
		);
		if (practiceIndex === -1) return [];

		const restTokens = tokensWithoutTitle.slice(practiceIndex + 1);
		const answerIndex = restTokens.findIndex(
			(t) => t.type === 'heading' && t.depth === 3 && t.text.trim() === '解答例'
		);

		return answerIndex !== -1 ? restTokens.slice(0, answerIndex) : restTokens;
	});

	let answerTokens = $derived.by(() => {
		const practiceIndex = tokensWithoutTitle.findIndex(
			(t) => t.type === 'heading' && t.depth === 2 && t.text.trim() === '練習問題'
		);
		if (practiceIndex === -1) return [];

		const restTokens = tokensWithoutTitle.slice(practiceIndex + 1);
		const answerIndex = restTokens.findIndex(
			(t) => t.type === 'heading' && t.depth === 3 && t.text.trim() === '解答例'
		);

		return answerIndex !== -1 ? restTokens.slice(answerIndex + 1) : [];
	});

	function processTokens(tokens) {
		return tokens
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

				// GitHubスタイルアラート (Callouts) の処理
				if (token.type === 'blockquote') {
					// 引用符(>)を取り除いた中身のテキストを取得
					const rawText = token.raw.replace(/^>\s?/gm, '').trim();
					// [!NOTE] などのパターンをチェック
					const alertMatch = rawText.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);

					if (alertMatch) {
						const type = alertMatch[1].toUpperCase();
						// アラートの見出し部分を取り除いたコンテンツを取得
						const alertContentRaw = rawText.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/i, '');
						// コンテンツをMarkdownとしてパース
						const alertHtml = marked.parse(alertContentRaw, parserOptions);

						// タイプに応じたアイコンとクラスの設定
						const config = {
							NOTE: { icon: 'info', class: 'note' },
							TIP: { icon: 'lightbulb', class: 'tip' },
							IMPORTANT: { icon: 'priority_high', class: 'important' },
							WARNING: { icon: 'warning', class: 'warning' },
							CAUTION: { icon: 'report', class: 'caution' }
						};
						const { icon, class: typeClass } = config[type] || config.NOTE;

						const html = `
<div class="alert-callout alert-callout-${typeClass}">
	<div class="alert-callout-header">
		<span class="material-symbols-outlined">${icon}</span>
		<span>${type}</span>
	</div>
	<div class="prose prose-sm max-w-none">
		${alertHtml}
	</div>
</div>`;
						return { type: 'html', html };
					}
				}

				let html = marked.parse(token.raw, parserOptions);

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
			});
	}

	let renderedBlocks = $derived(processTokens(mainTokens));
	let practiceBlocks = $derived(processTokens(practiceTokens));
	let answerBlocks = $derived(processTokens(answerTokens));

	// 練習問題ブロックの中から最初の画像URLとaltを抽出する
	let practiceImageInfo = $derived.by(() => {
		// tokenから直接探す
		for (const token of practiceTokens) {
			if (token.type === 'image') {
				return {
					url: normalizeUrlWithBase(token.href),
					alt: token.text || ''
				};
			}
			// 段落内などのインライン画像
			if (token.tokens) {
				const imgToken = token.tokens.find((t) => t.type === 'image');
				if (imgToken) {
					return {
						url: normalizeUrlWithBase(imgToken.href),
						alt: imgToken.text || ''
					};
				}
			}
		}

		// HTMLパース後のブロックから探す (imgタグが含まれている場合)
		for (const block of practiceBlocks) {
			if (block.type === 'html' && block.html.includes('<img')) {
				const srcMatch = block.html.match(/src=['"]([^'"]+)['"]/i);
				if (srcMatch) {
					const altMatch = block.html.match(/alt=['"]([^'"]*)['"]/i);
					return {
						url: srcMatch[1],
						alt: altMatch ? altMatch[1] : ''
					};
				}
			}
		}

		return null;
	});

	let practiceImage = $derived(practiceImageInfo?.url ?? null);
	let practiceImageAlt = $derived(practiceImageInfo?.alt || '練習問題の完成イメージ');
	let practiceImageClass = $derived(
		practiceImageAlt.includes(showcaseKeyword) ? showcaseClassName : ''
	);

	// ドロワーUI用の状態
	let isShowcaseDrawerOpen = $state(false);

	// メタデータから完成イメージを取得（altは自動生成）
	let showcaseImage = $derived.by(() => ({
		image: data.showcaseImage ? normalizeUrlWithBase(data.showcaseImage) : null,
		alt: data.showcaseImageAlt || '完成イメージ'
	}));

	// 表示用からは画像を削除する（StepPracticeの左側で表示するため）
	let displayPracticeBlocks = $derived.by(() => {
		return practiceBlocks
			.filter((block) => {
				if (block.type === 'html') {
					// 単独の段落にある画像のみのHTMLの場合は除外
					const textOnly = block.html
						.replace(/<img[^>]*>/gi, '') // imgタグを削除
						.replace(/<[^>]*>/g, '') // 他のすべてのHTMLタグを削除
						.trim();

					// imgタグが存在し、プレーンテキストが空・または改行文字等の場合は除外
					if (block.html.toLowerCase().includes('<img') && textOnly === '') {
						return false;
					}
				}
				return true;
			})
			.map((block) => {
				// imgタグが存在するが、他にテキストもある場合は、imgタグだけを削除したhtmlを返す
				if (block.type === 'html' && block.html.toLowerCase().includes('<img')) {
					return {
						...block,
						html: block.html.replace(/<img[^>]*>/gi, '')
					};
				}
				return block;
			});
	});
</script>

<div class="container mx-auto px-4 py-8 pb-32">
	<header class="mb-8 text-center">
		<h1 class="mb-4 text-4xl font-bold">{data.title}</h1>
		<p class="text-lg opacity-90">{data.summary}</p>
	</header>

	<section>
		{#each renderedBlocks as block, index (block.type + '-' + index)}
			{#if block.type === 'code'}
				<div class="mb-6 overflow-x-auto">
					{#key block.code}
						<CodeBlock code={block.code} language={block.language} fileName={block.fileName} />
					{/key}
				</div>
			{:else}
				<div class="prose prose-base mb-4 max-w-none">
					{@html block.html}
				</div>
			{/if}
		{/each}

		{#if practiceBlocks.length > 0}
			{#snippet practiceContent()}
				{#each displayPracticeBlocks as block, index (block.type + '-' + index)}
					{#if block.type === 'code'}
						<div class="mb-6 overflow-x-auto">
							{#key block.code}
								<CodeBlock code={block.code} language={block.language} fileName={block.fileName} />
							{/key}
						</div>
					{:else}
						<div class="prose prose-base mb-4 max-w-none">
							{@html block.html}
						</div>
					{/if}
				{/each}
			{/snippet}

			{#snippet answerContent()}
				{#each answerBlocks as block, index (block.type + '-' + index)}
					{#if block.type === 'code'}
						<div class="mb-6 overflow-x-auto">
							{#key block.code}
								<CodeBlock code={block.code} language={block.language} fileName={block.fileName} />
							{/key}
						</div>
					{:else}
						<div class="prose prose-base mb-4 max-w-none">
							{@html block.html}
						</div>
					{/if}
				{/each}
			{/snippet}

			<StepPractice
				{practiceImage}
				{practiceImageAlt}
				{practiceImageClass}
				{practiceContent}
				answerContent={answerBlocks.length > 0 ? answerContent : undefined}
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
