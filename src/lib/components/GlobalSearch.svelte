<script lang="ts">
	import { onMount } from 'svelte';

	import {
		searchGlobal,
		getSearchResultDetail,
		type SearchResult,
		type SearchResultDetail
	} from '$lib/services/search';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { base } from '$app/paths';

	let isOpen = $state(false);
	let query = $state('');
	let results = $state<SearchResult[]>([]);
	let selectedResult = $state<SearchResult | null>(null);
	let previewDetail = $state<SearchResultDetail | undefined>(undefined);
	/** @type {HTMLDialogElement | null} */
	let dialog = $state(null);
	let modalBox = $state<HTMLDivElement | null>(null);

	let innerHeight = $state(0);
	let headerHeight = $state(0);
	let contentHeight = $state(0);

	/** localStorage検索履歴 */
	const HISTORY_KEY = 'globalSearchHistory';
	const MAX_HISTORY = 20;
	let savedHistory = $state<string[]>([]);

	function loadHistory(): string[] {
		try {
			const raw = localStorage.getItem(HISTORY_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	}

	function saveToHistory(q: string) {
		const trimmed = q.trim();
		if (!trimmed) return;
		savedHistory = [trimmed, ...savedHistory.filter((h) => h !== trimmed)].slice(0, MAX_HISTORY);
		localStorage.setItem(HISTORY_KEY, JSON.stringify(savedHistory));
	}

	function removeFromHistory(q: string) {
		savedHistory = savedHistory.filter((h) => h !== q);
		localStorage.setItem(HISTORY_KEY, JSON.stringify(savedHistory));
	}

	function clearAllHistory() {
		savedHistory = [];
		localStorage.removeItem(HISTORY_KEY);
	}

	/** テキスト選択による再検索用 */
	let selectionText = $state('');
	let selectionPos = $state<{ x: number; y: number } | null>(null);

	/** 検索履歴スタック（前の検索に戻るため） */
	let searchHistory = $state<
		{ query: string; selectedResult: SearchResult | null; previewDetail?: SearchResultDetail }[]
	>([]);

	let dialogHeight = $derived(
		innerHeight ? Math.min(headerHeight + contentHeight + 32, innerHeight * 0.8) : 600
	);

	$effect(() => {
		if (query) {
			selectedResult = null; // Clear preview on search
			results = searchGlobal(query);
		} else {
			results = [];
		}
	});

	export function open(initialQuery = '') {
		isOpen = true;
		if (typeof initialQuery === 'string' && initialQuery.trim().length > 0) {
			query = initialQuery.trim();
		}
		dialog?.showModal();
	}

	// ... (keep existing functions close, handleKeydown, etc. unchanged)

	function handleKeydown(e: KeyboardEvent) {
		// Cmd+K or Ctrl+K to open
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			if (!isOpen) {
				const selection = window.getSelection()?.toString() ?? '';
				open(selection);
			}
		}
	}

	function handleResultClick(result: SearchResult) {
		saveToHistory(query);
		selectedResult = result;
		previewDetail = getSearchResultDetail(result.pagePath, result.sectionId, result.codeBlockIndex);
	}

	function closePreview() {
		selectedResult = null;
		previewDetail = undefined;
	}

	/** ダイアログ内でのテキスト選択を検知 */
	function handleSelectionChange() {
		const sel = window.getSelection();
		if (!sel || sel.isCollapsed || !modalBox) {
			selectionText = '';
			selectionPos = null;
			return;
		}

		const text = sel.toString().trim();
		if (!text || text.length > 100) {
			selectionText = '';
			selectionPos = null;
			return;
		}

		// 選択範囲がmodal-box内かチェック
		const range = sel.getRangeAt(0);
		const rect = range.getBoundingClientRect();
		const boxRect = modalBox.getBoundingClientRect();

		if (
			rect.top >= boxRect.top &&
			rect.bottom <= boxRect.bottom &&
			rect.left >= boxRect.left &&
			rect.right <= boxRect.right
		) {
			selectionText = text;
			// modal-box基準の相対位置
			selectionPos = {
				x: rect.left + rect.width / 2 - boxRect.left,
				y: rect.top - boxRect.top - 40
			};
		} else {
			selectionText = '';
			selectionPos = null;
		}
	}

	/** 選択テキストで再検索 */
	function searchSelection() {
		if (!selectionText) return;

		// 現在の状態を履歴に保存
		searchHistory = [
			...searchHistory,
			{
				query,
				selectedResult,
				previewDetail
			}
		];

		// 選択テキストで新しい検索を実行
		saveToHistory(selectionText);
		query = selectionText;
		selectedResult = null;
		previewDetail = undefined;
		selectionText = '';
		selectionPos = null;
	}

	/** 前の検索に戻る */
	function goBackSearch() {
		if (searchHistory.length === 0) return;
		const prev = searchHistory[searchHistory.length - 1];
		searchHistory = searchHistory.slice(0, -1);

		query = prev.query;
		selectedResult = prev.selectedResult;
		previewDetail = prev.previewDetail;
	}

	onMount(() => {
		savedHistory = loadHistory();
		window.addEventListener('keydown', handleKeydown);
		document.addEventListener('selectionchange', handleSelectionChange);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('selectionchange', handleSelectionChange);
		};
	});
</script>

<svelte:window bind:innerHeight />

<!-- Floating Action Button -->
<button
	class="btn fixed right-6 bottom-6 z-50 btn-circle shadow-lg transition-transform btn-primary hover:scale-110"
	onclick={() => open(window.getSelection()?.toString() ?? '')}
	aria-label="検索を開く"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-6 w-6"
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
</button>

