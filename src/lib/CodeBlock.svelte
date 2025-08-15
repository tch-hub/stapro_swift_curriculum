<!--
  CodeBlock.svelte - コードブロック表示コンポーネント
  
  Props:
  - code: 表示するコードの文字列（必須）
  - language: シンタックスハイライト用の言語名（オプション）
  - output: コードの実行結果（オプション）
  
  機能:
  - コードのシンタックスハイライト表示
  - 実行結果の表示
  - コピーボタンでクリップボードにコピー
  - レスポンシブ対応の横スクロール
-->

<script>
  export let code = "";
  export let language = "";
  export let output = "";

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => {
      // TODO: Snackbar等でフィードバック表示
      console.log("コードをコピーしました");
    });
  }
</script>

<div class="code-block">
  <pre class="surface-container padding">
    <code class={language}>{code}</code>
  </pre>
  {#if output}
    <div class="output-block">
      <div class="output-header">
        <i class="small">terminal</i>
        <span>出力</span>
      </div>
      <pre class="output-body"><code>{output}</code></pre>
    </div>
  {/if}
  <div class="actions">
    <button class="button primary small" onclick={copyCode}>
      <i>content_copy</i>
      <span>コピー</span>
    </button>
  </div>
</div>

<style>
  .code-block {
    margin: 1rem 0;
    position: relative;
  }

  pre {
    font-family: "Consolas", "Monaco", "Courier New", monospace;
    font-size: 0.85rem;
    line-height: 1.4;
    overflow-x: auto;
    margin: 0.5rem 0;
  }

  code {
    color: inherit;
    white-space: pre-wrap;
  }

  .actions {
    margin-top: 0.5rem;
  }

  .output-block {
    margin-top: 1rem;
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--surface-container-highest);
    border: 1px solid var(--outline);
  }

  .output-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: var(--surface-container-high);
    color: var(--on-surface-variant);
    font-weight: 500;
    font-size: 0.875rem;
    border-bottom: 1px solid var(--outline);
  }

  .output-body {
    padding: 0.75rem;
    margin: 0;
    font-size: 0.85rem;
  }
</style>
