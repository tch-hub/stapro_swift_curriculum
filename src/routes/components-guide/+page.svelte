<script>
	import { base } from '$app/paths';
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import componentData from '$lib/data/components-guide.json';
	import { createSearch, toSafeId, highlightText } from '$lib/composables/useSearch.svelte.js';

	// ローディング状態の管理
	let isLoading = $state(true);

	// JSONからセクションを取得
	const sections = componentData.sections;

	// 検索機能を初期化
	const search = createSearch(sections);

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

	// SvelteKit内部ナビゲーション時のハッシュスクロール対応
	afterNavigate(({ to }) => {
		if (to?.url?.hash) {
			const hash = to.url.hash.substring(1);
			// ローディング完了後にスクロール
			const checkAndScroll = () => {
				if (!isLoading) {
					setTimeout(() => scrollToSection(hash), 100);
				} else {
					setTimeout(checkAndScroll, 100);
				}
			};
			checkAndScroll();
		}
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
			<SearchBar
				bind:value={search.searchQuery}
				placeholder="コンポーネントを検索..."
				resultCount={search.resultCount}
				isSearching={search.isSearching}
				showResults={true}
				onClear={search.clearSearch}
				enableShortcuts={true}
			/>
		</div>

		<ul class="menu">
			<li class="menu-title">UIコンポーネント</li>
			{#if search.searchQuery}
				<!-- タイトル一致 -->
				{#if search.titleMatchSections.length > 0}
					<li class="menu-title text-xs text-primary">タイトル一致 ({search.titleMatchCount})</li>
					{#each search.titleMatchSections as section}
						<li>
							<a
								href="#{section.id}"
								onclick={(e) => handleClick(e, section.id)}
								onkeydown={(e) => handleKeydown(e, section.id)}
								role="button"
								tabindex="0"
							>
								{@html highlightText(section.title, search.searchQuery)}
								<span class="badge badge-sm">{section.codeBlocks.length}</span>
							</a>
							{#if search.matchedCodeBlocks.has(section.id)}
								<ul class="ml-2">
									{#each search.matchedCodeBlocks.get(section.id) as blockTitle}
										{@const blockId = toSafeId(section.id, blockTitle)}
										<li>
											<a
												href="#{blockId}"
												onclick={(e) => handleClick(e, blockId)}
												onkeydown={(e) => handleKeydown(e, blockId)}
												role="button"
												tabindex="0"
												class="text-sm opacity-70 hover:opacity-100"
											>
												{@html highlightText(blockTitle, search.searchQuery)}
											</a>
										</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
				{/if}
				<!-- コード一致 -->
				{#if search.codeMatchSections.length > 0}
					<li class="menu-title text-xs text-secondary">コード一致 ({search.codeMatchCount})</li>
					{#each search.codeMatchSections as section}
						<li>
							<a
								href="#{section.id}"
								onclick={(e) => handleClick(e, section.id)}
								onkeydown={(e) => handleKeydown(e, section.id)}
								role="button"
								tabindex="0"
							>
								{section.title}
								<span class="badge badge-sm badge-secondary">{section.codeBlocks.length}</span>
							</a>
							{#if search.matchedCodeBlocks.has(section.id)}
								<ul class="ml-2">
									{#each search.matchedCodeBlocks.get(section.id) as blockTitle}
										{@const blockId = toSafeId(section.id, blockTitle)}
										<li>
											<a
												href="#{blockId}"
												onclick={(e) => handleClick(e, blockId)}
												onkeydown={(e) => handleKeydown(e, blockId)}
												role="button"
												tabindex="0"
												class="text-sm opacity-70 hover:opacity-100"
											>
												{@html highlightText(blockTitle, search.searchQuery)}
											</a>
										</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
				{/if}
				<!-- 結果なし -->
				{#if search.filteredSections.length === 0}
					<li class="px-4 py-2 text-sm text-base-content/50">該当する項目がありません</li>
				{/if}
			{:else}
				<!-- 検索していない時は通常表示 -->
				{#each search.filteredSections as section}
					<li>
						<a
							href="#{section.id}"
							onclick={(e) => handleClick(e, section.id)}
							onkeydown={(e) => handleKeydown(e, section.id)}
							role="button"
							tabindex="0"
						>
							{section.title}
						</a>
					</li>
				{/each}
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
							<SearchBar
								bind:value={search.searchQuery}
								placeholder="コンポーネントを検索..."
								resultCount={search.resultCount}
								isSearching={search.isSearching}
								showResults={true}
								onClear={search.clearSearch}
							/>
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
				{#if search.searchQuery && search.filteredSections.length === 0}
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
								「{search.searchQuery}」に一致するコンポーネントが見つかりません
							</h3>
							<p class="text-base-content/70">別のキーワードで検索してみてください</p>
							<button class="btn mt-2 btn-sm btn-secondary" onclick={search.clearSearch}
								>検索をクリア</button
							>
						</div>
					</div>
				{/if}

				<!-- 各セクションをJSONから動的に生成 -->
				{#each search.filteredSections as section (section.id)}
					<div
						id={section.id}
						class="card mb-6 bg-base-100 shadow-xl"
						style="content-visibility: auto; contain-intrinsic-size: 1px 500px;"
					>
						<div class="card-body">
							<h2 class="card-title">{section.title}</h2>
							<p>{section.description}</p>

							{#each section.codeBlocks as codeBlock (codeBlock.title)}
								<div id={toSafeId(section.id, codeBlock.title)}>
									<CodeBlock title={codeBlock.title} code={codeBlock.code} executable={false} />
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</main>
</div>
