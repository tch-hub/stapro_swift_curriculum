<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";

  // プロジェクト設定データ
  let projectConfig = null;
  let steps = [];
  let loading = true;
  let error = null;

  // 設定データを読み込む
  async function loadProjectConfig() {
    try {
      loading = true;
      error = null;
      const response = await fetch(`${base}/timer/config.json`);
      if (!response.ok) {
        throw new Error("設定データが見つかりません");
      }
      projectConfig = await response.json();
      steps = projectConfig.steps || [];
    } catch (err) {
      error = err.message;
      console.error("設定データの読み込みエラー:", err);
    } finally {
      loading = false;
    }
  }

  // コンポーネントマウント時にデータを読み込み
  onMount(() => {
    loadProjectConfig();
  });
</script>

<svelte:head>
  <title>
    {projectConfig ? projectConfig.project.name : "タイマーアプリ作成"} - Swift学習カリキュラム
  </title>
  <meta
    name="description"
    content={projectConfig
      ? projectConfig.project.description
      : "SwiftUIを使ってタイマーアプリを作成するプロジェクトベース学習。実際に動くアプリを段階的に開発。"}
  />
</svelte:head>

{#if loading}
  <div class="center-align padding">
    <progress class="circle large"></progress>
    <p>プロジェクト設定を読み込み中...</p>
  </div>
{:else if error}
  <div class="center-align padding">
    <i class="large error-text">error</i>
    <h4>エラー</h4>
    <p>{error}</p>
    <div class="space"></div>
    <a href="{base}/projects" class="button primary">
      <i>arrow_back</i>
      <span>プロジェクト一覧に戻る</span>
    </a>
  </div>
{:else if projectConfig}
  <!-- ヘッダーセクション -->
  <section class="hero-section">
    <div class="grid">
      <div class="s12 center-align">
        <h1 class="primary-text">
          <i class="large">timer</i>
        </h1>
        <h2>{projectConfig.project.name}</h2>
        <p class="large-text">
          {projectConfig.project.description}
        </p>
        <div class="space"></div>
        <div class="chip primary">
          <span>{projectConfig.project.difficulty}</span>
        </div>
        <div class="chip secondary">
          <span>所要時間: {projectConfig.project.estimatedTotalTime}</span>
        </div>
        <div class="chip tertiary">
          <span>全{projectConfig.project.totalSteps}ステップ</span>
        </div>
      </div>
    </div>
  </section>

  <div class="space"></div>

  <!-- プロジェクト概要 -->
  <section>
    <div class="center-align">
      <h3>このプロジェクトで学べること</h3>
      <p class="medium-text">
        実際のアプリ開発で必要な技術を実践的に習得できます
      </p>
    </div>

    <div class="space"></div>

    <div class="grid">
      <div class="s12 m6 l3">
        <article class="round border padding">
          <div class="center-align">
            <i class="large primary-text">architecture</i>
            <h6>MVVMパターン</h6>
            <p class="small-text">ViewとViewModelを分離した設計パターン</p>
          </div>
        </article>
      </div>

      <div class="s12 m6 l3">
        <article class="round border padding">
          <div class="center-align">
            <i class="large secondary-text">widgets</i>
            <h6>SwiftUI基礎</h6>
            <p class="small-text">
              @State、@Binding、@ObservableObjectの使い方
            </p>
          </div>
        </article>
      </div>

      <div class="s12 m6 l3">
        <article class="round border padding">
          <div class="center-align">
            <i class="large tertiary-text">palette</i>
            <h6>カスタムUI</h6>
            <p class="small-text">円形プログレスバーやカスタムボタンの作成</p>
          </div>
        </article>
      </div>

      <div class="s12 m6 l3">
        <article class="round border padding">
          <div class="center-align">
            <i class="large inverse-text">volume_up</i>
            <h6>音声処理</h6>
            <p class="small-text">AVFoundationを使った音声再生</p>
          </div>
        </article>
      </div>

      <!-- 使用技術を動的に表示 -->
      {#each projectConfig.project.technologies as tech, index}
        {#if index >= 4}
          <div class="s12 m6 l3">
            <article class="round border padding">
              <div class="center-align">
                <i class="large outline-text">code</i>
                <h6>{tech}</h6>
                <p class="small-text">プロジェクトで使用する技術</p>
              </div>
            </article>
          </div>
        {/if}
      {/each}
    </div>
  </section>

  <div class="space"></div>

  <!-- ステップ一覧 -->
  <section>
    <div class="center-align">
      <h3>開発ステップ</h3>
      <p class="medium-text">
        順番に進めて完全なタイマーアプリを作成しましょう
      </p>
    </div>

    <div class="space"></div>

    <div class="grid">
      {#each steps as step}
        <div class="s12 m6 l4">
          <article class="card round">
            <div class="padding">
              <div class="row">
                <div class="min">
                  <i class="large primary-text">{step.icon}</i>
                </div>
                <div class="max">
                  <h6>ステップ {step.id}: {step.title}</h6>
                  <p class="small-text">{step.description}</p>
                </div>
              </div>

              <div class="space"></div>

              <div class="row">
                <div class="chip small outline">
                  <i class="small">schedule</i>
                  <span>{step.duration}</span>
                </div>
                <div
                  class="chip small {step.difficulty === '初級'
                    ? 'primary'
                    : step.difficulty === '中級'
                      ? 'secondary'
                      : 'tertiary'}"
                >
                  <span>{step.difficulty}</span>
                </div>
              </div>

              <div class="space"></div>

              <!-- 学習概念の表示 -->
              <div class="row wrap">
                {#each step.concepts as concept}
                  <span class="chip tiny outline margin-right margin-bottom"
                    >{concept}</span
                  >
                {/each}
              </div>

              <div class="space"></div>

              <a
                href="{base}/projects/timer/{step.id}"
                class="button primary block"
              >
                <i>play_arrow</i>
                <span>ステップを始める</span>
              </a>
            </div>
          </article>
        </div>
      {/each}
    </div>
  </section>

  <div class="space"></div>

  <!-- 完成イメージ -->
  <section class="primary-container round padding">
    <div class="center-align">
      <h4 class="">完成したアプリの機能</h4>
      <div class="space"></div>
    </div>

    <div class="grid">
      <div class="s12 m6">
        <div class="row">
          <div class="min">
            <i class="medium">schedule</i>
          </div>
          <div class="max">
            <h6 class="">時間設定</h6>
            <p class="">時、分、秒を自由に設定できるインタラクティブなPicker</p>
          </div>
        </div>
      </div>

      <div class="s12 m6">
        <div class="row">
          <div class="min">
            <i class="medium">donut_large</i>
          </div>
          <div class="max">
            <h6 class="">視覚的進行表示</h6>
            <p class="">円形プログレスバーで残り時間を分かりやすく表示</p>
          </div>
        </div>
      </div>

      <div class="s12 m6">
        <div class="row">
          <div class="min">
            <i class="medium">play_pause</i>
          </div>
          <div class="max">
            <h6 class="">柔軟な操作</h6>
            <p class="">開始、一時停止、再開、キャンセルの完全な制御</p>
          </div>
        </div>
      </div>

      <div class="s12 m6">
        <div class="row">
          <div class="min">
            <i class="medium">notifications</i>
          </div>
          <div class="max">
            <h6 class="">音声アラーム</h6>
            <p class="">時間終了時の音声通知とアラート表示</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="space"></div>

  <!-- 必要な準備 -->
  <section class="secondary-container round padding">
    <div class="center-align">
      <h4 class="">開発前の準備</h4>
      <div class="space"></div>
    </div>

    <div class="grid">
      <div class="s12 m6">
        <div class="row">
          <div class="min">
            <i class="medium">laptop_mac</i>
          </div>
          <div class="max">
            <h6 class="">Xcode 15以上</h6>
            <p class="">
              最新のSwiftUIを使用するため、Xcode
              15以上をインストールしてください。
            </p>
          </div>
        </div>
      </div>

      <div class="s12 m6">
        <div class="row">
          <div class="min">
            <i class="medium">music_note</i>
          </div>
          <div class="max">
            <h6 class="">音声ファイル</h6>
            <p class="">
              アラーム用の音声ファイル（.mp3または.wav）を用意してください。
            </p>
          </div>
        </div>
      </div>

      <!-- 前提条件を動的に表示 -->
      {#each projectConfig.prerequisites as prerequisite, index}
        <div class="s12 m6">
          <div class="row">
            <div class="min">
              <i class="medium">check_circle</i>
            </div>
            <div class="max">
              <h6 class="">前提知識 {index + 1}</h6>
              <p class="">{prerequisite}</p>
            </div>
          </div>
        </div>
      {/each}

      <div class="s12 m6">
        <div class="row">
          <div class="min">
            <i class="medium">quick_reference</i>
          </div>
          <div class="max">
            <h6 class="">Swiftチートシート</h6>
            <p class="">
              分からない構文があったらチートシートを参照しましょう。
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="space"></div>

  <!-- 学習目標 -->
  <section class="tertiary-container round padding">
    <div class="center-align">
      <h4 class="">このプロジェクトの学習目標</h4>
      <div class="space"></div>
    </div>

    <div class="grid">
      {#each projectConfig.learningObjectives as objective, index}
        <div class="s12 m6">
          <div class="row">
            <div class="min">
              <div class="chip small primary">
                <span>{index + 1}</span>
              </div>
            </div>
            <div class="max">
              <p class="">{objective}</p>
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
      <a href="{base}/projects" class="button transparent primary-text">
        <i>arrow_back</i>
        <span>プロジェクト一覧</span>
      </a>
      <span class="space"></span>
      <a href="{base}/cheatsheet" class="button secondary">
        <i>quick_reference</i>
        <span>チートシート</span>
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

  .small-text {
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .card {
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .card .padding {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .margin-right {
    margin-right: 0.5rem;
  }

  .margin-bottom {
    margin-bottom: 0.5rem;
  }

  .chip.tiny {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }
</style>
