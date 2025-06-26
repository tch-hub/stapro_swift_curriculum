<script>
  import { base } from "$app/paths";

  // 練習問題のデータ
  const problemData = {
    id: 2,
    title: "型推論チャレンジ",
    description: "Swiftの型推論を理解して、適切なコードを選択しよう",
    difficulty: "中級",
    category: "型推論",
  };

  // 練習問題のステップ
  const steps = [
    {
      id: 1,
      title: "問題1: 基本的な型推論",
      instruction:
        "次のコードで、変数 'message' の型は何になりますか？\n\nvar message = \"Hello, Swift!\"",
      hint: "Swiftは値から自動的に型を推論します。文字列リテラルから推論される型を考えてください。",
      options: ["String", "Int", "Double", "Any"],
      correctAnswer: 0,
      explanation:
        '文字列リテラル "Hello, Swift!" から、Swiftは自動的に String 型と推論します。',
    },
    {
      id: 2,
      title: "問題2: 数値の型推論",
      instruction:
        "次のコードで、変数 'count' の型は何になりますか？\n\nvar count = 42",
      hint: "整数リテラルの場合、Swiftはどの整数型を選択するでしょうか？",
      options: ["Int8", "Int16", "Int", "Double"],
      correctAnswer: 2,
      explanation: "整数リテラルの場合、Swiftは標準的に Int 型を推論します。",
    },
    {
      id: 3,
      title: "問題3: 小数点数の型推論",
      instruction:
        "次のコードで、変数 'price' の型は何になりますか？\n\nvar price = 99.99",
      hint: "小数点を含む数値リテラルから推論される型を考えてください。",
      options: ["Float", "Double", "Int", "Decimal"],
      correctAnswer: 1,
      explanation:
        "小数点を含む数値リテラルの場合、Swiftは自動的に Double 型を推論します。",
    },
    {
      id: 4,
      title: "問題4: 配列の型推論",
      instruction:
        "次のコードで、変数 'numbers' の型は何になりますか？\n\nvar numbers = [1, 2, 3, 4, 5]",
      hint: "配列リテラルの要素から推論される型を考えてください。",
      options: ["[Any]", "[Int]", "Array", "[Double]"],
      correctAnswer: 1,
      explanation:
        "整数要素を持つ配列リテラルから、Swiftは [Int] 型（Int型の配列）を推論します。",
    },
    {
      id: 5,
      title: "問題5: 辞書の型推論",
      instruction:
        '次のコードで、変数 \'scores\' の型は何になりますか？\n\nvar scores = ["Alice": 95, "Bob": 87]',
      hint: "辞書リテラルのキーと値の型から推論される型を考えてください。",
      options: ["[String: Any]", "[Any: Int]", "[String: Int]", "Dictionary"],
      correctAnswer: 2,
      explanation:
        "文字列キーと整数値を持つ辞書リテラルから、Swiftは [String: Int] 型を推論します。",
    },
    {
      id: 6,
      title: "問題6: ブール値の型推論",
      instruction:
        "次のコードで、変数 'isActive' の型は何になりますか？\n\nvar isActive = true",
      hint: "ブール値リテラルから推論される型を考えてください。",
      options: ["Int", "String", "Bool", "Any"],
      correctAnswer: 2,
      explanation: "ブール値リテラル true から、Swiftは Bool 型を推論します。",
    },
    {
      id: 7,
      title: "問題7: 複雑な型推論",
      instruction:
        "次のコードで、変数 'result' の型は何になりますか？\n\nvar result = 10 + 3.5",
      hint: "異なる数値型の演算結果について考えてください。",
      options: ["Int", "Float", "Double", "String"],
      correctAnswer: 2,
      explanation:
        "Int と Double の演算では、より精度の高い Double 型に統一されるため、result は Double 型になります。",
    },
    {
      id: 8,
      title: "問題8: 型注釈との比較",
      instruction:
        '型推論を使わずに明示的に型を指定する場合、正しいコードはどれですか？\n\n元のコード: var name = "Swift"',
      hint: "型注釈（Type Annotation）を使用して型を明示的に指定してください。",
      options: [
        'var name: String = "Swift"',
        'var name = String("Swift")',
        'var name as String = "Swift"',
        'var name -> String = "Swift"',
      ],
      correctAnswer: 0,
      explanation:
        '型注釈を使用する場合は、変数名の後にコロン（:）と型名を記述します。var name: String = "Swift" が正しい書き方です。',
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
  <title>型推論チャレンジ - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="Swiftの型推論システムを実践的に学習。自動型推論の仕組みと型注釈の使い分けを身に付けよう。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">psychology</i>
      </h1>
      <h2>{problemData.title}</h2>
      <p class="large-text">
        {problemData.description}
      </p>
      <div class="chip secondary">
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
      <div class="instruction-container">
        <pre class="instruction-text">{steps[currentStep].instruction}</pre>
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

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
