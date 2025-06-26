<script>
  import { base } from "$app/paths";

  // 練習問題のデータ
  const problemData = {
    id: 5,
    title: "関数の作成",
    description: "引数と戻り値を持つ関数を作ってみよう",
    difficulty: "上級",
    category: "関数",
  };

  // 練習問題のステップ
  const steps = [
    {
      id: 1,
      title: "問題1: 基本的な関数の定義",
      instruction:
        "\"Hello, World!\" を出力する関数 'sayHello' を定義する正しいコードはどれですか？",
      hint: "Swift では func キーワードを使って関数を定義します。引数がない場合は空の括弧 () を使用します。",
      options: [
        'func sayHello() {\n    print("Hello, World!")\n}',
        'function sayHello() {\n    print("Hello, World!")\n}',
        'def sayHello() {\n    print("Hello, World!")\n}',
        'func sayHello {\n    print("Hello, World!")\n}',
      ],
      correctAnswer: 0,
      explanation:
        "Swift では func キーワードを使用して関数を定義し、引数がない場合でも () を記述する必要があります。",
    },
    {
      id: 2,
      title: "問題2: 引数を持つ関数",
      instruction:
        "名前を受け取って \"こんにちは、[名前]さん\" と出力する関数 'greet' を定義する正しいコードはどれですか？",
      hint: "引数は括弧内に「引数名: 型」の形式で定義します。",
      options: [
        'func greet(name: String) {\n    print("こんにちは、\\(name)さん")\n}',
        'func greet(String name) {\n    print("こんにちは、\\(name)さん")\n}',
        'func greet(name) {\n    print("こんにちは、\\(name)さん")\n}',
        'func greet(_ name: String) {\n    print("こんにちは、" + name + "さん")\n}',
      ],
      correctAnswer: 0,
      explanation:
        "引数は「引数名: 型」の形式で定義し、文字列補間には \\() を使用します。",
    },
    {
      id: 3,
      title: "問題3: 戻り値を持つ関数",
      instruction:
        "二つの整数を受け取ってその合計を返す関数 'add' を定義する正しいコードはどれですか？",
      hint: "戻り値の型は -> を使って指定し、return キーワードで値を返します。",
      options: [
        "func add(a: Int, b: Int) -> Int {\n    return a + b\n}",
        "func add(a: Int, b: Int) {\n    return a + b\n}",
        "func add(a: Int, b: Int) -> Int {\n    a + b\n}",
        "func add(Int a, Int b) -> Int {\n    return a + b\n}",
      ],
      correctAnswer: 0,
      explanation:
        "戻り値の型は -> を使って指定し、return キーワードで明示的に値を返します。",
    },
    {
      id: 4,
      title: "問題4: 複数の引数を持つ関数",
      instruction:
        "名前と年齢を受け取って \"[名前]は[年齢]歳です\" と返す関数 'introduce' を定義する正しいコードはどれですか？",
      hint: "複数の引数はカンマで区切って定義します。戻り値が String の場合は -> String を指定します。",
      options: [
        'func introduce(name: String, age: Int) -> String {\n    return "\\(name)は\\(age)歳です"\n}',
        'func introduce(name: String; age: Int) -> String {\n    return "\\(name)は\\(age)歳です"\n}',
        'func introduce(String name, Int age) -> String {\n    return "\\(name)は\\(age)歳です"\n}',
        'func introduce(name: String, age: Int) {\n    return "\\(name)は\\(age)歳です"\n}',
      ],
      correctAnswer: 0,
      explanation:
        "複数の引数はカンマで区切り、戻り値の型を -> で指定します。文字列補間で値を組み合わせます。",
    },
    {
      id: 5,
      title: "問題5: 外部引数名の使用",
      instruction:
        "外部引数名を使って読みやすくした関数として正しいコードはどれですか？\n関数の機能：二つの数値を受け取って乗算結果を返す",
      hint: "外部引数名を使用すると、関数呼び出し時により読みやすくなります。",
      options: [
        "func multiply(first number1: Int, by number2: Int) -> Int {\n    return number1 * number2\n}",
        "func multiply(number1: Int, number2: Int) -> Int {\n    return number1 * number2\n}",
        "func multiply(_ number1: Int, _ number2: Int) -> Int {\n    return number1 * number2\n}",
        "func multiply(first: Int, by: Int) -> Int {\n    return first * by\n}",
      ],
      correctAnswer: 0,
      explanation:
        "外部引数名を使用すると、関数呼び出し時に multiply(first: 5, by: 3) のように読みやすくなります。",
    },
    {
      id: 6,
      title: "問題6: デフォルト引数値",
      instruction:
        '挨拶する関数で、時間帯のデフォルト値を "おはよう" にする正しいコードはどれですか？',
      hint: "デフォルト値は引数定義時に = を使って指定します。",
      options: [
        'func greetWithTime(name: String, greeting: String = "おはよう") {\n    print("\\(greeting)、\\(name)さん")\n}',
        'func greetWithTime(name: String, greeting: String default "おはよう") {\n    print("\\(greeting)、\\(name)さん")\n}',
        'func greetWithTime(name: String, greeting = "おはよう": String) {\n    print("\\(greeting)、\\(name)さん")\n}',
        'func greetWithTime(name: String, greeting?: String = "おはよう") {\n    print("\\(greeting)、\\(name)さん")\n}',
      ],
      correctAnswer: 0,
      explanation:
        "デフォルト値は引数の型の後に = デフォルト値 の形式で指定します。",
    },
    {
      id: 7,
      title: "問題7: 可変引数の使用",
      instruction:
        "複数の数値を受け取ってその平均値を計算する関数として正しいコードはどれですか？",
      hint: "可変引数は型名の後に ... を付けて定義します。",
      options: [
        "func average(numbers: Double...) -> Double {\n    let sum = numbers.reduce(0, +)\n    return sum / Double(numbers.count)\n}",
        "func average(numbers: [Double]) -> Double {\n    let sum = numbers.reduce(0, +)\n    return sum / Double(numbers.count)\n}",
        "func average(numbers: Double[]) -> Double {\n    let sum = numbers.reduce(0, +)\n    return sum / Double(numbers.count)\n}",
        "func average(...numbers: Double) -> Double {\n    let sum = numbers.reduce(0, +)\n    return sum / Double(numbers.count)\n}",
      ],
      correctAnswer: 0,
      explanation:
        "可変引数は型名の後に ... を付けて定義し、関数内では配列として扱われます。",
    },
    {
      id: 8,
      title: "問題8: inout 引数の使用",
      instruction:
        "二つの変数の値を交換する関数として正しいコードはどれですか？",
      hint: "inout キーワードを使用すると、引数の値を変更できます。",
      options: [
        "func swap(a: inout Int, b: inout Int) {\n    let temp = a\n    a = b\n    b = temp\n}",
        "func swap(a: Int, b: Int) {\n    let temp = a\n    a = b\n    b = temp\n}",
        "func swap(ref a: Int, ref b: Int) {\n    let temp = a\n    a = b\n    b = temp\n}",
        "func swap(var a: Int, var b: Int) {\n    let temp = a\n    a = b\n    b = temp\n}",
      ],
      correctAnswer: 0,
      explanation:
        "inout キーワードを使用すると、関数内で引数の値を変更でき、その変更が呼び出し元に反映されます。",
    },
    {
      id: 9,
      title: "問題9: 関数型の使用",
      instruction:
        "関数を引数として受け取る関数として正しいコードはどれですか？\n機能：数値と操作関数を受け取って結果を返す",
      hint: "関数型は (引数型) -> 戻り値型 の形式で表現します。",
      options: [
        "func calculate(value: Int, operation: (Int) -> Int) -> Int {\n    return operation(value)\n}",
        "func calculate(value: Int, operation: function(Int) -> Int) -> Int {\n    return operation(value)\n}",
        "func calculate(value: Int, operation: func(Int) -> Int) -> Int {\n    return operation(value)\n}",
        "func calculate(value: Int, operation: (Int) => Int) -> Int {\n    return operation(value)\n}",
      ],
      correctAnswer: 0,
      explanation:
        "関数型は (引数型) -> 戻り値型 の形式で表現し、関数を引数として渡すことができます。",
    },
    {
      id: 10,
      title: "問題10: 関数のオーバーロード",
      instruction:
        "同じ名前で異なる引数を持つ関数（オーバーロード）として正しい組み合わせはどれですか？",
      hint: "Swift では同じ関数名でも引数の型や数が異なれば別の関数として定義できます。",
      options: [
        'func process(value: Int) -> String { return "整数: \\(value)" }\nfunc process(value: String) -> String { return "文字列: \\(value)" }',
        'func process(value: Int) -> String { return "整数: \\(value)" }\nfunc process(value: Int) -> Int { return value * 2 }',
        'func process(value: Int) -> String { return "整数: \\(value)" }\nfunc process(number: Int) -> String { return "数値: \\(number)" }',
        'func process(value: Int) -> String { return "整数: \\(value)" }\noverload func process(value: String) -> String { return "文字列: \\(value)" }',
      ],
      correctAnswer: 0,
      explanation:
        "関数のオーバーロードは引数の型が異なる場合に可能です。引数名のみが異なる場合はオーバーロードにはなりません。",
    },
  ];
  let currentStep = $state(0);
  let selectedOption = $state(null);
  let isAnswered = $state(false);
  let isCorrect = $state(false);
  let feedback = $state("");
  let showHint = $state(false);

  // ランダム化用の状態変数
  let shuffledOptions = $state([]);
  let shuffledCorrectAnswer = $state(0);

  // 配列をシャッフルする関数（Fisher-Yates shuffle）
  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  // 現在の問題の選択肢をシャッフルする
  function shuffleCurrentProblem() {
    const currentProblem = steps[currentStep];
    const originalOptions = currentProblem.options;
    const originalCorrectAnswer = currentProblem.correctAnswer;

    // インデックスの配列を作成（0, 1, 2, 3...）
    const indices = originalOptions.map((_, index) => index);
    const shuffledIndices = shuffleArray(indices);

    // シャッフルされたインデックスに基づいて選択肢を再配置
    shuffledOptions = shuffledIndices.map((index) => originalOptions[index]);

    // 正解のインデックスを更新
    shuffledCorrectAnswer = shuffledIndices.indexOf(originalCorrectAnswer);
  }

  // currentStepが変更されたときに自動的にシャッフル
  $effect(() => {
    shuffleCurrentProblem();
  });
  // 選択肢を選択する関数
  function selectOption(optionIndex) {
    if (isAnswered) return;

    selectedOption = optionIndex;
    isAnswered = true;

    const currentProblem = steps[currentStep];
    isCorrect = optionIndex === shuffledCorrectAnswer;

    if (isCorrect) {
      feedback = "正解です！ " + currentProblem.explanation;
    } else {
      feedback =
        "不正解です。正解は「" +
        shuffledOptions[shuffledCorrectAnswer] +
        "」です。" +
        currentProblem.explanation;
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
  <title>関数の作成 - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="Swiftの関数定義を実践的に学習。引数、戻り値、オーバーロードなどの高度な概念を身に付けよう。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">functions</i>
      </h1>
      <h2>{problemData.title}</h2>
      <p class="large-text">
        {problemData.description}
      </p>
      <div class="chip tertiary">
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
      var(--tertiary-container) 0%,
      var(--primary-container) 100%
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
    border-left: 4px solid var(--tertiary);
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
    background: var(--tertiary);
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
    background: var(--tertiary);
    color: var(--on-tertiary);
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
    align-self: flex-start;
    margin-top: 0.5rem;
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
    background: var(--tertiary-container);
    border: 2px solid var(--tertiary);
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
