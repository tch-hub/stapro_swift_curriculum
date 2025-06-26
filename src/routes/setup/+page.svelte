<script>
  import { base } from "$app/paths";

  // 環境構築ステップのデータ
  const setupSteps = [
    {
      id: 1,
      title: "Xcodeのインストール",
      description: "App StoreからXcodeをダウンロードしてインストール",
      icon: "download",
      difficulty: "必須",
      estimatedTime: "30-60分",
      details: [
        "App Storeを開き、'Xcode'で検索",
        "最新版のXcodeをインストール（約5GB）",
        "インストール完了後、Xcodeを起動して利用規約に同意",
        "Command Line Toolsも自動的にインストールされる",
      ],
      tips: [
        "安定したインターネット接続が必要",
        "十分なディスク容量（最低15GB）を確保",
        "最新のmacOSバージョンを推奨",
      ],
    },
    {
      id: 2,
      title: "Swiftプレイグラウンドの準備",
      description: "Swift学習用の環境を準備する",
      icon: "science",
      difficulty: "推奨",
      estimatedTime: "5-10分",
      details: [
        "Xcodeを起動し、Create New Priject... を選択",
        "iOS > App を選択",
        "以下のプロジェクト設定を行い Next をクリック",
        "保存先を選択し、プロジェクトを作成",
      ],
      tips: [
        "プレイグラウンドは学習に最適",
        "複数のプレイグラウンドを作成して整理",
        "定期的にコードを保存する習慣をつける",
      ],
    },
  ];

  // プロジェクト設定項目
  const projectSettings = [
    {
      item: "Product Name",
      value: "<<名前>>Playground",
      description: "プロジェクトの名前を設定",
    },
    {
      item: "Team",
      value: "None",
      description: "開発チームを選択（個人開発の場合はNone）",
    },
    {
      item: "Organization Identifier",
      value: "com",
      description: "組織識別子（個人の場合はcomで十分）",
    },
    {
      item: "Interface",
      value: "SwiftUI",
      description: "UIフレームワークを選択",
    },
    {
      item: "Language",
      value: "Swift",
      description: "プログラミング言語を選択",
    },
    {
      item: "Testing System",
      value: "None",
      description: "テストシステム（学習用では不要）",
    },
    {
      item: "Storage",
      value: "SwiftData",
      description: "データ保存方式を選択",
    },
  ];

  // 必要な環境の詳細
  const requirements = [
    {
      category: "ハードウェア",
      items: [
        "Mac（macOS 13.0以降）",
        "最低8GB RAM（16GB推奨）",
        "50GB以上の空き容量",
        "安定したインターネット接続",
      ],
    },
    {
      category: "ソフトウェア",
      items: [
        "最新のmacOS",
        "Xcode 15.0以降",
        "Apple ID",
        "Webブラウザー（Safari/Chrome）",
      ],
    },
  ];

  // トラブルシューティング情報
  const troubleshooting = [
    {
      problem: "Xcodeのインストールが進まない",
      solutions: [
        "インターネット接続を確認",
        "ディスク容量を確保",
        "App Storeからサインアウト→サインイン",
        "Macを再起動して再試行",
      ],
    },
    {
      problem: "シミュレーターが動作しない",
      solutions: [
        "Xcodeを完全に再起動",
        "シミュレーターアプリを個別に起動",
        "デバイス設定をリセット",
        "最新版への更新を確認",
      ],
    },
    {
      problem: "シミュレーターが表示されない",
      solutions: [
        "Adjust Editor Options をクリック",
        "Canvas にチェックを入れる",
      ],
    },
    {
      problem: "証明書エラーが発生する",
      solutions: [
        "Apple IDの再ログイン",
        "証明書の自動管理を有効化",
        "キーチェーンの確認",
        "プロビジョニングプロファイルのリフレッシュ",
      ],
    },
    {
      problem: "Git Respository Creation Failed",
      solutions: ["Cancel をクリック"],
    },
  ];

  // リソース情報
  const resources = [
    {
      title: "Apple公式ドキュメント",
      description: "Swiftとアプリ開発の公式ガイド",
      url: "https://developer.apple.com/swift/",
      type: "公式",
    },
    {
      title: "Swift.org",
      description: "Swift言語の詳細情報とコミュニティ",
      url: "https://swift.org/",
      type: "公式",
    },
    {
      title: "Xcode Help",
      description: "Xcode内蔵のヘルプとチュートリアル",
      url: "xcode://help",
      type: "内蔵",
    },
    {
      title: "Swift Playgrounds",
      description: "iPadでも学習できるSwift学習アプリ",
      url: "https://apps.apple.com/app/swift-playgrounds/id908519492",
      type: "アプリ",
    },
  ];

  // 難易度に応じた色を取得
  function getDifficultyColor(difficulty) {
    switch (difficulty) {
      case "必須":
        return "error";
      case "推奨":
        return "primary";
      case "任意":
        return "secondary";
      default:
        return "primary";
    }
  }

  // 完了状態の管理
  let completedSteps = [];

  function toggleStep(stepId) {
    if (completedSteps.includes(stepId)) {
      completedSteps = completedSteps.filter((id) => id !== stepId);
    } else {
      completedSteps = [...completedSteps, stepId];
    }
  }
