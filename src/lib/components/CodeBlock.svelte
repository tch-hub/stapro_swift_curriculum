<script>
	// プロパティの定義
	let {
		code = '', // 表示するコード
		language = 'swift', // プログラミング言語（現在はswiftのみ）
		title = '', // コードブロックのタイトル
		executable = false, // 実行可能コードかどうか
		showLineNumbers = true // 行番号を表示するかどうか
	} = $props();

	// コピー機能の状態管理
	let copied = $state(false);

	// クリップボードにコードをコピーする関数
	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000); // 2秒後にコピー状態をリセット
		} catch (err) {
			console.error('コピーに失敗しました:', err);
		}
	}

	// 行番号付きでコードを表示するための処理
	$effect(() => {
		// Prism.jsでシンタックスハイライトを適用
		if (typeof window !== 'undefined' && window.Prism) {
			window.Prism.highlightAll();
		}
	});
</script>

<!-- Prism.jsのスタイル読み込み -->
<svelte:head>
	<link
		href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css"
		rel="stylesheet"
	/>
	<link
		href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css"
		rel="stylesheet"
	/>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"
	></script>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"
	></script>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"
	></script>
</svelte:head>

<div class="code-block my-4 overflow-hidden rounded-lg bg-base-100 shadow-lg">
	<!-- ヘッダー部分 -->
	<div class="code-header flex items-center justify-between bg-base-200 px-4 py-2">
		<div class="flex items-center space-x-2">
			{#if title}
				<h3 class="text-sm font-semibold text-base-content">{title}</h3>
			{/if}
			{#if executable}
				<span class="badge badge-sm badge-success">実行可能</span>
			{/if}
		</div>
		<div class="flex items-center space-x-2">
			<span class="text-xs text-base-content opacity-70">Swift</span>
			<button class="btn btn-ghost btn-xs" onclick={copyToClipboard} title="コードをコピー">
				{#if copied}
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						></path>
					</svg>
				{:else}
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
						<path
							d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
						></path>
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- コード表示部分 -->
	<div class="code-content">
		<pre
			class="language-swift {showLineNumbers
				? 'line-numbers'
				: ''} m-0 overflow-x-auto bg-transparent p-4"><code class="language-swift">{code}</code
			></pre>
	</div>
</div>

<style>
	.code-block {
		font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
	}

	/* シンタックスハイライトのカスタマイズ */
	.code-content :global(.token.keyword) {
		color: #c678dd;
		font-weight: bold;
	}

	.code-content :global(.token.string) {
		color: #98c379;
	}

	.code-content :global(.token.number) {
		color: #d19a66;
	}

	.code-content :global(.token.comment) {
		color: #5c6370;
		font-style: italic;
	}

	.code-content :global(.token.function) {
		color: #61afef;
	}

	.code-content :global(.token.class-name) {
		color: #e5c07b;
	}

	/* スクロールバーのスタイル */
	.code-content pre::-webkit-scrollbar {
		height: 8px;
	}

	.code-content pre::-webkit-scrollbar-track {
		background: hsl(var(--b2));
	}

	.code-content pre::-webkit-scrollbar-thumb {
		background: hsl(var(--bc) / 0.3);
		border-radius: 4px;
	}

	.code-content pre::-webkit-scrollbar-thumb:hover {
		background: hsl(var(--bc) / 0.5);
	}
</style>
