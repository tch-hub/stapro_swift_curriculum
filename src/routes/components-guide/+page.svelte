<script>
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import componentData from '$lib/data/components-guide.json';

	// ローディング状態の管理
	let isLoading = $state(true);

	// 検索クエリ
	let searchQuery = $state('');

	// デバウンス用のクエリ（実際の検索に使用）
	let debouncedQuery = $state('');
	let debounceTimer = null;

	// JSONからセクションを取得
	const sections = componentData.sections;

	// 検索用インデックスを事前に作成（小文字化済み）
	const searchIndex = sections.map((section) => ({
		id: section.id,
		titleLower: section.title.toLowerCase(),
		descriptionLower: section.description.toLowerCase(),
		codeBlocks: section.codeBlocks.map((block) => ({
			titleLower: block.title.toLowerCase(),
			codeLower: block.code.toLowerCase()
		}))
	}));

	// 検索結果（非同期で更新）
	let filteredSections = $state(sections);
	let resultCount = $state(sections.reduce((acc, section) => acc + section.codeBlocks.length, 0));
	let isSearching = $state(false);

	// レンダリングキューとタスクID
	let renderQueue = $state([]);
	let renderTask = null;

	// 検索処理を実行する関数
	function performSearch(query) {
		// 進行中のレンダリングがあればキャンセル
		if (renderTask) {
			cancelAnimationFrame(renderTask);
			renderTask = null;
		}

		if (!query.trim()) {
			// クエリが空の場合も段階的に全表示（初期表示と同じ負荷分散）
			const allSections = sections;
			resultCount = allSections.reduce((acc, section) => acc + section.codeBlocks.length, 0);

			// 最初のチャンクを表示
			const INITIAL_CHUNK = 20;
			filteredSections = allSections.slice(0, INITIAL_CHUNK);

			// 残りをキューに入れる
			renderQueue = allSections.slice(INITIAL_CHUNK);
			processRenderQueue();
			return;
		}

		const lowerQuery = query.toLowerCase();

		const results = sections
			.map((section, sectionIndex) => {
				const index = searchIndex[sectionIndex];

				const sectionMatches =
					index.titleLower.includes(lowerQuery) || index.descriptionLower.includes(lowerQuery);

				const matchingCodeBlocks = section.codeBlocks.filter((_, blockIndex) => {
					const blockIdx = index.codeBlocks[blockIndex];
					return (
						blockIdx.titleLower.includes(lowerQuery) || blockIdx.codeLower.includes(lowerQuery)
					);
				});

				if (sectionMatches) {
					return section;
				} else if (matchingCodeBlocks.length > 0) {
					return { ...section, codeBlocks: matchingCodeBlocks };
				}
				return null;
			})
			.filter(Boolean);

		// 結果カウントを更新
		resultCount = results.reduce((acc, section) => acc + section.codeBlocks.length, 0);

		// 最初のチャンクを表示して即座にレスポンスを返す
		const INITIAL_CHUNK = 10;
		filteredSections = results.slice(0, INITIAL_CHUNK);

		// 残りのアイテムをキューに入れる
		renderQueue = results.slice(INITIAL_CHUNK);

		// 少しずつ残りを表示
		processRenderQueue();
	}

	// キューにあるセクションを少しずつ表示する関数
	function processRenderQueue() {
		if (renderQueue.length === 0) return;

		renderTask = requestAnimationFrame(() => {
			const CHUNK_SIZE = 5; // 1フレームに追加するセクション数
			const nextChunk = renderQueue.slice(0, CHUNK_SIZE);
			renderQueue = renderQueue.slice(CHUNK_SIZE);

			// 配列に追加
			filteredSections = [...filteredSections, ...nextChunk];

			processRenderQueue();
		});
	}

	// 検索クエリの変更を監視（デバウンス + 非同期処理）
	$effect(() => {
		const query = searchQuery;

		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		// 入力中は検索中表示
		if (query !== debouncedQuery) {
			isSearching = true;
		}

		debounceTimer = setTimeout(() => {
			debouncedQuery = query;
			// 処理を次のマクロタスクに逃がす
			setTimeout(() => {
				performSearch(query);
				isSearching = false;
			}, 0);
		}, 150);

		return () => {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
			if (renderTask) {
				cancelAnimationFrame(renderTask);
			}
		};
	});

	// 検索をクリア
	function clearSearch() {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		if (renderTask) {
			cancelAnimationFrame(renderTask);
			renderTask = null;
		}

		searchQuery = '';
		debouncedQuery = '';
		isSearching = false;

		// リセット時も段階表示
		performSearch('');
	}

	// ページマウント時にローディングを開始
	onMount(() => {
		setTimeout(() => {
			isLoading = false;
			// ローディング完了後にURLのハッシュに基づいてスクロール
			const hash = window.location.hash.substring(1);
			if (hash) {
				setTimeout(() => {
					scrollToSection(hash);
				}, 100);
			}
		}, 800);
	});

	// サイドバーのリンククリック時のスクロール関数
	function scrollToSection(id) {
		const element = document.getElementById(id);
		if (element) {
			const header = document.querySelector('header');
			const headerHeight = header ? header.offsetHeight : 64;
			const elementTop = element.getBoundingClientRect().top + window.scrollY;
			const offsetTop = elementTop - headerHeight - 0;
			window.scrollTo({ top: offsetTop, behavior: 'smooth' });
		}
	}

	// リンククリックハンドラー
	function handleClick(event, id) {
		event.preventDefault();
		scrollToSection(id);
	}

	// キーボードハンドラー
	function handleKeydown(event, id) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			scrollToSection(id);
		}
	}
</script>