</script>

<svelte:head>
  <title>環境構築ガイド - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="Swift開発環境の構築手順を詳しく解説。Xcodeのインストールから開発者設定まで段階的にガイド。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">build</i>
      </h1>
      <h2>Swift開発環境構築ガイド</h2>
      <p class="large-text">
        Swift開発を始めるために必要な環境を段階的に構築していきましょう
      </p>
      <div class="space"></div>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- 必要な環境 -->
<section>
  <div class="grid">
    <div class="s12">
      <h3>必要な環境</h3>
      <p>まず、以下の環境が整っていることを確認してください。</p>
      <div class="space"></div>
    </div>

    {#each requirements as requirement}
      <div class="s12 m4">
        <article class="card round">
          <div class="padding">
            <h5>{requirement.category}</h5>
            <div class="space"></div>
            <ul>
              {#each requirement.items as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>
        </article>
      </div>
    {/each}
  </div>
</section>

<div class="space"></div>

<!-- セットアップ手順 -->
<section>
  <div class="grid">
    <div class="s12">
      <h3>セットアップ手順</h3>
      <p>以下の手順に従って、Swift開発環境を構築してください。</p>
      <div class="space"></div>
    </div>

    {#each setupSteps as step}
      <div class="s12">
        <article
          class="card round step-card {completedSteps.includes(step.id)
            ? 'success-container'
            : ''}"
        >
          <div class="padding">
            <!-- ヘッダー部分 -->
            <div class="row">
              <div class="min">
                <div
                  class="step-number {getDifficultyColor(
                    step.difficulty
                  )}-container"
                >
                  {step.id}
                </div>
              </div>
              <div class="max">
                <div class="row">
                  <div class="max">
                    <h5 class={completedSteps.includes(step.id) ? "" : ""}>
                      {step.title}
                    </h5>
                    <p
                      class="medium-text {completedSteps.includes(step.id)
                        ? ''
                        : ''}"
                    >
                      {step.description}
                    </p>
                  </div>
                  <div class="min">
                    <button
                      class="chip {completedSteps.includes(step.id)
                        ? 'white'
                        : getDifficultyColor(step.difficulty)}"
                      onclick={() => toggleStep(step.id)}
                    >
                      {#if completedSteps.includes(step.id)}
                        <i>check</i>
                        <span>完了</span>
                      {:else}
                        <i>schedule</i>
                        <span>{step.estimatedTime}</span>
                      {/if}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="space"></div>
            <!-- 詳細手順 -->
            <div class="grid">
              <div class="s12 m8">
                <h6 class={completedSteps.includes(step.id) ? "" : ""}>手順</h6>
                <ol class={completedSteps.includes(step.id) ? "" : ""}>
                  {#each step.details as detail}
                    <li>{detail}</li>
                  {/each}
                </ol>

                <!-- プロジェクト設定テーブル（ステップ2の場合のみ表示） -->
                {#if step.id === 2}
                  <div class="space"></div>
                  <h6 class={completedSteps.includes(step.id) ? "" : ""}>
                    プロジェクト設定
                  </h6>
                  <div class="table-container round">
                    <table class="border">
                      <thead>
                        <tr>
                          <th>設定項目</th>
                          <th>設定値</th>
                          <th>説明</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each projectSettings as setting}
                          <tr>
                            <td class="bold">{setting.item}</td>
                            <td class="primary-text">{setting.value}</td>
                            <td class="small-text">{setting.description}</td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                {/if}
              </div>

              <div class="s12 m4">
                <h6 class={completedSteps.includes(step.id) ? "" : ""}>
                  ヒント
                </h6>
                <ul
                  class="small-text {completedSteps.includes(step.id)
                    ? ''
                    : ''}"
                >
                  {#each step.tips as tip}
                    <li>{tip}</li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        </article>
        <div class="space"></div>
      </div>
    {/each}
  </div>
</section>

<!-- トラブルシューティング -->
<section>
  <div class="grid">
    <div class="s12">
      <h3>よくある問題と解決方法</h3>
      <p>環境構築でよくある問題とその解決方法をまとめました。</p>
      <div class="space"></div>
    </div>

    {#each troubleshooting as issue}
        <article class="s12 m6">
            <h6 class="error-text">
              <i>error_outline</i>
              {issue.problem}
            </h6>
            <div class="space"></div>
            <h6>解決方法</h6>
            <ol class="small-text">
              {#each issue.solutions as solution}
                <li>{solution}</li>
              {/each}
            </ol>
        </article>
    {/each}
  </div>
</section>

<div class="space"></div>

<!-- 参考資料 -->
<section>
  <div class="grid">
    <div class="s12">
      <h3>参考資料</h3>
      <p>さらに詳しい情報や学習に役立つリソースです。</p>
      <div class="space"></div>
    </div>

    {#each resources as resource}
      <div class="s12 m6">
        <article class="card round">
          <div class="padding">
            <div class="row">
              <div class="max">
                <h6>{resource.title}</h6>
                <p class="small-text">{resource.description}</p>
              </div>
              <div class="min">
                <div
                  class="chip {resource.type === '公式'
                    ? 'primary'
                    : 'secondary'}"
                >
                  {resource.type}
                </div>
              </div>
            </div>
            <div class="space"></div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              class="button transparent primary-text"
            >
              <i>open_in_new</i>
              <span>開く</span>
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
    <span class="space"></span>
    <a href="{base}/cheatsheet" class="button primary">
      <i>arrow_forward</i>
      <span>基本構文を学ぶ</span>
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

  .step-card {
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    border-left: 4px solid var(--primary);
  }

  .step-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    color: white;
  }

  .completion-check {
    background: linear-gradient(
      135deg,
      var(--surface-container) 0%,
      var(--surface-container-low) 100%
    );
    border-radius: 1rem;
    padding: 2rem 0;
  }

  .table-container {
    overflow-x: auto;
    margin: 1rem 0;
  }

  table {
    width: 100%;
    min-width: 500px;
  }

  table th {
    background-color: var(--primary-container);
    color: var(--on-primary-container);
    font-weight: bold;
    padding: 1rem 0.75rem;
  }

  table td {
    padding: 0.75rem;
    vertical-align: top;
  }

  table tr:nth-child(even) {
    background-color: var(--surface-container-low);
  }

  table tr:hover {
    background-color: var(--surface-container-high);
  }

  .bold {
    font-weight: bold;
  }
</style>
