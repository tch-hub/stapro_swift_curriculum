<script>
	// プロパティの定義
	let {
		code = '', // 表示するコード
		language = 'swift', // プログラミング言語（現在はswiftのみ）
		title = '', // コードブロックのタイトル
		fileName = '', // 編集するファイル名
		executable = false, // 実行可能コードかどうか
		showLineNumbers = true, // 行番号を表示するかどうか
		output = '', // 実行結果
		showHeader = true // ヘッダーを表示するかどうか
	} = $props(); // コピー機能の状態管理
	let copied = $state(false);
	// 実行機能の状態管理
	let runMessage = $state('');

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

	// Swiftコードを実行（SwiftFiddleで開く）
	async function runCode() {
		try {
			await navigator.clipboard.writeText(code);
			const confirmed = confirm(
				'コードをクリップボードにコピーしました。\n\nSwiftFiddleで実行するには：\n1. 開いたページでコードを貼り付ける\n2. 「Run」ボタンをクリック\n\nSwiftFiddleを開きますか？'
			);
			if (confirmed) {
				window.open('https://swiftfiddle.com/', '_blank');
			}
		} catch (err) {
			console.error('コピーに失敗しました:', err);
			runMessage = 'コピーに失敗しました。手動でコードをコピーしてください。';
			setTimeout(() => {
				runMessage = '';
			}, 3000);
		}
	}

	// 行番号付きでコードを表示するための処理
	// code / language が変化したときにも Prism ハイライトを再適用する
	$effect(() => {
		// 依存として code / language / showLineNumbers を参照することで
		// これらが変化したときにこの effect が再実行されるようにする
		const __dep = `${code}|${language}|${showLineNumbers}`;
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
	{#if showHeader}
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
				{#if fileName}
					<span class="text-xs text-base-content opacity-70">{fileName}</span>
				{/if}
				<span class="badge badge-outline badge-sm">Swift</span>
				{#if executable}
					<button
						class="btn btn-ghost btn-xs"
						onclick={runCode}
						title="SwiftFiddleで実行"
						aria-label="SwiftFiddleで実行"
					>
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
								clip-rule="evenodd"
							></path>
						</svg>
					</button>
				{/if}
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
	{/if}

	<!-- コード表示部分 -->
	<div class="code-content">
		<pre
			class="language-swift {showLineNumbers
				? 'line-numbers'
				: ''} m-0 overflow-x-auto bg-transparent p-4"><code class="language-swift">{code}</code
			></pre>
	</div>

	<!-- 実行結果表示部分 -->
	{#if output}
		<div class="output-content border-t border-base-300">
			<div class="output-header bg-base-200 px-4 py-2">
				<h4 class="text-sm font-semibold text-base-content">実行結果</h4>
			</div>
			<pre class="m-0 overflow-x-auto bg-base-300 p-4 text-base-content"><code>{output}</code></pre>
		</div>
	{/if}

	<!-- 実行メッセージ表示部分 -->
	{#if runMessage}
		<div class="run-message-content border-t border-base-300">
			<div class="run-message-header bg-info px-4 py-2">
				<h4 class="text-sm font-semibold text-info-content">実行メッセージ</h4>
			</div>
			<div class="px-4 py-2 text-info-content">
				{runMessage}
			</div>
		</div>
	{/if}
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

	/* Prism.jsのデフォルトmarginを削除 */
	.code-content pre {
		margin: 0 !important;
	}

	/* 実行結果のスタイル */
	.output-content pre {
		font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	/* 実行メッセージのスタイル */
	.run-message-content {
		font-size: 0.875rem;
	}
</style>
