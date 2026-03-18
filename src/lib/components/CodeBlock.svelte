<script>
	import { onMount, tick } from 'svelte';
	import Prism from 'prismjs';

	// Prism setup
	import 'prismjs/themes/prism-tomorrow.css';
	import 'prismjs/components/prism-swift.min.js';
	import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js';
	import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
	import 'prismjs/plugins/remove-initial-line-feed/prism-remove-initial-line-feed.min.js';
	import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.min.js';
	import 'prismjs/plugins/match-braces/prism-match-braces.min.js';
	import 'prismjs/plugins/match-braces/prism-match-braces.css';

	/**
	 * SwiftのString Interpolation \() が match-braces を壊す問題への対策
	 * interpolation-punctuation から 'punctuation' クラスを取り除くことで、
	 * match-braces が () をペアとして誤認識するのを防ぐ
	 */
	Prism.hooks.add('wrap', (env) => {
		if (env.language === 'swift' && env.type === 'interpolation-punctuation') {
			env.classes = env.classes.filter((c) => c !== 'punctuation');
			env.classes.push('swift-interpolation-punc');
		}
	});

	// Props
	let {
		code = '',
		language = 'swift',
		title = '',
		description = '',
		fileName = '',
		executable = false,
		showLineNumbers = true,
		output = '',
		showHeader = true,
		dataAttribute = ''
	} = $props();

	// Component State
	let copied = $state(false);
	let runSuccess = $state(false);
	let runMessage = $state('');
	let mounted = $state(false);
	let codeElement = $state();

	// Computed
	let displayCode = $derived(code.replace(/\t/g, '  '));

	/**
	 * クリップボードへのコピー処理
	 */
	async function performCopy(text, type = 'copy') {
		try {
			await navigator.clipboard.writeText(text);
			if (type === 'copy') {
				copied = true;
				setTimeout(() => (copied = false), 2000);
			} else {
				runSuccess = true;
				setTimeout(() => (runSuccess = false), 3000);
			}
			return true;
		} catch (err) {
			console.error('コピーに失敗しました:', err);
			if (type === 'run') {
				runMessage = 'コピーに失敗しました。手動でコピーしてください。';
				setTimeout(() => (runMessage = ''), 3000);
			}
			return false;
		}
	}

	function copyToClipboard() {
		performCopy(code, 'copy');
	}

	async function runCode() {
		const success = await performCopy(displayCode, 'run');
		if (success) {
			window.open('https://swiftfiddle.com/', '_blank');
		}
	}

	// Lifecycle & Effects
	onMount(() => {
		mounted = true;
	});

	/**
	 * 依存関係の変化に合わせてハイライトを再適用
	 */
	$effect(() => {
		// 依存関係の追跡
		const triggers = [displayCode, language, showLineNumbers, mounted];
		if (mounted && codeElement) {
			tick().then(() => Prism.highlightElement(codeElement));
		}
	});
</script>

<div
	class="code-block overflow-hidden rounded-lg bg-base-100 shadow-lg"
	data-search-tutorial={dataAttribute || undefined}
