<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import CodeBlock from "$lib/CodeBlock.svelte";

  // チュートリアルデータ
  let tutorialCategories = [];
  let isLoading = true;
  let hasError = false;

  // JSONファイルからチュートリアルデータを読み込み
  async function loadTutorialData() {
    try {
      isLoading = true;
      hasError = false;
      const response = await fetch(`${base}/tutorial-data.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      tutorialCategories = data.tutorialCategories;
    } catch (error) {
      console.error("チュートリアルデータの読み込みに失敗しました:", error);
      hasError = true;
      tutorialCategories = []; // エラー時は空配列
    } finally {
      isLoading = false;
    }
  }

  // コンポーネントがマウントされた時にデータを読み込み
  onMount(() => {
    loadTutorialData();
  });

  // 選択されたカテゴリ
  let selectedCategory = "text-basics";

  // カテゴリ選択
  function selectCategory(categoryId) {
    selectedCategory = categoryId;
  }

  // 選択されたカテゴリを取得
  function getSelectedCategory() {
    return tutorialCategories.find((cat) => cat.id === selectedCategory);
  }

  // 難易度に応じた色を取得
  function getDifficultyColor(difficulty) {
    switch (difficulty) {
      case "初級":
        return "success";
      case "中級":
        return "warning";
      case "上級":
        return "error";
      default:
        return "primary";
    }
  }
</script>

<svelte:head>
  <title>SwiftUIチュートリアル - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="SwiftUIを実際に書いて学ぶインタラクティブチュートリアル。Xcodeで動作確認しながら基礎から応用まで学習。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">school</i>
      </h1>
      <h2>SwiftUIチュートリアル</h2>
      <p class="large-text">
        実際にコードを書いて、Xcodeで動作確認しながら学ぼう！
      </p>
      <div class="space"></div>
      <div class="chip primary">
        <span>実践型学習</span>
      </div>
      <div class="chip secondary">
        <span>Xcodeで動作確認</span>
      </div>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- ローディング状態とエラー状態の処理 -->
{#if isLoading}
  <section>
    <div class="center-align">
      <div class="progress circle"></div>
      <p>チュートリアルデータを読み込み中...</p>
    </div>
  </section>
{:else if hasError}
  <section>
    <article class="card round border error-container">
      <div class="padding center-align">
        <i class="large error-text">error</i>
        <h4>データの読み込みに失敗しました</h4>
        <p>チュートリアルデータの読み込み中にエラーが発生しました。</p>
        <button class="button primary" onclick={() => loadTutorialData()}>
          <i>refresh</i>
          <span>再読み込み</span>
        </button>
      </div>
    </article>
  </section>
{:else if tutorialCategories.length === 0}
  <section>
    <div class="center-align">
      <i class="large secondary-text">school</i>
      <p>チュートリアルデータがありません。</p>
    </div>
  </section>
{:else}
  <!-- カテゴリ選択タブ -->
  <section>
    <div class="tabs center-align scroll">
      {#each tutorialCategories as category}
        <a
          type="button"
          class={`tab-button ${selectedCategory === category.id ? "active" : ""}`}
          onclick={() => selectCategory(category.id)}
        >
          <i>{category.icon}</i>
          <span>{category.title}</span>
        </a>
      {/each}
    </div>
  </section>

  <div class="space"></div>

  <!-- レッスン一覧表示 -->
  {#if getSelectedCategory()}
    <section>
      <div class="center-align">
        <h3>
          <i class="large primary-text">{getSelectedCategory().icon}</i>
          {getSelectedCategory().title}
        </h3>
        <p class="large-text">{getSelectedCategory().description}</p>
      </div>
    </section>

    <div class="space"></div>

    <section>
      <div class="grid">
        {#each getSelectedCategory().lessons as lesson}
          <div class="s12 m6 l4">
            <a
              href="{base}/tutorial/{lesson.id}"
              class="lesson-card-button"
            >
              <div class="card round lesson-card-content">
                <div class="padding">
                  <div class="space"></div>
                  <h5>{lesson.title}</h5>
                  <p>{lesson.description}</p>
                  <div class="space"></div>
                  <div class="row">
                    <div
                      class="chip {getDifficultyColor(
                        lesson.difficulty
                      )} small"
                    >
                      <span>{lesson.difficulty}</span>
                    </div>
                    <div class="max"></div>
                    <div class="chip secondary small">
                      <span><i>schedule</i> {lesson.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        {/each}
      </div>
    </section>
  {/if}
{/if}

<div class="space"></div>

<!-- ナビゲーション -->
<section>
  <div class="row">
    <div class="max">
      <a href="{base}/" class="button transparent primary-text">
        <i>arrow_back</i>
        <span>ホームに戻る</span>
      </a>
    </div>
    <div class="min">
      <a href="{base}/tutorial" class="button primary">
        <span>次のチュートリアルに進む</span>
        <i>arrow_forward</i>
      </a>
    </div>
  </div>
</section>

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

  .lesson-card-button {
    background: none;
    border: none;
    padding: 0;
    width: 100%;
    text-align: left;
    cursor: pointer;
    display: block;
    height: 100%;
  }

  .lesson-card-content {
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    height: 100%;
  }

  .lesson-card-button:hover .lesson-card-content {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  .code-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--on-surface-variant);
    margin-bottom: 1rem;
  }

  .tabs {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .tabs a {
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    min-width: max-content;
  }

  .tabs a:hover {
    background-color: rgba(var(--primary-rgb), 0.1);
  }

  .tabs a.active {
    background-color: var(--primary);
    color: var(--on-primary);
  }

  .preview-section {
    padding-left: 1rem;
    border-left: 1px solid var(--outline);
  }

  .preview-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: var(--on-surface-variant);
    font-weight: 500;
  }

  .iphone-preview {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .iphone-image {
    max-width: 100%;
    width: 250px;
    height: auto;
    aspect-ratio: 9/19.5; /* iPhone 14 Pro の比率 */
    border-radius: 1.5rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    border: 2px solid var(--outline);
    object-fit: cover;
  }

  @media (max-width: 768px) {
    .preview-section {
      padding-left: 0;
      border-left: none;
      border-top: 1px solid var(--outline);
      padding-top: 1rem;
      margin-top: 1rem;
    }

    .iphone-image {
      width: 200px;
    }
  }

  .image-preview {
    text-align: center;
    margin-bottom: 1rem;
  }

  .responsive-image {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid var(--outline);
  }

  .image-caption {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: var(--on-surface-variant);
  }
</style>
