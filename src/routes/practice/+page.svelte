<script>
  import { base } from "$app/paths";

  // 練習問題のデータ
  const practiceProblems = [
    {
      id: 1,
      title: "変数の宣言練習",
      description: "適切なキーワードを使って変数を宣言してみよう",
      difficulty: "初級",
      category: "変数",
      completed: false,
    },
    {
      id: 2,
      title: "型推論チャレンジ",
      description: "Swiftの型推論システムを理解して、適切なコードを選択しよう",
      difficulty: "中級",
      category: "データ型",
      completed: false,
    },
    {
      id: 3,
      title: "条件分岐の実装",
      description: "if文を使って条件による処理分岐を作ってみよう",
      difficulty: "中級",
      category: "制御構造",
      completed: false,
    },
    {
      id: 4,
      title: "配列の操作",
      description: "配列の要素を追加・削除・検索してみよう",
      difficulty: "中級",
      category: "コレクション",
      completed: false,
    },
    {
      id: 5,
      title: "関数の作成",
      description: "引数と戻り値を持つ関数を作ってみよう",
      difficulty: "上級",
      category: "関数",
      completed: false,
    },
    {
      id: 6,
      title: "オプショナル型の使用",
      description: "オプショナル型を使った安全なコードを書いてみよう",
      difficulty: "上級",
      category: "オプショナル",
      completed: false,
    },
  ];

  // フィルター状態
  let selectedDifficulty = "全て";
  let selectedCategory = "全て";

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
  $: filteredProblems = practiceProblems.filter((problem) => {
    const difficultyMatch =
      selectedDifficulty === "全て" ||
      problem.difficulty === selectedDifficulty;
    const categoryMatch =
      selectedCategory === "全て" || problem.category === selectedCategory;
    return difficultyMatch && categoryMatch;
  });

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
                  {problem.title}
                </h6>
                <p class="small-text {problem.completed ? '' : ''}">
                  {problem.description}
                </p>
              </div>
              <div class="min">
                {#if problem.completed}
                  <i class="large">check_circle</i>
                {:else}
                  <i class="large {getDifficultyColor(problem.difficulty)}-text"
                    >assignment</i
                  >
                {/if}
              </div>
            </div>

            <div class="space"></div>
            <div class="row">
              {#if problem.id === 1}
                <a
                  href="{base}/practice/variable-declaration"
                  class="button {problem.completed
                    ? 'white primary-text'
                    : 'primary'}"
                >
                  <i>play_arrow</i>
                  <span>問題を解く</span>
                </a>
              {:else if problem.id === 2}
                <a
                  href="{base}/practice/type-inference"
                  class="button {problem.completed
                    ? 'white primary-text'
                    : 'primary'}"
                >
                  <i>play_arrow</i>
                  <span>問題を解く</span>
                </a>
              {:else if problem.id === 3}
                <a
                  href="{base}/practice/conditional-statements"
                  class="button {problem.completed
                    ? 'white primary-text'
                    : 'primary'}"
                >
                  <i>play_arrow</i>
                  <span>問題を解く</span>
                </a>
              {:else if problem.id === 4}
                <a
                  href="{base}/practice/array-operations"
                  class="button {problem.completed
                    ? 'white primary-text'
                    : 'primary'}"
                >
                  <i>play_arrow</i>
                  <span>問題を解く</span>
                </a>
              {:else if problem.id === 5}
                <a
                  href="{base}/practice/function-creation"
                  class="button {problem.completed
                    ? 'white primary-text'
                    : 'primary'}"
                >
                  <i>play_arrow</i>
                  <span>問題を解く</span>
                </a>
              {:else if problem.id === 6}
                <a
                  href="{base}/practice/optional-types"
                  class="button {problem.completed
                    ? 'white primary-text'
                    : 'primary'}"
                >
                  <i>play_arrow</i>
                  <span>問題を解く</span>
                </a>
              {:else}
                <button
                  class="button {problem.completed
                    ? 'white primary-text'
                    : 'primary'}"
                  onclick={() => toggleCompleted(problem.id)}
                >
                  <i>play_arrow</i>
                  <span>問題を解く</span>
                </button>
              {/if}
            </div>
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
</style>