>
	{#if showHeader}
		<!-- ヘッダー部分 -->
		<div class="code-header sticky top-0 z-10 flex items-center justify-between border-b border-base-300 bg-base-200 px-4 py-2 backdrop-blur-sm">
			<div class="flex items-center space-x-2">
				{#if title}
					<h3 class="m-0 text-sm font-semibold text-base-content">{title}</h3>
				{:else if fileName}
					<h3 class="m-0 font-mono text-sm font-semibold text-base-content">{fileName}</h3>
				{/if}
				{#if executable}
					<span class="badge badge-sm badge-success">実行可能</span>
				{/if}
			</div>

			<div class="flex items-center space-x-1">
				{#if title && fileName}
					<span class="mr-2 font-mono text-xs text-base-content opacity-70">{fileName}</span>
				{/if}
				<span class="badge badge-outline badge-sm mr-1">Swift</span>

				<!-- 実行ボタン -->
				{#if executable}
					<div
						class="tooltip tooltip-left {runSuccess ? 'tooltip-open tooltip-success' : ''}"
						data-tip={runSuccess ? 'Copied & Opening!' : 'SwiftFiddleで実行'}
					>
						<button
							class="btn btn-ghost btn-xs {runSuccess ? 'text-success' : ''}"
							onclick={runCode}
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
					</div>
				{/if}

				<!-- コピーボタン -->
				<div
					class="tooltip tooltip-left {copied ? 'tooltip-open tooltip-success' : ''}"
					data-tip={copied ? 'Copied!' : 'コードをコピー'}
				>
					<button
						class="btn btn-ghost btn-xs {copied ? 'text-success' : ''}"
						onclick={copyToClipboard}
						aria-label="コードをコピー"
					>
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
		</div>

		<!-- アクセシビリティ用の非表示ステータス領域 -->
		<div class="sr-only" aria-live="polite">
			{#if copied}コードをコピーしました{/if}
			{#if runSuccess}コードをコピーしてSwiftFiddleを開きました{/if}
		</div>
	{/if}

	<!-- コード表示部分 -->
	<div class="code-content">
		<pre
			class="language-swift match-braces rainbow-braces {showLineNumbers
				? 'line-numbers'
				: ''} m-0 overflow-x-auto bg-transparent p-4"><code
				bind:this={codeElement}
				class="language-swift">{displayCode}</code
			></pre>
	</div>

	<!-- 解説表示部分 -->
	{#if description}
		<div class="description-content border-t border-base-300">
			<div class="description-header bg-base-200 px-4 py-2">
				<h4 class="text-sm font-semibold text-base-content">解説</h4>
			</div>
			<div class="bg-base-100 px-4 py-3 text-sm leading-relaxed text-base-content/80">
				{description}
			</div>
		</div>
	{/if}

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

	/* ボタンのホバーアニメーション */
	.btn-ghost {
		transition: all 0.2s ease;
	}

	.btn-ghost:hover {
		transform: translateY(-1px);
	}

	.btn-ghost:active {
		transform: translateY(0);
	}

	/* Prism.jsのデフォルトmarginを削除 */
	.code-content pre {
		margin: 0;
		overflow-x: auto;
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

	/* リセット用スタイル: proseの影響を打ち消す */
	:global(.prose .code-block h3) {
		margin-top: 0 !important;
		margin-bottom: 0 !important;
	}

	/* SwiftのString Interpolation \() によるMatch Braces誤作動を防ぐ対策
	   js側で punctuation クラスを swift-interpolation-punc に置換しているため、
	   元の punctuation 用の色を割り当てる */
	:global(.token.string-literal .token.swift-interpolation-punc) {
		color: #ccc !important;
	}

	:global(.token.string-literal .token.interpolation.language-swift) {
		color: #e5c07b !important; /* 変数部分の色 */
	}

	/* Rainbow Bracesの色カスタマイズ */
	.code-content :global(.rainbow-braces .token.punctuation.brace-level-1),
	.code-content :global(.rainbow-braces .token.punctuation.brace-level-5),
	.code-content :global(.rainbow-braces .token.punctuation.brace-level-9) {
		color: #ccc; /* 第一階層（ネストなし）の基本色は白系 */
	}

	.code-content :global(.rainbow-braces .token.punctuation.brace-level-2),
	.code-content :global(.rainbow-braces .token.punctuation.brace-level-6),
	.code-content :global(.rainbow-braces .token.punctuation.brace-level-10) {
		color: #e5c07b; /* 第二階層 */
	}

	.code-content :global(.rainbow-braces .token.punctuation.brace-level-3),
	.code-content :global(.rainbow-braces .token.punctuation.brace-level-7),
	.code-content :global(.rainbow-braces .token.punctuation.brace-level-11) {
		color: #c678dd; /* 第三階層 */
	}

	.code-content :global(.rainbow-braces .token.punctuation.brace-level-4),
	.code-content :global(.rainbow-braces .token.punctuation.brace-level-8),
	.code-content :global(.rainbow-braces .token.punctuation.brace-level-12) {
		color: #61afef; /* 第四階層 */
	}
</style>
