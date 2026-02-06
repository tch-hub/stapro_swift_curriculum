<script>
	import { base } from '$app/paths';
	import { afterNavigate } from '$app/navigation';
	import { tick, onMount } from 'svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import stylingData from '$lib/data/styling-guide.json';
	import { createSearch, toSafeId, highlightText } from '$lib/composables/useSearch.svelte.js';

	// JSONからセクションを取得
	const sections = stylingData.sections;

	// 検索機能を初期化
	const search = createSearch(sections);

	// ページマウント時にURLのハッシュに基づいてスクロール
	onMount(async () => {
		const hash = window.location.hash.substring(1);
		if (hash) {
			await tick();
			scrollToSection(hash);
		}
	});

	// SvelteKit内部ナビゲーション時のハッシュスクロール対応
	afterNavigate(async ({ to }) => {
		if (to?.url?.hash) {
			const hash = to.url.hash.substring(1);
			await tick();
			scrollToSection(hash);
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
				placeholder="修飾子を検索..."
				resultCount={search.resultCount}
				isSearching={search.isSearching}
				showResults={true}
				onClear={search.clearSearch}
				enableShortcuts={true}
			/>
		</div>

		<ul class="menu">
			<li class="menu-title">SwiftUIスタイリング</li>
			{#if search.searchQuery}
				<!-- タイトル一致 -->
				{#if search.titleMatchSections.length > 0}
					<li class="menu-title text-xs text-primary">タイトル一致 ({search.titleMatchCount})</li>
					{#each search.titleMatchSections as section (section.id)}
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
									{#each search.matchedCodeBlocks.get(section.id) as blockTitle (blockTitle)}
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
					{#each search.codeMatchSections as section (section.id)}
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
									{#each search.matchedCodeBlocks.get(section.id) as blockTitle (blockTitle)}
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
				{#each search.filteredSections as section (section.id)}
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
		<div class="container mx-auto">
			<!-- イントロダクション -->
			<div class="card mb-6 bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
								clip-rule="evenodd"
							></path>
						</svg>
						SwiftUIスタイリングガイド
					</h2>
					<p class="mb-4">
						SwiftUIでUIの見た目をカスタマイズするための修飾子（Modifier）をまとめたリファレンスです。
						各修飾子はビューに対してチェーンで適用でき、宣言的にスタイルを定義できます。
					</p>

					<!-- モバイル用検索バー -->
					<div class="lg:hidden">
						<SearchBar
							bind:value={search.searchQuery}
							placeholder="修飾子を検索..."
							resultCount={search.resultCount}
							isSearching={search.isSearching}
							showResults={true}
							onClear={search.clearSearch}
						/>
					</div>

					<div class="alert alert-info">
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
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<span
							>修飾子の適用順序は重要です。例えば <code>.padding().background()</code> と
							<code>.background().padding()</code> では結果が異なります。</span
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
							「{search.searchQuery}」に一致する項目が見つかりません
						</h3>
						<p class="text-base-content/70">別のキーワードで検索してみてください</p>
						<button class="btn mt-2 btn-sm btn-primary" onclick={search.clearSearch}
							>検索をクリア</button
						>
					</div>
				</div>
			{/if}

			<!-- 各セクションをJSONから動的に生成 -->
			{#each search.filteredSections as section (section.id)}
				<div id={section.id} class="card mb-6 bg-base-100 shadow-xl">
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
	</main>
</div>
