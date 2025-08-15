<script>
  import { base } from "$app/paths";
  import CodeBlock from "$lib/CodeBlock.svelte";
  import { onMount } from "svelte";

  // チートシートのセクションデータ
  let sections = []; // チートシートのセクションデータ
  let isLoading = true;

  // 現在選択されているセクション
  let selectedSection = "variables";

  // JSONデータを読み込む
  onMount(async () => {
    try {
      const response = await fetch(`${base}/cheatsheet-data.json`);
      const data = await response.json();
      sections = data.sections;

      // URLのハッシュを確認して対応するセクションを選択
      const hash = window.location.hash.substring(1);
      if (hash && sections.some((section) => section.id === hash)) {
        selectedSection = hash;
      } else if (sections.length > 0) {
        selectedSection = sections[0].id;
      }
    } catch (error) {
      console.error("チートシートデータの読み込みに失敗しました:", error);
    } finally {
      isLoading = false;
    }
  }); // ページ上部にスクロール
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // セクションを選択
  function selectSection(sectionId) {
    selectedSection = sectionId;
    scrollToTop();
  }

  // 現在のセクションのインデックスを取得
  function getCurrentSectionIndex() {
    return sections.findIndex((section) => section.id === selectedSection);
  }

  // 前のタブに移動
  function goToPreviousTab() {
    const currentIndex = getCurrentSectionIndex();
    if (currentIndex > 0) {
      selectedSection = sections[currentIndex - 1].id;
      scrollToTop();
    }
  }

  // 次のタブに移動
  function goToNextTab() {
    const currentIndex = getCurrentSectionIndex();
    if (currentIndex < sections.length - 1) {
      selectedSection = sections[currentIndex + 1].id;
      scrollToTop();
    }
  }

  // 前のタブがあるかチェック
  function hasPreviousTab() {
    return getCurrentSectionIndex() > 0;
  }

  // 次のタブがあるかチェック
  function hasNextTab() {
    return getCurrentSectionIndex() < sections.length - 1;
  }
</script>

<svelte:head>
  <title>Swiftチートシート - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="Swiftの基本構文からSwiftUIまで、実用的なコードサンプル付きチートシート。中学生向けプログラミング学習教材。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">quick_reference</i>
      </h1>
      <h2>Swift & SwiftUI チートシート</h2>
      <p class="large-text">
        Swiftの基本構文からSwiftUIの実装まで、すぐに使えるコードサンプル集
      </p>
      <div class="space"></div>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- ローディング状態 -->
{#if isLoading}
  <section class="center-align">
    <div class="progress circle primary"></div>
    <p class="large-text">チートシートを読み込み中...</p>
  </section>
{:else if sections.length === 0}
  <section class="center-align">
    <i class="large error-text">error</i>
    <h3>データの読み込みに失敗しました</h3>
    <p>
      チートシートデータを読み込めませんでした。ページを再読み込みしてください。
    </p>
  </section>
{:else}
  <!-- BeerCSSのタブ構造に準拠したナビゲーション -->
  <section>
    <nav class="scroll">
      {#each sections as section, index}
        <button
          class="chip {selectedSection === section.id ? 'fill' : ''}"
          onclick={() => selectSection(section.id)}
        >
          <i>{section.icon}</i>{section.title}
        </button>
      {/each}
    </nav>
  </section>

  <div class="space"></div>

  <!-- BeerCSSのページ構造に準拠したコンテンツエリア -->
  {#each sections as section}
    <div class="page {selectedSection === section.id ? 'active' : ''}">
      <div class="center-align">
        <h3>
          <i class="large primary-text">{section.icon}</i>
          {section.title}
        </h3>
      </div>
      <div class="space"></div>
      <div class="grid">
        {#each section.items as item}
          <div class="s12">
            <article class="card round">
              <div class="padding">
                <h6 class="center-align">{item.label}</h6>
                {#if item.description}
                  <p class="center-align small-text secondary-text">
                    {@html item.description.replace(/\n/g, "<br>")}
                  </p>
                {/if}
                <div class="space"></div>

                <!-- テーブルがある場合はテーブルを表示 -->
                {#if item.table}
                  <!-- BeerCSSのテーブルデザインを使用 -->
                  <div class="table-section">
                    <table class="table">
                      <thead>
                        <tr>
                          {#each item.table[0] as header}
                            <th>{header}</th>
                          {/each}
                        </tr>
                      </thead>
                      <tbody>
                        {#each item.table.slice(1) as row}
                          <tr>
                            {#each row as cell}
                              <td>{cell}</td>
                            {/each}
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                {/if}
                <!-- Swiftコードがある場合はコードブロックを表示 -->
                {#if item.swiftCode}
                  <div class="swift-code-section">
                    <div class="code-header">
                      <i class="small">code</i>
                      <span>Swift</span>
                    </div>
                    <CodeBlock
                      code={item.swiftCode}
                      language="swift"
                      output={item.output}
                    />
                  </div>
                {/if}
              </div>
            </article>
          </div>
        {/each}
      </div>
    </div>
  {/each}
  <div class="space"></div>

  <!-- ナビゲーション -->
  <section>
    <div class="grid">
      <!-- 前のタブボタン -->
      <div class="s12 m4">
        <div class="left-align">
          {#if hasPreviousTab()}
            <button
              class="button transparent primary-text"
              onclick={goToPreviousTab}
            >
              <i>arrow_back</i>
              <span>前のタブ</span>
            </button>
          {/if}
        </div>
      </div>

      <!-- ホームに戻るボタン -->
      <div class="s12 m4">
        <div class="center-align">
          <a href="{base}/" class="button transparent primary-text">
            <i>home</i>
            <span>ホームに戻る</span>
          </a>
        </div>
      </div>

      <!-- 次のタブボタン -->
      <div class="s12 m4">
        <div class="right-align">
          {#if hasNextTab()}
            <button
              class="button transparent primary-text"
              onclick={goToNextTab}
            >
              <span>次のタブ</span>
              <i>arrow_forward</i>
            </button>
          {/if}
        </div>
      </div>
    </div>
  </section>
{/if}

<style>
  .hero-section {
    padding: 3rem 0;
    background: linear-gradient(
      135deg,
      var(--primary-container) 0%,
      var(--secondary-container) 100%
    );
    border-radius: 1rem;
    margin-bottom: 2rem;
  }

  .large-text {
    font-size: 1.2rem;
    line-height: 1.6;
  }

  .small-text {
    font-size: 0.9rem;
    line-height: 1.4;
  }

  /* テーブルセクションのスタイル */
  .table-section {
    margin-bottom: 1.5rem;
    overflow-x: auto;
  }
  .table {
    width: 100%;
    border-collapse: collapse;
    background: var(--surface-container, #fff);
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    margin-bottom: 0.5rem;
  }
  .table th,
  .table td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #eee;
    text-align: left;
  }
  .table th {
    background: var(--primary-container, #f5f5f5);
    color: var(--primary, #333);
    font-weight: bold;
  }
  .table tr:last-child td {
    border-bottom: none;
  }
  .swift-code-section {
    padding: 0.75rem;
    border-radius: 8px;
    background-color: rgba(var(--surface-variant), 0.3);
    border-left: 4px solid var(--primary);
  }

  .code-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    border-radius: 4px;
    font-weight: 500;
    font-size: 0.875rem;
    background-color: rgba(255, 87, 34, 0.2);
    color: #d84315;
  }

  @media (max-width: 768px) {
    .swift-code-section {
      padding: 0.5rem;
    }

    .code-header {
      padding: 0.375rem;
      font-size: 0.8rem;
    }
  }
</style>
