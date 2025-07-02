<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";

  // ページロード時に渡される問題ID
  const { data } = $props();
  const problemId = data.problemId;

  // 問題データを格納する変数
  let problemData = $state(null);
  let loading = $state(true);
  let error = $state(null);

  // 問題の状態管理
  let currentStep = $state(0);
  let selectedOption = $state(null);
  let isAnswered = $state(false);
  let isCorrect = $state(false);
  let feedback = $state("");
  let showHint = $state(false);

  // シャッフルされた選択肢と正解インデックス
  let shuffledOptions = $state([]);
  let shuffledCorrectAnswer = $state(0);

  // JSONファイルから問題データを読み込む
  async function loadProblemData() {
    try {
      const response = await fetch(`${base}/practice-data.json`);
      if (!response.ok) {
        throw new Error("練習問題データの読み込みに失敗しました");
      }
      const data = await response.json();

      // 指定されたIDの問題を検索
      const problem = data.practiceProblems.find((p) => p.id === problemId);
      if (!problem) {
        throw new Error("指定された問題が見つかりませんでした");
      }

      problemData = problem;
      loading = false;

      // 最初の問題の選択肢をシャッフル
      if (problem.steps && problem.steps.length > 0) {
        shuffleCurrentProblem();
      }
    } catch (err) {
      error = err.message;
      loading = false;
    }
  }

  // 配列をシャッフルする関数
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // 問題の選択肢をシャッフルする関数
  function shuffleCurrentProblem() {
    if (!problemData || !problemData.steps || !problemData.steps[currentStep]) {
      return;
    }

    const currentProblem = problemData.steps[currentStep];
    const optionsWithIndex = currentProblem.options.map((option, index) => ({
      option,
      originalIndex: index,
    }));

    const shuffledOptionsWithIndex = shuffleArray(optionsWithIndex);
    shuffledOptions = shuffledOptionsWithIndex.map((item) => item.option);

    // 元の正解インデックスが新しい配列のどの位置にあるかを見つける
    shuffledCorrectAnswer = shuffledOptionsWithIndex.findIndex(
      (item) => item.originalIndex === currentProblem.correctAnswer
    );
  }

  // 問題が変わったときに選択肢をシャッフル
  $effect(() => {
    if (problemData && problemData.steps && problemData.steps[currentStep]) {
      shuffleCurrentProblem();
    }
  });

  // 選択肢を選択する関数
  function selectOption(optionIndex) {
    if (isAnswered || !problemData) return;

    selectedOption = optionIndex;
    isAnswered = true;

    isCorrect = optionIndex === shuffledCorrectAnswer;

    if (isCorrect) {
      feedback = "正解です！ " + problemData.steps[currentStep].explanation;
    } else {
      // 正解の選択肢を取得（シャッフル後の）
      const correctOption = shuffledOptions[shuffledCorrectAnswer];
      feedback =
        "不正解です。正解は「" +
        correctOption +
        "」です。" +
        problemData.steps[currentStep].explanation;
    }
  }

  function nextStep() {
    if (!problemData || currentStep >= problemData.steps.length - 1) return;

    currentStep++;
    selectedOption = null;
    isAnswered = false;
    isCorrect = false;
    feedback = "";
    showHint = false;
  }

  // 前の問題に戻る
  function previousStep() {
    if (currentStep <= 0) return;

    currentStep--;
    selectedOption = null;
    isAnswered = false;
    isCorrect = false;
    feedback = "";
    showHint = false;
  }

  // 選択をリセット
  function resetSelection() {
    selectedOption = null;
    isAnswered = false;
    isCorrect = false;
    feedback = "";
    showHint = false;
    // 選択肢を再シャッフル
    shuffleCurrentProblem();
  }

  // ヒントの表示切り替え
  function toggleHint() {
    showHint = !showHint;
  }

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

  // 現在のステップの進捗
  const progress = $derived(
    problemData && problemData.steps
      ? ((currentStep + 1) / problemData.steps.length) * 100
      : 0
  );

  // コンポーネントマウント時にデータを読み込み
  onMount(() => {
    loadProblemData();
  });
