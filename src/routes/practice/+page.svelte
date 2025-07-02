<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";

  // 練習問題のデータを格納する変数
  let practiceProblems = $state([]);
  let loading = $state(true);
  let error = $state(null);

  // JSONファイルから練習問題データを読み込む
  async function loadPracticeData() {
    try {
      const response = await fetch(`${base}/practice-data.json`);
      if (!response.ok) {
        throw new Error("練習問題データの読み込みに失敗しました");
      }
      const data = await response.json();
      practiceProblems = data.practiceProblems;
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  }

  // コンポーネントマウント時にデータを読み込み
  onMount(() => {
    loadPracticeData();
  });

  // 練習問題の旧データ（フォールバック用）
  const fallbackProblems = [
    {
      id: "variable-declaration",
      title: "変数の宣言練習",
      description: "適切なキーワードを使って変数を宣言してみよう",
      difficulty: "初級",
      category: "変数",
      icon: "code",
      completed: false,
    },
    {
      id: "type-inference",
      title: "型推論チャレンジ",
      description: "Swiftの型推論システムを理解して、適切なコードを選択しよう",
      difficulty: "中級",
      category: "データ型",
      icon: "psychology",
      completed: false,
    },
    {
      id: "conditional-statements",
      title: "条件分岐の実装",
      description: "if文を使って条件による処理分岐を作ってみよう",
      difficulty: "中級",
      category: "制御構造",
      icon: "account_tree",
      completed: false,
    },
    {
      id: "array-operations",
      title: "配列の操作",
      description: "配列の要素を追加・削除・検索してみよう",
      difficulty: "中級",
      category: "コレクション",
      icon: "view_list",
      completed: false,
    },
    {
      id: "function-creation",
      title: "関数の作成",
      description: "引数と戻り値を持つ関数を作ってみよう",
      difficulty: "上級",
      category: "関数",
      icon: "functions",
      completed: false,
    },
    {
      id: "optional-types",
      title: "オプショナル型の使用",
      description: "オプショナル型を使った安全なコードを書いてみよう",
      difficulty: "上級",
      category: "オプショナル",
      icon: "help",
      completed: false,
    },
  ];

  // フィルター状態
  let selectedDifficulty = $state("全て");
  let selectedCategory = $state("全て");

  // 表示する練習問題データ（JSONから読み込んだデータまたはフォールバック）
  const displayProblems = $derived(
    practiceProblems.length > 0 ? practiceProblems : fallbackProblems
  );

  // 難易度の選択肢
  const difficulties = ["全て", "初級", "中級", "上級"];

  // カテゴリの選択肢
  const categories = [
    "全て",
    "変数",
    "データ型",
    "制御構造",
    "コレクション",
    "関数",
    "オプショナル",
  ];

  // フィルタリングされた練習問題
  const filteredProblems = $derived(
    displayProblems.filter((problem) => {
      const difficultyMatch =
        selectedDifficulty === "全て" ||
        problem.difficulty === selectedDifficulty;
      const categoryMatch =
        selectedCategory === "全て" || problem.category === selectedCategory;
      return difficultyMatch && categoryMatch;
    })
  );

  // 難易度に応じた色を取得
  function getDifficultyColor(difficulty) {
    switch (difficulty) {
      case "初級":
        return "primary";
      case "中級":
        return "secondary";
      case "上級":
        return "tertiary";
      default:
        return "primary";
    }
  }

  // 練習問題の完了切り替え
  function toggleCompleted(id) {
    const problem = practiceProblems.find((p) => p.id === id);
    if (problem) {
      problem.completed = !problem.completed;
    }
  }
</script>

<svelte:head>
  <title>練習問題 - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="Swift基本構文の練習問題集。変数、関数、クラスなど段階的に学習できる実践的な問題。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">quiz</i>
      </h1>
      <h2>Swift練習問題</h2>
      <p class="large-text">
        実際にコードを書いて、学習した内容を定着させよう！
      </p>
      <div class="space"></div>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- フィルター -->
{#if !loading && !error}
  <section>
    <div class="grid">
      <div class="s12">
        <article class="border">
          <div class="padding">
            <h6><i>filter_list</i> フィルター</h6>
            <div class="space"></div>
            <div class="row">
              <div class="field">
                <select bind:value={selectedDifficulty}>
                  {#each difficulties as difficulty}
                    <option value={difficulty}>{difficulty}</option>
                  {/each}
                </select>
                <label>難易度</label>
              </div>
              <div class="field">
                <select bind:value={selectedCategory}>
                  {#each categories as category}
                    <option value={category}>{category}</option>
                  {/each}
                </select>
                <label>カテゴリ</label>
              </div>
              <div class="min">
                <p class="small-text">
                  {filteredProblems.length}件の問題が見つかりました
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <div class="space"></div>
{/if}

<!-- ローディング状態 -->
{#if loading}
  <section>
    <div class="grid">
      <div class="s12 center-align">
        <div class="loader"></div>
        <p>練習問題を読み込み中...</p>
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
            <button class="button primary" onclick={() => loadPracticeData()}>
              <i>refresh</i>
              <span>再読み込み</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
{:else}
  <!-- 練習問題一覧 -->
  <section>
    <div class="grid">
      {#each filteredProblems as problem}
        <div class="s12 m6 l4">
          <article
            class="card round {problem.completed ? 'primary-container' : ''}"
          >
            <div class="padding">
              <div class="row">
                <div class="max">
                  <h6 class={problem.completed ? "" : ""}>
                    <i class="small">{problem.icon || "assignment"}</i>
                    {problem.title}
                  </h6>
                  <p class="small-text {problem.completed ? '' : ''}">
                    {problem.description}
                  </p>
                  {#if problem.estimatedTime}
                    <p class="small-text">
                      <i class="tiny">schedule</i> 目安時間: {problem.estimatedTime}
                    </p>
                  {/if}
                </div>
                <div class="min">
                  {#if problem.completed}
                    <i class="large">check_circle</i>
                  {:else}
                    <i
                      class="large {getDifficultyColor(
                        problem.difficulty
                      )}-text">assignment</i
                    >
                  {/if}
                </div>
              </div>

              <div class="space"></div>
              <div class="row">
                <a
                  href="{base}/practice/{problem.id}"
                  class="button {problem.completed
                    ? 'white primary-text'
                    : 'primary'}"
                >
                  <i>play_arrow</i>
                  <span>問題を解く</span>
                </a>
                <div class="max">
                  <div class="chip {getDifficultyColor(problem.difficulty)}">
                    <span>{problem.difficulty}</span>
                  </div>
                  <div class="chip secondary">
                    <span>{problem.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      {/each}
    </div>
  </section>
{/if}

<div class="space"></div>

<!-- ナビゲーション -->
<section>
  <div class="center-align">
    <a href="{base}/" class="button transparent primary-text">
      <i>arrow_back</i>
      <span>ホームに戻る</span>
    </a>
    <span class="space"></span>
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
</style>
