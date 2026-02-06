<script>
	import { onMount } from 'svelte';

	/**
	 * 検索バーコンポーネント
	 * サイドバーとモバイル両方で使用可能
	 */

	/** @type {string} */
	let {
		value = $bindable(''),
		placeholder = '検索...',
		resultCount = 0,
		isSearching = false,
		showResults = false,
		onClear = () => {},
		enableShortcuts = false
	} = $props();

	/** @type {HTMLInputElement | null} */
	let inputRef = $state(null);

	// Escapeキーで検索クリア
	function handleKeydown(event) {
		if (event.key === 'Escape' && value) {
			event.preventDefault();
			onClear();
			inputRef?.blur();
		}
	}

	// グローバルキーボードショートカット
	onMount(() => {
		if (!enableShortcuts) return;

		function handleGlobalKeydown(event) {
			// 入力フィールド内では無視
			const target = event.target;
			if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
				return;
			}

			// / キーで検索にフォーカス
			if (event.key === '/') {
				event.preventDefault();
				inputRef?.focus();
			}

			// Ctrl+K または Cmd+K で検索にフォーカス
			if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
				event.preventDefault();
				inputRef?.focus();
			}
		}

		window.addEventListener('keydown', handleGlobalKeydown);
		return () => window.removeEventListener('keydown', handleGlobalKeydown);
	});
</script>

<div class="search-bar" role="search">
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
			{placeholder}
			bind:value
			bind:this={inputRef}
			onkeydown={handleKeydown}
			aria-label="検索"
			aria-describedby={showResults ? 'search-results-count' : undefined}
		/>
		{#if value}
			<button class="btn btn-circle btn-ghost btn-xs" onclick={onClear} aria-label="検索をクリア">
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
		{#if enableShortcuts}
			<kbd class="kbd kbd-xs opacity-50">/</kbd>
		{/if}
	</label>
	{#if showResults && value}
		<p id="search-results-count" class="mt-2 text-sm text-base-content/70" aria-live="polite">
			{#if isSearching}
				<span class="loading loading-xs loading-spinner"></span>
				検索中...
			{:else}
				{resultCount}件の結果
			{/if}
		</p>
	{/if}
</div>
