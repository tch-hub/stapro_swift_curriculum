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
  let showStepNavigation = $state(false);

  // シャッフルされた選択肢と正解インデックス
  let shuffledOptions = $state([]);
  let shuffledCorrectAnswer = $state(0);

  // 各ステップの完了状態を管理
  let stepCompletionStatus = $state([]);

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

      // 各ステップの完了状態を初期化
      stepCompletionStatus = Array(problem.steps?.length || 0).fill(false);

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

    // 完了状態を更新
    stepCompletionStatus[currentStep] = true;

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

  // ラジオボタンの変更をハンドル
  function handleOptionChange() {
    if (!isAnswered) {
      selectOption(selectedOption);
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

  // ステップナビゲーションの表示切り替え
  function toggleStepNavigation() {
    showStepNavigation = !showStepNavigation;
  }

  // 特定のステップに移動する関数
  function goToStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= problemData.steps.length) return;

    currentStep = stepIndex;
    selectedOption = null;
    isAnswered = false;
    isCorrect = false;
    feedback = "";
    showHint = false;
    showStepNavigation = false;
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
        <progress class="circle large"></progress>
        <p>問題を読み込み中...</p>
      </div>
    </div>
  </section>
{:else if error}
  <!-- エラー状態 -->
  <section>
    <div class="grid">
      <div class="s12">
        <article class="error-container round padding">
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
        </article>
      </div>
    </div>
  </section>
{:else if problemData}
  <!-- ヘッダーセクション -->
  <article class="secondary-container center-align round large-padding">
    <h1 class="primary-text">
      <i class="large">{problemData.icon || "quiz"}</i>
    </h1>
    <h2>{problemData.title}</h2>
    <p class="large">
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
  </article>

  <div class="space"></div>

  <!-- 進捗バー -->
  {#if problemData.steps && problemData.steps.length > 1}
    <section>
      <div class="grid">
        <div class="s12">
          <article class="surface round padding">
            <div class="row">
              <div class="max">
                <span class="medium"
                  >進捗: {currentStep + 1} / {problemData.steps.length}</span
                >
              </div>
              <div class="min">
                <span class="medium">{Math.round(progress)}%</span>
              </div>
            </div>
            <div class="space"></div>
            <progress
              class="max secondary"
              value={progress}
              max="100"
              title="学習進捗: {Math.round(progress)}%"
            ></progress>

            <!-- 問題ナビゲーションボタン -->
            <div class="center-align">
              <div class="space"></div>
              <button class="button transparent" onclick={toggleStepNavigation}>
                <i>list</i>
                <span>問題を選択</span>
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 問題ナビゲーションメニュー -->
    {#if showStepNavigation}
      <section>
        <div class="grid">
          <div class="s12">
            <article class="surface-variant border round padding">
              <h6><i>list</i> 問題を選択</h6>
              <div class="grid">
                {#each problemData.steps as step, index}
                  <div class="s12 m6 l4">
                    <button
                      class="button fill {currentStep === index
                        ? 'secondary'
                        : stepCompletionStatus[index]
                          ? 'primary'
                          : 'surface'} {currentStep === index ||
                      stepCompletionStatus[index]
                        ? 'elevate'
                        : ''}"
                      onclick={() => goToStep(index)}
                    >
                      <div class="row no-space">
                        <div class="min">
                          {#if stepCompletionStatus[index]}
                            <progress
                              class="circle small primary"
                              value="100"
                              max="100"
                            ></progress>
                          {:else if currentStep === index}
                            <progress
                              class="circle small secondary"
                              value="50"
                              max="100"
                            ></progress>
                          {:else}
                            <div class="chip round secondary small-padding">
                              <span class="small-text">{index + 1}</span>
                            </div>
                          {/if}
                        </div>
                        <div class="max padding">
                          <div class="small left-align">{step.title}</div>
                        </div>
                        <div class="min">
                          {#if stepCompletionStatus[index]}
                            <i class="primary-text">check_circle</i>
                          {:else if currentStep === index}
                            <i class="secondary-text">radio_button_checked</i>
                          {:else}
                            <i class="outline-text">radio_button_unchecked</i>
                          {/if}
                        </div>
                      </div>
                    </button>
                  </div>
                {/each}
              </div>
              <div class="center-align">
                <div class="space"></div>
                <button
                  class="button transparent"
                  onclick={toggleStepNavigation}
                >
                  <i>close</i>
                  <span>閉じる</span>
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>
    {/if}

    <div class="space"></div>
  {/if}

  <!-- メイン学習エリア -->
  {#if problemData.steps && problemData.steps.length > 0}
    <section>
      <!-- 問題エリア -->
      <article class="padding">
        <h5 class="primary-text">{problemData.steps[currentStep].title}</h5>
        <article class="surface-variant round padding border-left secondary">
          <pre class="small left-align wrap">{problemData.steps[currentStep]
              .instruction}</pre>
        </article>

        <h6><i>quiz</i> 選択肢</h6>
        <div class="space"></div>
        <!-- 選択肢 -->
        <div class="field border">
          {#each shuffledOptions as option, index}
            <label class="radio">
              <input
                type="radio"
                name="option"
                bind:group={selectedOption}
                value={index}
                disabled={isAnswered}
                onchange={handleOptionChange}
              />
              <span class="row no-space">
                <div class="chip secondary small-padding">
                  <span class="small-text"
                    >{String.fromCharCode(65 + index)}</span
                  >
                </div>
                <div class="max padding">
                  <code class="small">{option}</code>
                </div>
                {#if isAnswered && index === shuffledCorrectAnswer}
                  <i class="primary-text">check_circle</i>
                {:else if selectedOption === index && !isCorrect && isAnswered}
                  <i class="error-text">cancel</i>
                {/if}
              </span>
            </label>
          {/each}
        </div>
        <div class="space"></div>

        <!-- ヒント表示 -->
        {#if showHint}
          <article class="secondary-container round padding">
            <h6>
              <i>lightbulb</i> ヒント
            </h6>
            <p>{problemData.steps[currentStep].hint}</p>
          </article>
          <div class="space"></div>
        {/if}

        <!-- フィードバック -->
        {#if feedback}
          <article
            class="{isCorrect
              ? 'primary-container'
              : 'error-container'} round padding"
          >
            <h6>
              <i>{isCorrect ? "check_circle" : "info"}</i> フィードバック
            </h6>
            <p>{feedback}</p>
          </article>
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
            disabled={!isAnswered || selectedOption === null}
          >
            <i>refresh</i>
            <span>選択をリセット</span>
          </button>
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
  /* BeerCSS標準クラスを活用しているため、カスタムCSSは最小限に */

  /* コードブロックのフォント設定 */
  pre {
    font-family: "Courier New", monospace;
    white-space: pre-wrap;
    margin: 0;
  }

  code {
    font-family: "Courier New", monospace;
  }

  /* ラジオボタンのカスタマイズ */
  .field .radio span {
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .field .radio:hover span {
    background: var(--surface-variant);
  }

  .field .radio input:checked + span {
    background: var(--secondary-container);
    border: 1px solid var(--secondary);
  }

  /* 無効化されたボタンのスタイル */
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
