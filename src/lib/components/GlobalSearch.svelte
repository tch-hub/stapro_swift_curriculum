<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		searchGlobal,
		getSearchResultDetail,
		type SearchResult,
		type Section
	} from '$lib/services/search';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { base } from '$app/paths';

	let isOpen = $state(false);
	let query = $state('');
	let results = $state<SearchResult[]>([]);
	let selectedResult = $state<SearchResult | null>(null);
	let previewSection = $state<Section | undefined>(undefined);
	/** @type {HTMLDialogElement | null} */
	let dialog = $state(null);

	let innerHeight = $state(0);
	let headerHeight = $state(0);
	let contentHeight = $state(0);

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

	function close() {
		isOpen = false;
		dialog?.close();
		query = ''; // Optional: clear on close
		selectedResult = null;
		previewSection = undefined;
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
		selectedResult = result;
		previewSection = getSearchResultDetail(result.pagePath, result.sectionId);
	}

	function closePreview() {
		selectedResult = null;
		previewSection = undefined;
	}

	function navigateToPage() {
		if (selectedResult) {
			close();
			goto(`${base}${selectedResult.pagePath}#${selectedResult.sectionId}`);
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
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
	onclose={() => (isOpen = false)}
>
	<div
		class="modal-box flex w-11/12 flex-col overflow-hidden p-0 transition-all duration-300 {selectedResult
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
					<button class="btn btn-sm btn-primary" onclick={navigateToPage}> ページを開く </button>
				</div>
			{:else}
				<h3 class="mb-4 text-lg font-bold">ドキュメント検索</h3>
				<SearchBar
					bind:value={query}
					placeholder="キーワードを入力... (例: VStack, Int, padding)"
					enableShortcuts={false}
					showResults={false}
				/>
			{/if}
		</div>

		<!-- Search Results or Preview -->
		<div class="flex-1 overflow-y-auto">
			<div class="p-4" bind:clientHeight={contentHeight}>
				{#if selectedResult && previewSection}
					<div class="space-y-6">
						<div>
							<h2 class="text-2xl font-bold">{previewSection.title}</h2>
							<p class="mt-2 text-base-content/80">{previewSection.description}</p>
						</div>

						{#each previewSection.codeBlocks as block}
							<div>
								<CodeBlock
									title={block.title}
									code={block.code}
									executable={false}
									description={block.description}
								/>
							</div>
						{/each}

						{#if previewSection.afterHtml}
							<div class="prose max-w-none">
								{@html previewSection.afterHtml}
							</div>
						{/if}
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
				{:else}
					<div class="flex flex-col items-center justify-center py-8 text-base-content/50">
						<p class="text-center">
							<span class="kbd kbd-sm">⌘</span> <span class="kbd kbd-sm">K</span> でいつでも開けます
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