<div class="flex" data-base={base}>
	<!-- サイドバー（デスクトップのみ固定表示） -->
	<aside
		class="fixed top-0 left-0 hidden h-[calc(100vh)] w-80 overflow-y-auto bg-base-200 p-4 pt-30 shadow-lg lg:block"
	>
		<!-- 検索バー -->
		<div class="mb-4">
			<label class="input w-full">
				<svg class="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<g
						stroke-linejoin="round"
						stroke-linecap="round"
						stroke-width="2.5"
						fill="none"
						stroke="currentColor"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<path d="m21 21-4.3-4.3"></path>
					</g>
				</svg>
				<input
					type="text"
					class="grow"
					placeholder="コンポーネントを検索..."
					bind:value={searchQuery}
				/>
				{#if searchQuery}
					<button class="btn btn-circle btn-ghost btn-xs" onclick={clearSearch}>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				{/if}
			</label>
			{#if searchQuery}
				<p class="mt-2 text-sm text-base-content/70">
					{#if isSearching}
						<span class="loading loading-xs loading-spinner"></span>
						検索中...
					{:else}
						{resultCount}件の結果
					{/if}
				</p>
			{/if}
		</div>

		<ul class="menu">
			<li class="menu-title">UIコンポーネント</li>
			{#each filteredSections as section}
				<li>
					<a
						href="#{section.id}"
						onclick={(e) => handleClick(e, section.id)}
						onkeydown={(e) => handleKeydown(e, section.id)}
						role="button"
						tabindex="0"
					>
						{section.title}
						{#if searchQuery}
							<span class="badge badge-sm">{section.codeBlocks.length}</span>
						{/if}
					</a>
				</li>
			{/each}
			{#if searchQuery && filteredSections.length === 0}
				<li class="px-4 py-2 text-sm text-base-content/50">該当する項目がありません</li>
			{/if}
		</ul>
	</aside>

	<!-- メインコンテンツ -->
	<main class="flex-1 p-4 lg:ml-80">
		{#if isLoading}
			<!-- ローディングアニメーション -->
			<div class="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
				<div class="loading loading-lg loading-spinner text-secondary"></div>
				<p class="text-lg text-base-content/70">コンポーネントガイドを読み込み中...</p>
				<div class="flex space-x-1">
					<div class="h-2 w-2 animate-bounce rounded-full bg-secondary"></div>
					<div
						class="h-2 w-2 animate-bounce rounded-full bg-secondary"
						style="animation-delay: 0.1s"
					></div>
					<div
						class="h-2 w-2 animate-bounce rounded-full bg-secondary"
						style="animation-delay: 0.2s"
					></div>
				</div>
			</div>
		{:else}
			<div class="container mx-auto">
				<!-- イントロダクション -->
				<div class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 110 4H4a2 2 0 01-2-2z"
								></path>
							</svg>
							SwiftUIコンポーネントガイド
						</h2>
						<p class="mb-4">
							SwiftUIでUIを構築するための主要なコンポーネント（ビュー）をまとめたリファレンスです。
							これらを組み合わせることで、アプリのインターフェースを作成します。
						</p>

						<!-- モバイル用検索バー -->
						<div class="lg:hidden">
							<label class="input w-full">
								<svg
									class="h-4 w-4 opacity-50"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
								>
									<g
										stroke-linejoin="round"
										stroke-linecap="round"
										stroke-width="2.5"
										fill="none"
										stroke="currentColor"
									>
										<circle cx="11" cy="11" r="8"></circle>
										<path d="m21 21-4.3-4.3"></path>
									</g>
								</svg>
								<input
									type="text"
									class="grow"
									placeholder="コンポーネントを検索..."
									bind:value={searchQuery}
								/>
								{#if searchQuery}
									<button class="btn btn-circle btn-ghost btn-xs" onclick={clearSearch}>
										<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								{/if}
							</label>
							{#if searchQuery}
								<p class="mt-2 text-sm text-base-content/70">
									{#if isSearching}
										<span class="loading loading-xs loading-spinner"></span>
										検索中...
									{:else}
										{resultCount}件の結果
									{/if}
								</p>
							{/if}
						</div>

						<div class="alert-success/20 alert">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								class="h-6 w-6 shrink-0 stroke-current"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<span
								>コンポーネントは <code>Text()</code> のように大文字で始まります。 見た目を調整するには、スタイリングガイドの修飾子と組み合わせて使用します。</span
							>
						</div>
					</div>
				</div>

				<!-- 検索結果がない場合 -->
				{#if searchQuery && filteredSections.length === 0}
					<div class="card bg-base-100 shadow-xl">
						<div class="card-body items-center text-center">
							<svg
								class="h-16 w-16 text-base-content/30"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<h3 class="text-lg font-semibold">
								「{searchQuery}」に一致するコンポーネントが見つかりません
							</h3>
							<p class="text-base-content/70">別のキーワードで検索してみてください</p>
							<button class="btn mt-2 btn-sm btn-secondary" onclick={clearSearch}
								>検索をクリア</button
							>
						</div>
					</div>
				{/if}

				<!-- 各セクションをJSONから動的に生成 -->
				{#each filteredSections as section (section.id)}
					<div
						id={section.id}
						class="card mb-6 bg-base-100 shadow-xl"
						style="content-visibility: auto; contain-intrinsic-size: 1px 500px;"
					>
						<div class="card-body">
							<h2 class="card-title">{section.title}</h2>
							<p>{section.description}</p>

							{#each section.codeBlocks as codeBlock (codeBlock.title)}
								<CodeBlock title={codeBlock.title} code={codeBlock.code} executable={false} />
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</main>
</div>
