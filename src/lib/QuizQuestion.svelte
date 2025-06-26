<!--
  QuizQuestion コンポーネント - 多択問題表示用

  使用例:
  <script>
    import QuizQuestion from '$lib/QuizQuestion.svelte';

    // 問題データの形式
    const questionData = {
      title: "問題1: 変数の宣言",
      instruction: "正しい変数の宣言方法はどれですか？",
      options: [
        "var name = \"太郎\"",
        "let name = \"太郎\"", 
        "const name = \"太郎\"",
        "string name = \"太郎\""
      ],
      correctAnswer: 1, // 正解のインデックス（0から始まる）
      explanation: "letは可変な変数を宣言するキーワードです。",
      hint: "Swiftではletとvarが使用できます。"
    };

    let showHint = false;

    // 回答時のコールバック関数
    function handleAnswer(result) {
      console.log('回答結果:', result.isCorrect);
      console.log('選択したオプション:', result.selectedOption);
      console.log('正解のオプション:', result.correctAnswer);
    }

    // ヒント表示切り替え関数
    function toggleHint() {
      showHint = !showHint;
    }

    // リセット時のコールバック関数
    function handleReset() {
      console.log('問題がリセットされました');
    }
  </script>

  <QuizQuestion 
    question={questionData}
    onAnswer={handleAnswer}
    showHint={showHint}
    onToggleHint={toggleHint}
    onReset={handleReset}
  />
  プロパティ:
  - question: 問題データオブジェクト（必須）
    - title: 問題のタイトル
    - instruction: 問題文
    - options: 選択肢の配列（2つ以上）
    - correctAnswer: 正解のインデックス（0から始まる）
    - explanation: 解説文
    - hint: ヒント文（オプション）
  - onAnswer: 回答時のコールバック関数（必須）
  - showHint: ヒント表示状態のブール値（必須）
  - onToggleHint: ヒント表示切り替え関数（必須）
  - onReset: リセット時のコールバック関数（オプション）

  機能:
  - 2択〜多択問題に対応（選択肢数は自動調整）
  - 選択肢の自動シャッフル（毎回異なる順序で表示）
  - 正解・不正解の判定とフィードバック表示
  - ヒント機能
  - 選択リセット機能
  - 外部からのリセット（reset()メソッド）
-->

<script>
  // クイズ問題のプロパティ
  let {
    question = {}, // 問題データオブジェクト
    onAnswer = () => {}, // 回答時のコールバック関数
    showHint = false, // ヒント表示状態
    onToggleHint = () => {}, // ヒント表示切り替え関数
    onReset = () => {}, // リセット時のコールバック関数
  } = $props();

  // 内部状態
  let selectedOption = $state(null);
  let isAnswered = $state(false);
  let isCorrect = $state(false);
  let feedback = $state("");

  // シャッフルされた選択肢と正解インデックス
  let shuffledOptions = $state([]);
  let shuffledCorrectAnswer = $state(0);

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
    if (!question.options || question.options.length < 2) return;

    const optionsWithIndex = question.options.map((option, index) => ({
      option,
      originalIndex: index,
    }));

    const shuffledOptionsWithIndex = shuffleArray(optionsWithIndex);
    shuffledOptions = shuffledOptionsWithIndex.map((item) => item.option);

    // 元の正解インデックスが新しい配列のどの位置にあるかを見つける
    shuffledCorrectAnswer = shuffledOptionsWithIndex.findIndex(
      (item) => item.originalIndex === question.correctAnswer
    );
  }
  // 問題が変わったときに選択肢をシャッフル
  $effect(() => {
    if (question.options && question.options.length >= 2) {
      shuffleCurrentProblem();
      // 状態をリセット
      selectedOption = null;
      isAnswered = false;
      isCorrect = false;
      feedback = "";
    }
  });

  // 選択肢を選択する関数
  function selectOption(optionIndex) {
    if (isAnswered) return;

    selectedOption = optionIndex;
    isAnswered = true;

    isCorrect = optionIndex === shuffledCorrectAnswer;

    if (isCorrect) {
      feedback = "正解です！ " + question.explanation;
    } else {
      // 正解の選択肢を取得（シャッフル後の）
      const correctOption = shuffledOptions[shuffledCorrectAnswer];
      feedback =
        "不正解です。正解は「" +
        correctOption +
        "」です。" +
        question.explanation;
    }

    // 親コンポーネントに回答結果を通知
    onAnswer({
      isCorrect,
      selectedOption: optionIndex,
      correctAnswer: shuffledCorrectAnswer,
    });
  }

  // 選択をリセット
  function resetSelection() {
    selectedOption = null;
    isAnswered = false;
    isCorrect = false;
    feedback = "";
    // 選択肢を再シャッフル
    shuffleCurrentProblem();
    onReset();
  }

  // 外部からのリセット
  export function reset() {
    resetSelection();
  }
</script>

<!-- 問題エリア -->
<article>
  <div class="padding">
    <h5 class="primary-text">{question.title || "問題"}</h5>
    <div class="instruction-container">
      <p class="instruction-text">{question.instruction || ""}</p>
    </div>
  </div>
  <div class="padding">
    <h6><i>quiz</i> 選択肢</h6>
    <div class="space"></div>
    <!-- 選択肢 -->
    {#if shuffledOptions.length > 0}
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
            <span class="option-label">{String.fromCharCode(65 + index)}.</span>
            <div class="max code-container">
              <pre class="option-code">{option}</pre>
            </div>
            {#if isAnswered && index === shuffledCorrectAnswer}
              <i class="option-icon correct-icon">check_circle</i>
            {:else if selectedOption === index && !isCorrect && isAnswered}
              <i class="option-icon incorrect-icon">cancel</i>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
    <div class="space"></div>

    <!-- ヒント表示 -->
    {#if showHint && question.hint}
      <div class="card secondary-container">
        <div class="padding">
          <h6>
            <i>lightbulb</i> ヒント
          </h6>
          <p>{question.hint}</p>
        </div>
      </div>
      <div class="space"></div>
    {/if}

    <!-- フィードバック -->
    {#if feedback}
      <div class="card {isCorrect ? 'primary-container' : 'error-container'}">
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
        onclick={onToggleHint}
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

<style>
  .instruction-container {
    background: var(--surface-variant);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
    border-left: 4px solid var(--secondary);
  }

  .instruction-text {
    font-size: 1rem;
    line-height: 1.5;
    margin: 0;
    color: var(--on-surface-variant);
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
    min-width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.9rem;
    flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    align-self: flex-start;
    margin-top: 0.5rem;
    padding: 0 0.25rem;
  }

  .option-item {
    transition: all 0.2s ease;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    align-items: flex-start;
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

  .code-container {
    flex: 1;
    min-width: 0;
  }

  .option-code {
    font-family: "Courier New", monospace;
    font-size: 0.9rem;
    background: transparent;
    padding: 0;
    font-weight: 500;
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: var(--on-surface);
  }

  .option-icon {
    flex-shrink: 0;
    font-size: 1.5rem;
    align-self: flex-start;
    margin-top: 0.5rem;
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

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
