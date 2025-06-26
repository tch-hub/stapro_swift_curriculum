<script>
  import { base } from "$app/paths"; // プロジェクトデータ
  const projects = [
    {
      id: 1,
      title: "タイマーアプリ",
      description: "SwiftUIで本格的なタイマーアプリを作ろう",
      icon: "timer",
      duration: "3-4時間",
      skills: ["SwiftUI", "MVVM", "Timer", "AVFoundation"],
      features: [
        "時間設定用Picker",
        "円形プログレスバー",
        "一時停止・再開機能",
        "音声アラーム",
      ],
      href: `${base}/projects/timer`,
    },
    {
      id: 3,
      title: "TODOリスト",
      description: "やることリストを管理できるアプリ",
      icon: "checklist",
      duration: "3-4時間",
      skills: ["配列操作", "データ保存", "リスト表示"],
      features: [
        "タスクの追加・削除",
        "完了チェック機能",
        "データの永続化",
        "カテゴリ分け",
      ],
      href: `${base}/projects/todo`,
    },
  ];

  // フィルタリングされたプロジェクト（現在はすべてのプロジェクトを表示）
  let filteredProjects = projects;
</script>

<svelte:head>
  <title>実践プロジェクト - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="実際にiOSアプリを作りながらSwiftを学ぶプロジェクトベース学習。電卓、ゲーム、TODOアプリなど。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">rocket_launch</i>
      </h1>
      <h2>実践プロジェクト</h2>
      <p class="large-text">実際にアプリを作りながらSwiftをマスターしよう！</p>
      <div class="space"></div>
      <div class="chip primary">
        <span>プロジェクトベース学習</span>
      </div>
      <div class="chip secondary">
        <span>全{projects.length}プロジェクト</span>
      </div>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- プロジェクト一覧 -->
<section>
  <div class="grid">
    {#each filteredProjects as project}
      <div class="s12 l6">
        <article class="card round margin">
          <div class="padding">
            <div class="row">
              <div class="max">
                <h5>{project.title}</h5>
                <p class="medium-text">{project.description}</p>
              </div>
            </div>

            <div class="space"></div>

            <div class="row">
              <div class="chip small outline">
                <i class="small">schedule</i>
                <span>{project.duration}</span>
              </div>
            </div>

            <div class="space"></div>

            <h6>実装する機能:</h6>
            <ul class="small-text">
              {#each project.features as feature}
                <li>{feature}</li>
              {/each}
            </ul>

            <div class="space"></div>

            <a href={project.href} class="button primary block">
              <i>play_arrow</i>
              <span>プロジェクトを始める</span>
            </a>
          </div>
        </article>
      </div>
    {/each}
  </div>
</section>

<div class="space"></div>

<!-- ナビゲーション -->
<section>
  <div class="center-align">
    <a href="{base}/" class="button transparent primary-text">
      <i>arrow_back</i>
      <span>ホームに戻る</span>
    </a>
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

  .card .button {
    margin-top: auto;
  }

  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
</style>