</script>

<svelte:head>
  <title
    >{problemData ? problemData.title : "練習問題"} - Swift学習カリキュラム</title
  >
  <meta
    name="description"
    content={problemData
      ? problemData.description
      : "Swift学習のための練習問題"}
  />
</svelte:head>

{#if loading}
  <!-- ローディング状態 -->
  <section>
    <div class="grid">
      <div class="s12 center-align">
        <div class="loader"></div>
        <p>問題を読み込み中...</p>
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
              <button class="button primary" onclick={() => loadProblemData()}>
                <i>refresh</i>
                <span>再読み込み</span>
              </button>
              <a href="{base}/practice" class="button transparent">
                <i>arrow_back</i>
                <span>練習問題一覧に戻る</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
{:else if problemData}
  <!-- ヘッダーセクション -->
  <section class="hero-section">
    <div class="grid">
      <div class="s12 center-align">
        <h1 class="primary-text">
          <i class="large">{problemData.icon || "quiz"}</i>
        </h1>
        <h2>{problemData.title}</h2>
        <p class="large-text">
          {problemData.description}
        </p>
        <div class="row">
          <div class="chip {getDifficultyColor(problemData.difficulty)}">
            <span>{problemData.difficulty}</span>
          </div>
          <div class="chip secondary">
            <span>{problemData.category}</span>
          </div>
          {#if problemData.estimatedTime}
            <div class="chip outline">
              <i class="small">schedule</i>
              <span>{problemData.estimatedTime}</span>
            </div>
          {/if}
        </div>
        <div class="space"></div>
      </div>
    </div>
  </section>

  <div class="space"></div>

  <!-- 進捗バー -->
  {#if problemData.steps && problemData.steps.length > 1}
    <section>
      <div class="grid">
        <div class="s12">
          <div class="progress-container">
            <div class="progress-info">
              <span class="medium-text"
                >進捗: {currentStep + 1} / {problemData.steps.length}</span
              >
              <span class="medium-text">{Math.round(progress)}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: {progress}%"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="space"></div>
  {/if}

  <!-- メイン学習エリア -->
  {#if problemData.steps && problemData.steps.length > 0}
    <section>
      <!-- 問題エリア -->
      <article>
        <div class="padding">
          <h5 class="primary-text">{problemData.steps[currentStep].title}</h5>
          <div class="instruction-container">
            <pre class="instruction-text">{problemData.steps[currentStep]
                .instruction}</pre>
          </div>
        </div>
        <div class="padding">
          <h6><i>quiz</i> 選択肢</h6>
          <div class="space"></div>
          <!-- 選択肢 -->
          <ul class="list border">
            {#each shuffledOptions as option, index}
              <li
                class="option-item {selectedOption === index
                  ? 'selected'
                  : ''} {isAnswered && index === shuffledCorrectAnswer
                  ? 'correct'
                  : ''} {selectedOption === index && !isCorrect && isAnswered
                  ? 'incorrect'
                  : ''}"
                onclick={() => selectOption(index)}
                style="cursor: {isAnswered ? 'default' : 'pointer'};"
              >
                <span class="option-label"
                  >{String.fromCharCode(65 + index)}.</span
                >
                <div class="max">
                  <code class="option-code">{option}</code>
                </div>
                {#if isAnswered && index === shuffledCorrectAnswer}
                  <i class="option-icon correct-icon">check_circle</i>
                {:else if selectedOption === index && !isCorrect && isAnswered}
                  <i class="option-icon incorrect-icon">cancel</i>
                {/if}
              </li>
            {/each}
          </ul>
          <div class="space"></div>

          <!-- ヒント表示 -->
          {#if showHint}
            <div class="card secondary-container">
              <div class="padding">
                <h6>
                  <i>lightbulb</i> ヒント
                </h6>
                <p>{problemData.steps[currentStep].hint}</p>
              </div>
            </div>
            <div class="space"></div>
          {/if}

          <!-- フィードバック -->
          {#if feedback}
            <div
              class="card {isCorrect ? 'primary-container' : 'error-container'}"
            >
              <div class="padding">
                <h6>
                  <i>{isCorrect ? "check_circle" : "info"}</i> フィードバック
                </h6>
                <p>{feedback}</p>
              </div>
            </div>
            <div class="space"></div>
          {/if}

          <!-- アクションボタン -->
          <div class="row">
            <button
              class="button transparent"
              onclick={toggleHint}
              disabled={isAnswered}
            >
              <i>lightbulb</i>
              <span>{showHint ? "ヒントを隠す" : "ヒントを見る"}</span>
            </button>
            <button
              class="button transparent"
              onclick={resetSelection}
              disabled={!isAnswered}
            >
              <i>refresh</i>
              <span>選択をリセット</span>
            </button>
          </div>
        </div>
      </article>
    </section>

    <div class="space"></div>

    <!-- ナビゲーション -->
    <section>
      <div class="grid">
        <div class="s12">
          <div class="row">
            <div class="max">
              <button
                class="button secondary"
                onclick={previousStep}
                disabled={currentStep === 0}
              >
                <i>arrow_back</i>
                <span>前の問題</span>
              </button>
            </div>
            <div class="min">
              {#if currentStep === problemData.steps.length - 1}
                <a href="{base}/practice" class="button primary">
                  <i>check</i>
                  <span>完了</span>
                </a>
              {:else}
                <button
                  class="button primary"
                  onclick={nextStep}
                  disabled={!isAnswered}
                >
                  <span>次の問題</span>
                  <i>arrow_forward</i>
                </button>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </section>
  {/if}
{/if}

<div class="space"></div>

<!-- 戻るリンク -->
<section>
  <div class="center-align">
    <a href="{base}/practice" class="button transparent primary-text">
      <i>arrow_back</i>
      <span>練習問題一覧に戻る</span>
    </a>
  </div>
</section>

<style>
  .hero-section {
    padding: 3rem 0;
    background: linear-gradient(
      135deg,
      var(--secondary-container) 0%,
      var(--tertiary-container) 100%
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

  .instruction-container {
    background: var(--surface-variant);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
    border-left: 4px solid var(--secondary);
  }

  .instruction-text {
    font-family: "Courier New", monospace;
    font-size: 1rem;
    line-height: 1.5;
    margin: 0;
    white-space: pre-wrap;
    color: var(--on-surface-variant);
  }

  .progress-container {
    background: var(--surface);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--outline);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--secondary);
    transition: width 0.3s ease;
    border-radius: 4px;
  }

  .card {
    height: 100%;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .option-label {
    background: var(--secondary);
    color: var(--on-secondary);
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1rem;
    flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .option-item {
    transition: all 0.2s ease;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .option-item:hover:not(.selected) {
    background: var(--surface-variant);
    transform: translateX(4px);
  }

  .option-item.selected {
    background: var(--secondary-container);
    border: 2px solid var(--secondary);
  }

  .option-item.correct {
    background: var(--primary-container);
    border: 2px solid var(--primary);
  }

  .option-item.incorrect {
    background: var(--error-container);
    border: 2px solid var(--error);
  }

  .option-code {
    flex: 1;
    font-family: "Courier New", monospace;
    font-size: 1rem;
    background: transparent;
    padding: 0;
    font-weight: 500;
  }

  .option-icon {
    flex-shrink: 0;
    font-size: 1.5rem;
  }

  .correct-icon {
    color: var(--primary);
  }

  .incorrect-icon {
    color: var(--error);
  }

  .error-container {
    background: var(--error-container);
    color: var(--on-error-container);
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

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
