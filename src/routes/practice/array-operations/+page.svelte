<script>
  import { base } from "$app/paths";

  // 練習問題のデータ
  const problemData = {
    id: 4,
    title: "配列の操作",
    description: "配列の要素を追加・削除・検索してみよう",
    difficulty: "中級",
    category: "コレクション",
  };

  // 練習問題のステップ
  const steps = [
    {
      id: 1,
      title: "問題1: 配列の宣言と初期化",
      instruction: "整数を格納する空の配列を宣言する正しいコードはどれですか？",
      hint: "Swift では配列の型を明示的に指定するか、型推論を使用できます。空の配列の場合は型を指定する必要があります。",
      options: [
        "var numbers: [Int] = []",
        "var numbers = []",
        "var numbers: Array = []",
        "var numbers = [Int]()",
      ],
      correctAnswer: 0,
      explanation:
        "空の配列を宣言する場合は型を明示する必要があります。[Int] = [] の形式が最も一般的です。",
    },
    {
      id: 2,
      title: "問題2: 配列への要素追加",
      instruction:
        "配列 'fruits' に \"りんご\" を追加する正しいコードはどれですか？",
      hint: "配列に要素を追加するには append メソッドを使用します。",
      options: [
        'fruits.append("りんご")',
        'fruits.add("りんご")',
        'fruits.push("りんご")',
        'fruits.insert("りんご")',
      ],
      correctAnswer: 0,
      explanation:
        "Swift では配列に要素を追加するために append() メソッドを使用します。",
    },
    {
      id: 3,
      title: "問題3: 特定位置への要素挿入",
      instruction:
        "配列 'colors' のインデックス 1 の位置に \"赤\" を挿入する正しいコードはどれですか？",
      hint: "特定の位置に要素を挿入するには insert メソッドを使用し、位置とアイテムを指定します。",
      options: [
        'colors.insert("赤", at: 1)',
        'colors.insert(1, "赤")',
        'colors.add("赤", at: 1)',
        'colors.append("赤", index: 1)',
      ],
      correctAnswer: 0,
      explanation:
        "特定の位置に要素を挿入するには insert(_:at:) メソッドを使用します。",
    },
    {
      id: 4,
      title: "問題4: 配列要素の取得",
      instruction:
        "配列 'animals' の最初の要素を取得する正しいコードはどれですか？",
      hint: "配列の要素にはインデックスを使用してアクセスできます。最初の要素のインデックスは 0 です。",
      options: [
        "animals[0]",
        "animals.first()",
        "animals.get(0)",
        "animals.at(0)",
      ],
      correctAnswer: 0,
      explanation:
        "配列の要素にアクセスするには角括弧 [] とインデックスを使用します。最初の要素は animals[0] です。",
    },
    {
      id: 5,
      title: "問題5: 配列要素の削除",
      instruction:
        "配列 'items' からインデックス 2 の要素を削除する正しいコードはどれですか？",
      hint: "特定のインデックスの要素を削除するには remove メソッドを使用します。",
      options: [
        "items.remove(at: 2)",
        "items.delete(2)",
        "items.removeAt(2)",
        "items.pop(2)",
      ],
      correctAnswer: 0,
      explanation:
        "特定のインデックスの要素を削除するには remove(at:) メソッドを使用します。",
    },
    {
      id: 6,
      title: "問題6: 配列の要素数取得",
      instruction:
        "配列 'students' の要素数を取得する正しいコードはどれですか？",
      hint: "配列の要素数を取得するプロパティがあります。",
      options: [
        "students.count",
        "students.length",
        "students.size",
        "students.number",
      ],
      correctAnswer: 0,
      explanation: "配列の要素数を取得するには count プロパティを使用します。",
    },
    {
      id: 7,
      title: "問題7: 配列が空かどうかの確認",
      instruction:
        "配列 'tasks' が空かどうかを確認する正しいコードはどれですか？",
      hint: "配列が空かどうかを判定する専用のプロパティがあります。",
      options: [
        "tasks.isEmpty",
        "tasks.count == 0",
        "tasks.empty",
        "tasks.length == 0",
      ],
      correctAnswer: 0,
      explanation:
        "配列が空かどうかを確認するには isEmpty プロパティを使用するのが最も効率的で推奨されます。",
    },
    {
      id: 8,
      title: "問題8: 配列内の要素検索",
      instruction:
        "配列 'names' に \"太郎\" が含まれているかどうかを確認する正しいコードはどれですか？",
      hint: "配列に特定の要素が含まれているかを確認するメソッドがあります。",
      options: [
        'names.contains("太郎")',
        'names.includes("太郎")',
        'names.has("太郎")',
        'names.find("太郎")',
      ],
      correctAnswer: 0,
      explanation:
        "配列に特定の要素が含まれているかを確認するには contains() メソッドを使用します。",
    },
    {
      id: 9,
      title: "問題9: 配列の結合",
      instruction:
        "配列 'array1' と 'array2' を結合する正しいコードはどれですか？",
      hint: "配列を結合するには + 演算子を使用できます。",
      options: [
        "let combined = array1 + array2",
        "let combined = array1.concat(array2)",
        "let combined = array1.merge(array2)",
        "let combined = array1.join(array2)",
      ],
      correctAnswer: 0,
      explanation: "Swift では + 演算子を使用して配列を結合できます。",
    },
    {
      id: 10,
      title: "問題10: 配列要素の繰り返し処理",
      instruction:
        "配列 'scores' の全ての要素を出力するfor-in文として正しいコードはどれですか？",
      hint: "Swift のfor-in文を使用して配列の要素を繰り返し処理できます。",
      options: [
        "for score in scores {\n    print(score)\n}",
        "for (score in scores) {\n    print(score)\n}",
        "for score of scores {\n    print(score)\n}",
        "for i = 0; i < scores.count; i++ {\n    print(scores[i])\n}",
      ],
      correctAnswer: 0,
      explanation:
        "Swift のfor-in文では、for 変数名 in 配列名 の形式で配列の要素を順次処理できます。",
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
  <title>配列の操作 - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="Swiftの配列操作を実践的に学習。要素の追加・削除・検索・繰り返し処理の方法を身に付けよう。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">view_list</i>
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
        <p class="instruction-text">{steps[currentStep].instruction}</p>
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
    font-size: 1rem;
    line-height: 1.5;
    margin: 0;
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
