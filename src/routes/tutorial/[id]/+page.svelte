<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import CodeBlock from "$lib/CodeBlock.svelte";

  // ページロード時に渡されるチュートリアルID
  const { data } = $props();
  const lessonId = data.tutorialId; // `tutorialId` として渡されるが、実質的には `lessonId`

  // レッスンデータを格納する変数
  let lessonData = $state(null);
  let loading = $state(true);
  let error = $state(null);

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

  // JSONファイルからレッスンデータを読み込む
  async function loadLessonData() {
    try {
      loading = true;
      error = null;
      const response = await fetch(`${base}/tutorial-data.json`);
      if (!response.ok) {
        throw new Error("チュートリアルデータの読み込みに失敗しました");
      }
      const data = await response.json();

      // 全てのレッスンから指定されたIDのレッスンを検索
      let foundLesson = null;
      for (const category of data.tutorialCategories) {
        const lesson = category.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          foundLesson = lesson;
          break;
        }
      }

      if (!foundLesson) {
        throw new Error("指定されたレッスンが見つかりませんでした");
      }

      lessonData = foundLesson;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  // コンポーネントマウント時にデータを読み込み
  onMount(() => {
    loadLessonData();
  });
</script>

<svelte:head>
  <title>{lessonData ? lessonData.title : "チュートリアル"} - Swift学習カリキュラム</title>
  <meta
    name="description"
    content={lessonData ? lessonData.description : "Swift学習のためのチュートリアル"}
  />
</svelte:head>

{#if loading}
  <!-- ローディング状態 -->
  <section class="center-align">
    <div class="progress circle large"></div>
    <p>レッスンを読み込み中...</p>
  </section>
{:else if error}
  <!-- エラー状態 -->
  <section>
    <article class="card round border error-container">
      <div class="padding center-align">
        <i class="large error-text">error</i>
        <h4>エラーが発生しました</h4>
        <p>{error}</p>
        <div class="row">
          <button class="button primary" onclick={loadLessonData}>
            <i>refresh</i>
            <span>再読み込み</span>
          </button>
          <a href="{base}/tutorial" class="button transparent">
            <i>arrow_back</i>
            <span>チュートリアル一覧に戻る</span>
          </a>
        </div>
      </div>
    </article>
  </section>
{:else if lessonData}
  <!-- レッスン詳細表示 -->
  <section>
    <div class="row">
      <a href="{base}/tutorial" class="button transparent primary-text">
        <i>arrow_back</i>
        <span>チュートリアル一覧に戻る</span>
      </a>
    </div>
  </section>

  <div class="space"></div>

  <section>
    <article class="card round border">
      <div class="padding">
        <div class="grid">
          <div class="s12 m8">
            <h3>{lessonData.title}</h3>
            <p class="large-text">{lessonData.description}</p>
          </div>
          <div class="s12 m4 right-align">
            <div class="chip {getDifficultyColor(lessonData.difficulty)}">
              <span>{lessonData.difficulty}</span>
            </div>
            <div class="chip secondary">
              <span><i>schedule</i> {lessonData.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  </section>

  <div class="space"></div>

  <!-- 手順説明 -->
  <section>
    <h4>📋 実装手順</h4>
    <article class="card round border secondary-container">
      <div class="padding">
        <ol class="large-text">
          {#each lessonData.steps as step}
            <li>{step}</li>
          {/each}
        </ol>
      </div>
    </article>
  </section>

  <div class="space"></div>

  <!-- コード表示とプレビュー -->
  <section>
    <h4>💻 サンプルコード</h4>
    <article class="card round border">
      <div class="padding">
        <div class="grid">
          <div class="s12 l8">
            <div class="code-header">
              <i class="small">code</i>
              <span>ContentView.swift</span>
            </div>
            <div class="space"></div>
            <CodeBlock code={lessonData.code} language="swift" />
          </div>
          <div class="s12 l4">
            <div class="preview-section">
              <h6 class="preview-title">
                <i class="small">smartphone</i>
                <span>プレビュー</span>
              </h6>
              <div class="iphone-preview">
                <img
                  src={lessonData.previewImage ||
                    `https://placehold.jp/250x500/3f51b5/ffffff?text=${encodeURIComponent(lessonData.title)}`}
                  alt="{lessonData.title}の完成イメージ"
                  class="iphone-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  </section>

  <div class="space"></div>

  <!-- 解説 -->
  {#if lessonData.explanation}
  <section>
    <h4>📚 解説</h4>
    <article class="card round border tertiary-container">
      <div class="padding">
        <p class="large-text">{lessonData.explanation}</p>
      </div>
    </article>
  </section>
  {/if}

  <div class="space"></div>

  <!-- Xcodeでの確認方法 -->
  <section>
    <h4>🔍 Xcodeで確認してみよう</h4>
    <article class="card round border">
      <div class="padding">
        <div class="grid">
          <div class="s12 m6">
            <h6><i class="primary-text">laptop_mac</i> 動作確認手順</h6>
            <ol>
              <li>Xcodeで新しいプロジェクトを作成</li>
              <li>ContentView.swiftを開く</li>
              <li>上記のコードをコピー&ペースト</li>
              <li>Canvas（プレビュー）で確認</li>
              <li>シミュレーターで実際に動作させる</li>
            </ol>
          </div>
          <div class="s12 m6">
            <h6><i class="secondary-text">tips_and_updates</i> ポイント</h6>
            <ul>
              <li>プレビューが表示されない場合は、Canvasボタンを押す</li>
              <li>エラーが出た場合は、コードを再度確認</li>
              <li>シミュレーターでタップして動作を確認</li>
              <li>コードを少し変更して実験してみよう</li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  </section>
{/if}

<div class="space"></div>

<!-- 戻るリンク -->
<section>
  <div class="center-align">
    <a href="{base}/tutorial" class="button transparent primary-text">
      <i>arrow_back</i>
      <span>チュートリアル一覧に戻る</span>
    </a>
  </div>
</section>

<style>
  .large-text {
    font-size: 1.2rem;
    line-height: 1.6;
  }
  .code-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--on-surface-variant);
    margin-bottom: 1rem;
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
    aspect-ratio: 9 / 19.5;
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
</style>
