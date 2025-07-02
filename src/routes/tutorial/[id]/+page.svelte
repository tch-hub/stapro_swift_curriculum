<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";

  // ページロード時に渡されるチュートリアルID
  const { data } = $props();
  const tutorialId = data.tutorialId;

  // チュートリアルデータを格納する変数
  let tutorialData = $state(null);
  let loading = $state(true);
  let error = $state(null);

  // JSONファイルからチュートリアルデータを読み込む
  async function loadTutorialData() {
    try {
      const response = await fetch(`${base}/tutorial-data.json`);
      if (!response.ok) {
        throw new Error("チュートリアルデータの読み込みに失敗しました");
      }
      const data = await response.json();

      // 指定されたIDのチュートリアルを検索
      const tutorial = data.tutorials.find((t) => t.id === tutorialId);
      if (!tutorial) {
        throw new Error("指定されたチュートリアルが見つかりませんでした");
      }

      tutorialData = tutorial;
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  }

  // コンポーネントマウント時にデータを読み込み
  onMount(() => {
    loadTutorialData();
  });
</script>

<svelte:head>
  <title>{tutorialData ? tutorialData.title : "チュートリアル"} - Swift学習カリキュラム</title>
  <meta
    name="description"
    content={tutorialData ? tutorialData.description : "Swift学習のためのチュートリアル"}
  />
</svelte:head>

{#if loading}
  <!-- ローディング状態 -->
  <section>
    <div class="grid">
      <div class="s12 center-align">
        <div class="loader"></div>
        <p>チュートリアルを読み込み中...</p>
      </div>
    </div>
  </section>
{:else if error}
  <!-- エラー状態 -->
  <section>
    <div class="grid">
      <div class="s12">
        <div class="card error-container">
          <div class="padding">
            <h6><i>error</i> エラーが発生しました</h6>
            <p>{error}</p>
            <div class="row">
              <button class="button primary" onclick={() => loadTutorialData()}>
                <i>refresh</i>
                <span>再読み込み</span>
              </button>
              <a href="{base}/tutorial" class="button transparent">
                <i>arrow_back</i>
                <span>チュートリアル一覧に戻る</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
{:else if tutorialData}
  <!-- チュートリアル内容 -->
  <section>
    <div class="grid">
      <div class="s12">
        <h1>{tutorialData.title}</h1>
        <p>{tutorialData.description}</p>
        <div class="space"></div>
        
        <!-- チュートリアルの内容をここに表示 -->
        {#if tutorialData.content}
          <div class="tutorial-content">
            {tutorialData.content}
          </div>
        {/if}
      </div>
    </div>
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
  .loader {
    width: 3rem;
    height: 3rem;
    border: 4px solid var(--outline);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .error-container {
    background: var(--error-container);
    color: var(--on-error-container);
  }

  .tutorial-content {
    background: var(--surface-variant);
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin: 1rem 0;
  }
</style>
