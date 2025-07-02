<script>
  import { base } from "$app/paths";

  // デバッグ用：ベースパスをコンソールに出力
  console.log("Base path:", base);
  console.log("Current location:", typeof window !== 'undefined' ? window.location.href : 'SSR');

  // メインナビゲーションのカードデータ（メインの学習コース）
  const mainCourseCards = [
    {
      id: 1,
      title: "環境構築",
      description: "Swift開発に必要な環境を段階的に構築",
      icon: "build",
      href: `${base}/setup`,
      color: "primary",
      features: [
        "Xcodeのインストール",
        "開発者アカウント設定",
        "プロジェクト作成手順",
        "トラブルシューティング",
      ],
    },
    {
      id: 2,
      title: "チュートリアル",
      description: "Swiftの基本的な文法を実践的に学習",
      icon: "school",
      href: `${base}/tutorial`,
      color: "secondary",
      features: [
        "変数・定数の宣言",
        "データ型と型推論",
        "制御構造",
        "関数・クラス",
      ],
    },
    {
      id: 3,
      title: "実践プロジェクト",
      description: "実際にアプリを作って学習",
      icon: "rocket_launch",
      href: `${base}/projects`,
      color: "tertiary",
      features: [
        "タイマーアプリ作成",
        "段階的な開発手順",
        "SwiftUI活用",
        "実用的なアプリ",
      ],
    },
  ];

  // オプション学習コンテンツ
  const optionalCards = [
    {
      id: 4,
      title: "練習問題",
      description: "コーディング練習で理解を深める",
      icon: "quiz",
      href: `${base}/practice`,
      color: "warning",
      features: [
        "基本構文の練習",
        "段階的な難易度",
        "実践的な問題",
        "解説付き",
      ],
    },
    {
      id: 5,
      title: "チートシート",
      description: "Swiftの構文を素早く確認",
      icon: "description",
      href: `${base}/cheatsheet`,
      color: "info",
      features: ["構文の早見表", "コード例付き", "分野別整理", "リファレンス"],
    },
  ];

  // 学習の進め方
  const learningSteps = [
    {
      step: 1,
      title: "環境構築",
      description: "まずは開発環境を整えましょう",
      icon: "build",
      color: "primary",
    },
    {
      step: 2,
      title: "チュートリアル",
      description: "Swiftの基本的な文法を学習",
      icon: "school",
      color: "secondary",
    },
    {
      step: 3,
      title: "実践プロジェクト",
      description: "実際のアプリを作成してみる",
      icon: "rocket_launch",
      color: "tertiary",
    },
  ];
</script>

<svelte:head>
  <title>Stapro Swift Curriculum</title>
  <meta name="description" content="Stapro Swift Curriculum" />
</svelte:head>

<!-- ヒーローセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="">
        <i class="extra primary-text">code</i>
        Swift学習カリキュラム
      </h1>
      <p class="hero-description">
        基本構文から実践的なアプリ開発まで、<br/>
		段階的に学習できるカリキュラムです。<br/>
        プログラミング未経験でも安心して始められます。
      </p>
      <div class="space"></div>
      <div class="hero-buttons">
        <a href="{base}/setup" class="button large primary">
          <i>play_arrow</i>
          <span>学習を始める</span>
        </a>
        <a href="{base}/tutorial" class="button large transparent primary-text">
          <i>school</i>
          <span>チュートリアル</span>
        </a>
      </div>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- メイン学習コース -->
<section>
  <div class="grid">
    <div class="s12 center-align">
      <h2>メイン学習コース</h2>
      <p class="large-text">
        以下の順序で進めることで、基礎から実践まで体系的に学習できます
      </p>
      <div class="space"></div>
    </div>

    {#each mainCourseCards as card}
      <div class="s12 m6 l4">
        <article class="main-course-card">
          <div class="card-header center-align">
            <i class="large {card.color}-text">{card.icon}</i>
            <h5>{card.title}</h5>
            <p class="medium-text">{card.description}</p>
          </div>

          <div class="space"></div>

          <div class="card-features">
            <ul class="list border">
              {#each card.features as feature}
                <li>{feature}</li>
              {/each}
            </ul>
          </div>

          <div class="space"></div>

          <a href={card.href} class="button {card.color} fill">
            <i>arrow_forward</i>
            <span>開始する</span>
          </a>
        </article>
      </div>
    {/each}
  </div>
</section>

<div class="space"></div>

<!-- オプション学習コンテンツ -->
<section>
  <div class="grid">
    <div class="s12 center-align">
      <h2>オプション学習コンテンツ</h2>
      <p class="large-text">必要に応じて活用できる追加コンテンツです</p>
      <div class="space"></div>
    </div>

    {#each optionalCards as card}
      <div class="s12 m6">
        <article class="optional-card">
          <div class="card-header center-align">
            <i class="large {card.color}-text">{card.icon}</i>
            <h5>{card.title}</h5>
            <p class="medium-text">{card.description}</p>
          </div>

          <div class="space"></div>

          <div class="card-features">
            <ul class="list border">
              {#each card.features as feature}
                <li>{feature}</li>
              {/each}
            </ul>
          </div>

          <div class="space"></div>

          <a href={card.href} class="button {card.color} outline">
            <i>arrow_forward</i>
            <span>確認する</span>
          </a>
        </article>
      </div>
    {/each}
  </div>
</section>


<div class="space"></div>

<!-- 特徴 -->
<section>
  <div class="grid">
    <div class="s12 center-align">
      <h2>このカリキュラムの特徴</h2>
      <div class="space"></div>
    </div>

    <div class="s12 m4">
      <article class="card round feature-card">
        <div class="padding center-align">
          <i class="large primary-text">school</i>
          <h5>段階的学習</h5>
          <p>基礎から応用まで、無理のないペースで学習を進められます。</p>
        </div>
      </article>
    </div>

    <div class="s12 m4">
      <article class="card round feature-card">
        <div class="padding center-align">
          <i class="large secondary-text">build</i>
          <h5>実践重視</h5>
          <p>
            実際にアプリを作りながら学ぶので、実用的なスキルが身につきます。
          </p>
        </div>
      </article>
    </div>
  </div>
</section>

<style>
  .hero-section {
    padding: 4rem 0;
    background: linear-gradient(
      135deg,
      var(--primary-container) 0%,
      var(--secondary-container) 50%,
      var(--tertiary-container) 100%
    );
    border-radius: 1rem;
    margin-bottom: 3rem;
  }

  .hero-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: bold;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .hero-subtitle {
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    font-weight: 500;
    margin-bottom: 1rem;
    color: var(--primary);
  }

  .hero-description {
    font-size: clamp(1rem, 2vw, 1.2rem);
    line-height: 1.6;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .card-features li:before {
    content: "✓";
    color: var(--primary);
    font-weight: bold;
    margin-right: 0.5rem;
  }

  .learning-flow {
    background: linear-gradient(
      135deg,
      var(--primary) 0%,
      var(--secondary) 100%
    );
    border-radius: 1rem;
    padding: 3rem 0;
  }

  .step-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    backdrop-filter: blur(10px);
  }

  .step-number {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    flex-shrink: 0;
  }

  .step-content {
    flex: 1;
  }

  .feature-card {
    transition: transform 0.2s ease;
    height: 100%;
  }

  .main-course-card {
    border: 2px solid var(--primary);
    border-radius: 0.5rem;
  }

  .optional-card {
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    height: 100%;
    border: 1px dashed var(--outline);
    border-radius: 0.5rem;
    padding: 1rem;
    opacity: 0.8;
  }
</style>