<!-- Search Dialog -->
<dialog
	bind:this={dialog}
	class="modal modal-bottom sm:modal-middle"
	onclose={() => {
		isOpen = false;
		searchHistory = [];
		selectionText = '';
		selectionPos = null;
	}}
>
	<div
		bind:this={modalBox}
		class="relative modal-box flex w-11/12 flex-col overflow-hidden p-0 transition-all duration-300 {selectedResult
			? '!max-w-7xl'
			: 'max-w-5xl'}"
		style="height: {dialogHeight}px"
	>
		<!-- Search Header -->
		<div class="sticky top-0 z-10 border-b bg-base-100 p-4" bind:clientHeight={headerHeight}>
			<form method="dialog">
				<button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
			</form>
			{#if selectedResult}
				<div class="mr-8 flex items-center gap-2">
					<button class="btn gap-2 btn-ghost btn-sm" onclick={closePreview}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						戻る
					</button>
					<span class="flex-1 truncate font-bold">{selectedResult.title}</span>
					<a
						class="btn btn-sm btn-primary"
						href="{base}{selectedResult.pagePath}#{selectedResult.sectionId}"
						target="_blank"
					>
						ページを開く
					</a>
				</div>
			{:else}
				<div class="mr-8">
					{#if searchHistory.length > 0}
						<div class="mb-2 flex items-center gap-2">
							<button class="btn gap-1 btn-ghost btn-xs" onclick={goBackSearch}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-3 w-3"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 19l-7-7 7-7"
									/>
								</svg>
								「{searchHistory[searchHistory.length - 1].query}」に戻る
							</button>
						</div>
					{:else}
						<h3 class="mb-4 text-lg font-bold">ドキュメント検索</h3>
					{/if}
					<SearchBar
						bind:value={query}
						placeholder="キーワードを入力... (例: VStack, Int, padding)"
						enableShortcuts={false}
						showResults={false}
					/>
				</div>
			{/if}
		</div>

		<!-- Search Results or Preview -->
		<div class="flex-1 overflow-y-auto">
			<div class="p-4" bind:clientHeight={contentHeight}>
				{#if selectedResult && previewDetail}
					<div class="space-y-6">
						<div>
							<p class="text-sm text-base-content/60">{previewDetail.sectionTitle}</p>
						</div>

						<CodeBlock
							title={previewDetail.codeBlock.title}
							code={previewDetail.codeBlock.code}
							executable={false}
							description={previewDetail.codeBlock.description}
						/>
					</div>
				{:else if query}
					{#if results.length > 0}
						<div class="flex flex-col gap-2">
							{#each results as result}
								<button
									class="card bg-base-200 text-left transition-colors hover:bg-base-300"
									onclick={() => handleResultClick(result)}
								>
									<div class="card-body p-4">
										<div class="flex items-start justify-between">
											<div>
												<h4 class="flex items-center gap-2 font-bold">
													{result.title}
													<span class="badge badge-outline badge-sm text-xs font-normal"
														>{result.pageTitle}</span
													>
												</h4>
												<p class="mt-1 line-clamp-2 text-sm text-base-content/70">
													{result.description}
												</p>
											</div>
											{#if result.matchType !== 'description'}
												<span
													class="badge badge-sm"
													class:badge-primary={result.matchType === 'title'}
													class:badge-secondary={result.matchType === 'keyword'}
												>
													{result.matchType === 'title'
														? 'タイトル一致'
														: result.matchType === 'keyword'
															? 'キーワード'
															: 'コード'}
												</span>
											{/if}
										</div>
									</div>
								</button>
							{/each}
						</div>
					{:else}
						<div class="flex flex-col items-center justify-center py-8 text-base-content/50">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mb-4 h-16 w-16 opacity-50"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<p>「{query}」に一致する結果は見つかりませんでした</p>
						</div>
					{/if}
				{:else if savedHistory.length > 0}
					<div>
						<div class="mb-3 flex items-center justify-between">
							<h4 class="text-sm font-semibold text-base-content/60">検索履歴</h4>
							<button class="btn text-base-content/50 btn-ghost btn-xs" onclick={clearAllHistory}>
								すべて削除
							</button>
						</div>
						<div class="flex flex-col gap-1">
							{#each savedHistory as historyItem}
								<div
									class="group flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-base-200"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4 shrink-0 text-base-content/40"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<button
										class="flex-1 cursor-pointer truncate text-left text-sm"
										onclick={() => {
											query = historyItem;
										}}
									>
										{historyItem}
									</button>
									<button
										class="btn btn-circle opacity-0 btn-ghost transition-opacity btn-xs group-hover:opacity-100"
										onclick={() => removeFromHistory(historyItem)}
										aria-label="履歴から削除"
									>
										<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center py-8 text-base-content/50">
						<p class="text-center">
							<span class="kbd kbd-sm">⌘</span> <span class="kbd kbd-sm">K</span> でいつでも開けます
						</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Selection search popup -->
		{#if isOpen && selectionText && selectionPos}
			<button
				class="selection-search-btn btn shadow-lg btn-sm btn-primary"
				style="left: {selectionPos.x}px; top: {selectionPos.y}px;"
				onmousedown={(e) => {
					e.preventDefault();
					searchSelection();
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-3.5 w-3.5"
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
				「{selectionText.length > 20 ? selectionText.slice(0, 20) + '...' : selectionText}」を検索
			</button>
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<style>
	.selection-search-btn {
		position: absolute;
		z-index: 20;
		transform: translateX(-50%);
		white-space: nowrap;
		animation: fade-in 0.15s ease-out;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}
</style>
