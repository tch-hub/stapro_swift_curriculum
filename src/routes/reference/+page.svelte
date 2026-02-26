<script>
	import { base } from '$app/paths';
	import { goto, afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { tick, onMount } from 'svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import basicSyntaxData from '$lib/data/basic-syntax.json';
	import glossaryData from '$lib/data/glossary.json';
	import componentData from '$lib/data/components-guide.json';
	import stylingData from '$lib/data/styling-guide.json';
	import { createSearch, toSafeId, highlightText } from '$lib/composables/useSearch.svelte.js';

	// タブの定義
	const tabs = [
		{
			id: 'basic-syntax',
			label: '基本文法',
			icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
			data: basicSyntaxData,
			placeholder: '文法を検索...',
			title: 'Swift基本文法',
			description:
				'Swiftプログラミングの基本的な文法をまとめたクイックリファレンスです。各構文には実行可能なコード例が付いています。',
			alertText:
				'このページのSwiftコードは、オンライン実行環境「SwiftFiddle」で実際に動かして試すことができます。',
			alertType: 'alert-success'
		},
		{
			id: 'glossary',
			label: '用語解説',
			icon: 'M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z',
			data: glossaryData,
			placeholder: '用語を検索...',
			title: 'Swift/SwiftUI用語解説',
			description:
				'Swift/SwiftUIプログラミングで使われる基本的な用語と概念をまとめた解説ページです。各用語には簡単なコード例と詳しい説明が付いています。',
			alertText:
				'各用語のコードブロック下にある「解説」セクションに詳しい説明があります。用語は日本語・英語どちらでも検索できます。',
			alertType: 'alert-info'
		},
		{
			id: 'components',
			label: 'コンポーネント',
			icon: 'M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 110 4H4a2 2 0 01-2-2z',
			data: componentData,
			placeholder: 'コンポーネントを検索...',
			title: 'SwiftUIコンポーネントガイド',
			description:
				'SwiftUIでUIを構築するための主要なコンポーネント（ビュー）をまとめたリファレンスです。これらを組み合わせることで、アプリのインターフェースを作成します。',
			alertText:
				'コンポーネントは Text() のように大文字で始まります。見た目を調整するには、スタイリングガイドの修飾子と組み合わせて使用します。',
			alertType: 'alert-success'
		},
		{
			id: 'styling',
			label: 'スタイリング',
			icon: 'M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z',
			data: stylingData,
			placeholder: '修飾子を検索...',
			title: 'SwiftUIスタイリングガイド',
			description:
				'SwiftUIでUIの見た目をカスタマイズするための修飾子（Modifier）をまとめたリファレンスです。各修飾子はビューに対してチェーンで適用でき、宣言的にスタイルを定義できます。',
			alertText:
				'修飾子の適用順序は重要です。例えば .padding().background() と .background().padding() では結果が異なります。',
			alertType: 'alert-info'
		}
	];

	// URLパラメータからタブを取得
	let activeTabId = $derived.by(() => {
		const tabParam = $page.url.searchParams.get('tab');
		const validTab = tabs.find((t) => t.id === tabParam);
		return validTab ? tabParam : 'basic-syntax';
	});

	// 現在のタブデータ
	let currentTab = $derived(tabs.find((tab) => tab.id === activeTabId));
	let sections = $derived(currentTab?.data.sections || []);

	// 検索機能を初期化（リアクティブに再作成）
	let search = $derived(createSearch(sections));

	// タブ切り替え時に検索をクリア
	$effect(() => {
		// activeTabIdが変更されたら検索をクリア
		if (search) {
			search.clearSearch();
		}
	});

	// タブ切り替え
	function switchTab(tabId) {
		// URLパラメータを変更してナビゲーション
		const url = new URL(window.location.href);
		url.searchParams.set('tab', tabId);
		goto(url.pathname + url.search, { replaceState: true, noScroll: true });
	}

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
			const offsetTop = elementTop - headerHeight - 20;
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
		<!-- タブ切り替え -->
		<div class="tabs-boxed mb-4 tabs">
			{#each tabs as tab (tab.id)}
				<button
					class="tab text-xs {activeTabId === tab.id ? 'tab-active' : ''}"
					onclick={() => switchTab(tab.id)}
				>
					{tab.label}
				</button>
			{/each}
		</div>

		<!-- 検索バー -->
		<div class="mb-4">
			<SearchBar
				bind:value={search.searchQuery}
				placeholder={currentTab?.placeholder}
				resultCount={search.resultCount}
				isSearching={search.isSearching}
				showResults={true}
				onClear={search.clearSearch}
				enableShortcuts={true}
			/>
		</div>

		<ul class="menu">
			<li class="menu-title">{currentTab?.label}</li>
			{#if activeTabId === 'basic-syntax'}
				<li>
					<a
						href="#how-to-use"
						onclick={(e) => handleClick(e, 'how-to-use')}
						onkeydown={(e) => handleKeydown(e, 'how-to-use')}
						role="button"
						tabindex="0">使いかた</a
					>
				</li>
			{/if}
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
			<!-- タブ切り替え（モバイル用） -->
			<div class="tabs-boxed mb-6 tabs flex justify-center lg:hidden">
				{#each tabs as tab (tab.id)}
					<button
						class="tab flex-1 {activeTabId === tab.id ? 'tab-active' : ''}"
						onclick={() => switchTab(tab.id)}
					>
						<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path d={tab.icon}></path>
						</svg>
						<span class="hidden sm:inline">{tab.label}</span>
					</button>
				{/each}
			</div>

			<!-- イントロダクション -->
			<div class="card mb-6 bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
							<path d={currentTab?.icon}></path>
						</svg>
						{currentTab?.title}
					</h2>
					<p class="mb-4">{currentTab?.description}</p>

					<!-- モバイル用検索バー -->
					<div class="lg:hidden">
						<SearchBar
							bind:value={search.searchQuery}
							placeholder={currentTab?.placeholder}
							resultCount={search.resultCount}
							isSearching={search.isSearching}
							showResults={true}
							onClear={search.clearSearch}
						/>
					</div>

					<div class="alert {currentTab?.alertType}">
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
						<span>{currentTab?.alertText}</span>
					</div>
				</div>
			</div>

			<!-- SwiftFiddle実行の解説（チートシートのみ） -->
			{#if activeTabId === 'basic-syntax'}
				<div id="how-to-use" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								></path>
							</svg>
							SwiftFiddleで実行できます
						</h2>
						<p class="mb-4">
							このページのSwiftコードは、オンライン実行環境「SwiftFiddle」で実際に動かして試すことができます。
						</p>

						<div class="grid gap-4 md:grid-cols-2">
							<div class="space-y-2">
								<h3 class="text-lg font-semibold">使い方</h3>
								<ol class="list-inside list-decimal space-y-1 text-sm">
									<li>各コードブロックの右上にある実行ボタンをクリックする</li>
									<li>
										<a
											href="https://swiftfiddle.com"
											target="_blank"
											rel="noopener noreferrer"
											class="link link-accent">SwiftFiddle</a
										>を開く
									</li>
									<li>このページのコードをコピー</li>
									<li>SwiftFiddleに貼り付けて実行</li>
									<li>結果が右側に表示されます</li>
									<li>clear consoleボタンで右側の結果をリセットできます</li>
								</ol>
							</div>
						</div>
					</div>
				</div>
			{/if}

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
								<CodeBlock
									title={codeBlock.title}
									code={codeBlock.code}
									output={codeBlock.output}
									executable={codeBlock.executable !== undefined
										? codeBlock.executable
										: activeTabId === 'basic-syntax'}
									description={codeBlock.description}
								/>
							</div>
						{/each}

						{#if section.afterHtml}
							{@html section.afterHtml}
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</main>
</div>
