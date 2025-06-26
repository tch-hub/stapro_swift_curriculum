<script>
  import { base } from "$app/paths";

  // 練習問題のデータ
  const problemData = {
    id: 1,
    title: "変数の宣言練習",
    description: "適切なキーワードを使って変数を宣言してみよう",
    difficulty: "初級",
    category: "変数",
  };
  // 練習問題のステップ
  const steps = [
    {
      id: 1,
      title: "問題1: 文字列変数の宣言",
      instruction:
        "名前を格納する変数 'name' を宣言し、あなたの名前を代入する正しいコードはどれですか？",
      hint: "var キーワードを使用してください。文字列はダブルクォートで囲みます。",
      options: [
        'var name = "太郎"',
        'let name = "太郎"',
        "var name = 太郎",
        'name = "太郎"',
      ],
      correctAnswer: 0,
      explanation:
        "var キーワードは変更可能な変数を宣言するために使用します。文字列はダブルクォートで囲む必要があります。",
    },
    {
      id: 2,
      title: "問題2: 数値変数の宣言",
      instruction:
        "年齢を格納する変数 'age' を宣言し、15を代入する正しいコードはどれですか？",
      hint: "var キーワードを使用し、数値はクォートで囲まないでください。",
      options: ["var age = 15", 'var age = "15"', "let age = 15", "age = 15"],
      correctAnswer: 0,
      explanation:
        "var キーワードで変数を宣言し、数値はクォートで囲まずに直接記述します。",
    },
    {
      id: 3,
      title: "問題3: 定数の宣言",
      instruction:
        "円周率を格納する定数 'pi' を宣言し、3.14159を代入する正しいコードはどれですか？",
      hint: "let キーワードを使用してください。",
      options: [
        "var pi = 3.14159",
        "let pi = 3.14159",
        'let pi = "3.14159"',
        "const pi = 3.14159",
      ],
      correctAnswer: 1,
      explanation:
        "let キーワードは変更できない定数を宣言するために使用します。",
    },
    {
      id: 4,
      title: "問題4: ブール型変数の宣言",
      instruction:
        "学生かどうかを表す変数 'isStudent' を宣言し、true を代入する正しいコードはどれですか？",
      hint: "var キーワードを使用し、ブール値はtrue または false です。",
      options: [
        "var isStudent = true",
        'var isStudent = "true"',
        "let isStudent = true",
        "var isStudent = 1",
      ],
      correctAnswer: 0,
      explanation:
        "var キーワードで変数を宣言し、ブール型はtrue（真）またはfalse（偽）の値を持ちます。クォートで囲む必要はありません。",
    },
  ];
  let currentStep = $state(0);
  let selectedOption = $state(null);
  let isAnswered = $state(false);
  let isCorrect = $state(false);
  let feedback = $state("");
  let showHint = $state(false);

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
    const currentProblem = steps[currentStep];
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
    shuffleCurrentProblem();
  });
  // 選択肢を選択する関数
  function selectOption(optionIndex) {
    if (isAnswered) return;

    selectedOption = optionIndex;
    isAnswered = true;

    isCorrect = optionIndex === shuffledCorrectAnswer;

    if (isCorrect) {
      feedback = "正解です！ " + steps[currentStep].explanation;
    } else {
      // 正解の選択肢を取得（シャッフル後の）
      const correctOption = shuffledOptions[shuffledCorrectAnswer];
      feedback =
        "不正解です。正解は「" +
        correctOption +
        "」です。" +
        steps[currentStep].explanation;
    }
  }
  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep++;
      selectedOption = null;
      isAnswered = false;
      isCorrect = false;
      feedback = "";
      showHint = false;
      // 新しい問題の選択肢をシャッフル（$effectで自動実行される）
    }
  }

  // 前の問題に戻る
  function previousStep() {
    if (currentStep > 0) {
      currentStep--;
      selectedOption = null;
      isAnswered = false;
      isCorrect = false;
      feedback = "";
      showHint = false;
      // 前の問題の選択肢をシャッフル（$effectで自動実行される）
    }
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

  // 現在のステップの進捗 - Svelte 5 $derived使用
  const progress = $derived(((currentStep + 1) / steps.length) * 100);
</script>

<svelte:head>
  <title>変数の宣言練習 - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="Swiftの変数宣言を実践的に学習。var、let、型推論などの基本概念を身に付けよう。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">code</i>
      </h1>
      <h2>{problemData.title}</h2>
      <p class="large-text">
        {problemData.description}
      </p>
      <div class="chip primary">
        <span>{problemData.difficulty}</span>
      </div>
      <div class="space"></div>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- 進捗バー -->
<section>
  <div class="grid">
    <div class="s12">
      <div class="progress-container">
        <div class="progress-info">
          <span class="medium-text"
            >進捗: {currentStep + 1} / {steps.length}</span
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

<!-- メイン学習エリア -->
<section>
  <!-- 問題エリア -->
  <article>
    <div class="padding">
      <h5 class="primary-text">{steps[currentStep].title}</h5>
      <p class="medium-text">{steps[currentStep].instruction}</p>
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
            <span class="option-label">{String.fromCharCode(65 + index)}.</span>
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
            <p>{steps[currentStep].hint}</p>
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
          {#if currentStep === steps.length - 1}
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
    background: var(--primary);
    transition: width 0.3s ease;
    border-radius: 4px;
  }

  .card {
    height: 100%;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
  .option-label {
    background: var(--primary);
    color: var(--on-primary);
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
    background: var(--primary-container);
    border: 2px solid var(--primary);
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

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
