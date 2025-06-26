<!--
  CodeBlock.svelte - コードブロック表示コンポーネント
  
  使い方:
  1. 基本的な使用法
    <CodeBlock code="console.log('Hello World!');" language="javascript" />
  
  2. Swiftコードの表示
    <CodeBlock 
      code="let message = \"こんにちは\"
print(message)" 
      language="swift" 
    />
  
  3. 複数行のコードをバックティックで囲んで使用
    <CodeBlock 
      code={`func greet(name: String) {
    print("Hello, \(name)!")
}`} 
      language="swift" 
    />
  
  Props:
  - code: 表示するコードの文字列（必須）
  - language: シンタックスハイライト用の言語名（オプション）
  
  機能:
  - コードのシンタックスハイライト表示
  - コピーボタンでクリップボードにコピー
  - レスポンシブ対応の横スクロール
-->

<script>
  export let code = "";
  export let language = "";

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => {
      console.log("コードをコピーしました");
    });
  }
</script>

<div class="code-block">
  <pre class="surface-container padding">
    <code class={language}>{code}</code>
  </pre>
  <button class="button primary small" onclick={copyCode}>
    <i>content_copy</i>
    <span>コピー</span>
  </button>
</div>

<style>
  .code-block {
    margin: 1rem 0;
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

  .button {
    margin-top: 0.5rem;
  }
</style>
