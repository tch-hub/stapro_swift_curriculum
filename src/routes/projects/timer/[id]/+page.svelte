<script>
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import CodeBlock from "$lib/CodeBlock.svelte";

  // ページパラメータからIDを取得
  $: stepId = parseInt($page.params.id);

  // ステップデータ
  let stepData = null;
  let loading = true;
  let error = null;

  // ステップデータを読み込む
  async function loadStepData(id) {
    try {
      loading = true;
      error = null;
      const response = await fetch(`${base}/timer/${id}.json`);
      if (!response.ok) {
        throw new Error("ステップが見つかりません");
      }
      stepData = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  // IDが変更されたらデータを再読み込み
  $: if (stepId) {
    loadStepData(stepId);
  }

  // コードブロック側でコピー機能を実装しているため、ここでは不要

  // 前のステップへ
  function goToPrevStep() {
    if (stepId > 1) {
      window.location.href = `${base}/projects/timer/${stepId - 1}`;
    }
  }

  // 次のステップへ
  function goToNextStep() {
    if (stepId < 8) {
      window.location.href = `${base}/projects/timer/${stepId + 1}`;
    }
  }
</script>

<svelte:head>
  <title>
    {stepData ? `ステップ${stepData.id}: ${stepData.title}` : "読み込み中..."} -
    タイマーアプリ作成
  </title>
  <meta
    name="description"
    content={stepData
      ? stepData.description
      : "SwiftUIタイマーアプリ開発ステップ"}
  />
</svelte:head>

{#if loading}
  <div class="center-align padding">
    <progress class="circle large"></progress>
    <p>読み込み中...</p>
  </div>
{:else if error}
  <div class="center-align padding">
    <i class="large error-text">error</i>
    <h4>エラー</h4>
    <p>{error}</p>
    <div class="space"></div>
    <a href="{base}/projects/timer" class="button primary">
      <i>arrow_back</i>
      <span>プロジェクト一覧に戻る</span>
    </a>
  </div>
{:else if stepData}
  <!-- ヘッダーセクション -->
  <section class="hero-section">
    <div class="grid">
      <div class="s12 center-align">
        <h1 class="primary-text">
          <i class="large">{stepData.icon}</i>
        </h1>
        <h2>ステップ {stepData.id}: {stepData.title}</h2>
        <p class="large-text">{stepData.description}</p>
        <div class="space"></div>
        <div class="chip primary">
          <span>所要時間: {stepData.duration}</span>
        </div>
      </div>
    </div>
  </section>

  <div class="space"></div>

  <!-- 概要セクション -->
  <section>
    <h3>
      <i>info</i>
      <span>このステップの概要</span>
    </h3>
    <p class="medium-text">{stepData.content.overview}</p>
  </section>

  <div class="space"></div>

  <!-- タスク一覧 -->
  <section>
    <h4>
      <i>task_alt</i>
      <span>やること</span>
    </h4>
    <div class="space"></div>
    <div class="grid">
      {#each stepData.content.tasks as task, index}
        <div class="s12 m6">
          <div class="row">
            <div class="min">
              <div class="chip small primary">
                <span>{index + 1}</span>
              </div>
            </div>
            <div class="max">
              <p>{task}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <div class="space"></div>

  <!-- コードセクション -->
  <section>
    <h4>
      <i>code</i>
      <span>実装コード</span>
    </h4>
    <div class="space"></div>
    <div class="round border">
      <div class="padding">
        <div class="row">
          <div class="max">
            <p class="small-text">
              コードをコピーしてXcodeに貼り付けてください
            </p>
          </div>
        </div>
      </div>
      <CodeBlock code={stepData.content.code} language="swift" />
    </div>
  </section>

  <div class="space"></div>

  <!-- ヒントセクション -->
  <section class="tertiary-container round padding">
    <h4 class="">
      <i>lightbulb</i>
      <span>ポイント・ヒント</span>
    </h4>
    <div class="space"></div>
    <div class="grid">
      {#each stepData.content.tips as tip, index}
        <div class="s12 m6">
          <div class="row">
            <div class="min">
              <i class="small">tips_and_updates</i>
            </div>
            <div class="max">
              <p class="">{tip}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <div class="space"></div>

  <!-- ナビゲーション -->
  <section>
    <div class="center-align">
      <div class="row">
        <div class="min">
          {#if stepId > 1}
            <button
              class="button transparent primary-text"
              onclick={goToPrevStep}
            >
              <i>arrow_back</i>
              <span>前のステップ</span>
            </button>
          {:else}
            <a
              href="{base}/projects/timer"
              class="button transparent primary-text"
            >
              <i>arrow_back</i>
              <span>プロジェクト一覧</span>
            </a>
          {/if}
        </div>

        <div class="max center-align">
          <span class="chip small outline">
            ステップ {stepId} / 8
          </span>
        </div>

        <div class="min">
          {#if stepId < 8}
            <button class="button primary" onclick={goToNextStep}>
              <span>次のステップ</span>
              <i>arrow_forward</i>
            </button>
          {:else}
            <a href="{base}/projects/timer" class="button success">
              <span>完了</span>
              <i>check_circle</i>
            </a>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <div class="space"></div>

  <!-- 追加リンク -->
  <section>
    <div class="center-align">
      <a href="{base}/cheatsheet" class="button secondary">
        <i>quick_reference</i>
        <span>Swiftチートシート</span>
      </a>
      <span class="space"></span>
      <a href="{base}/projects" class="button transparent primary-text">
        <i>home</i>
        <span>全プロジェクト一覧</span>
      </a>
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

  .medium-text {
    font-size: 1.1rem;
    line-height: 1.5;
  }
</style>
