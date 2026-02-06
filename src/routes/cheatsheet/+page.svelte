<script>
	import { base } from '$app/paths';
	import { afterNavigate } from '$app/navigation';
	import { tick, onMount } from 'svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import cheatsheetData from '$lib/data/cheatsheet.json';
	import { createSearch, toSafeId, highlightText } from '$lib/composables/useSearch.svelte.js';

	// JSONからセクションを取得
	const sections = cheatsheetData.sections;

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
				placeholder="文法を検索..."
				resultCount={search.resultCount}
				isSearching={search.isSearching}
				showResults={true}
				onClear={search.clearSearch}
				enableShortcuts={true}
			/>
		</div>

		<ul class="menu">
			<li class="menu-title">Swift基本文法</li>
			<li>
				<a
					href="#how-to-use"
					onclick={(e) => handleClick(e, 'how-to-use')}
					onkeydown={(e) => handleKeydown(e, 'how-to-use')}
					role="button"
					tabindex="0">使いかた</a
				>
			</li>
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
			<!-- SwiftFiddle実行の解説 -->
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

					<!-- モバイル用検索バー -->
					<div class="mt-4 lg:hidden">
						<SearchBar
							bind:value={search.searchQuery}
							placeholder="文法を検索..."
							resultCount={search.resultCount}
							isSearching={search.isSearching}
							showResults={true}
							onClear={search.clearSearch}
						/>
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
								<CodeBlock
									title={codeBlock.title}
									code={codeBlock.code}
									output={codeBlock.output}
									executable={codeBlock.executable}
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
