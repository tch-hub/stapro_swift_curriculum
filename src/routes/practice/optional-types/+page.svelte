<script>
  import { base } from "$app/paths";

  // 練習問題のデータ
  const problemData = {
    id: 6,
    title: "オプショナル型の使用",
    description: "オプショナル型を使った安全なコードを書いてみよう",
    difficulty: "上級",
    category: "オプショナル",
  };

  // 練習問題のステップ
  const steps = [
    {
      id: 1,
      title: "問題1: オプショナル型の宣言",
      instruction:
        "nilの可能性がある文字列変数 'optionalName' を宣言する正しいコードはどれですか？",
      hint: "オプショナル型は型名の後に ? を付けて宣言します。",
      options: [
        "var optionalName: String?",
        "var optionalName: String*",
        "var optionalName: Optional<String>",
        "var optionalName: String | nil",
      ],
      correctAnswer: 0,
      explanation:
        "オプショナル型は型名の後に ? を付けて宣言します。String? は Optional<String> の省略形です。",
    },
    {
      id: 2,
      title: "問題2: nilの代入",
      instruction: "オプショナル変数にnilを代入する正しいコードはどれですか？",
      hint: "オプショナル型の変数にはnilを代入できます。",
      options: [
        "optionalName = nil",
        "optionalName = null",
        "optionalName = none",
        "optionalName = void",
      ],
      correctAnswer: 0,
      explanation:
        "Swift ではnullの代わりにnilを使用してオプショナル型に「値がない」状態を表します。",
    },
    {
      id: 3,
      title: "問題3: 強制アンラップ",
      instruction:
        "オプショナル変数 'optionalAge' の値を強制的に取り出す正しいコードはどれですか？\n（値が存在することが確実な場合）",
      hint: "強制アンラップには ! を使用しますが、値がnilの場合はクラッシュするので注意が必要です。",
      options: [
        "let age = optionalAge!",
        "let age = optionalAge*",
        "let age = unwrap(optionalAge)",
        "let age = optionalAge.value",
      ],
      correctAnswer: 0,
      explanation:
        "強制アンラップは ! を使用しますが、値がnilの場合はランタイムエラーになるため慎重に使用する必要があります。",
    },
    {
      id: 4,
      title: "問題4: オプショナルバインディング",
      instruction:
        "オプショナル変数 'optionalScore' を安全にアンラップするif let文として正しいコードはどれですか？",
      hint: "if let を使用してオプショナル値を安全にアンラップできます。",
      options: [
        'if let score = optionalScore {\n    print("スコア: \\(score)")\n}',
        'if let score = optionalScore! {\n    print("スコア: \\(score)")\n}',
        'if optionalScore != nil {\n    let score = optionalScore\n    print("スコア: \\(score)")\n}',
        'if let score = unwrap(optionalScore) {\n    print("スコア: \\(score)")\n}',
      ],
      correctAnswer: 0,
      explanation:
        "if let を使用することで、オプショナル値がnilでない場合のみアンラップして安全に使用できます。",
    },
    {
      id: 5,
      title: "問題5: guard let文の使用",
      instruction:
        "関数の早期リターンでオプショナル値をチェックするguard let文として正しいコードはどれですか？",
      hint: "guard let は条件が偽の場合に早期リターンする際に使用します。",
      options: [
        'guard let name = optionalName else {\n    return\n}\nprint("名前: \\(name)")',
        'guard optionalName != nil else {\n    return\n}\nprint("名前: \\(optionalName!)")',
        'guard let name = optionalName {\n    print("名前: \\(name)")\n} else {\n    return\n}',
        'if guard let name = optionalName else {\n    return\n}\nprint("名前: \\(name)")',
      ],
      correctAnswer: 0,
      explanation:
        "guard let は条件が偽（nilの場合）にelse節を実行し、真の場合はアンラップした値をそのまま使用できます。",
    },
    {
      id: 6,
      title: "問題6: nil合体演算子",
      instruction:
        "オプショナル値がnilの場合にデフォルト値を使用するnil合体演算子として正しいコードはどれですか？",
      hint: "?? 演算子を使用してnilの場合のデフォルト値を指定できます。",
      options: [
        'let displayName = optionalName ?? "名無し"',
        'let displayName = optionalName || "名無し"',
        'let displayName = optionalName ?? default("名無し")',
        'let displayName = optionalName ? optionalName : "名無し"',
      ],
      correctAnswer: 0,
      explanation:
        "nil合体演算子 ?? を使用して、オプショナル値がnilの場合のデフォルト値を簡潔に指定できます。",
    },
    {
      id: 7,
      title: "問題7: オプショナルチェーン",
      instruction:
        "オプショナルなPersonオブジェクトのnameプロパティに安全にアクセスする正しいコードはどれですか？",
      hint: "オプショナルチェーンには ?. を使用します。",
      options: [
        "let name = optionalPerson?.name",
        "let name = optionalPerson.name?",
        "let name = optionalPerson!!.name",
        "let name = safe(optionalPerson).name",
      ],
      correctAnswer: 0,
      explanation:
        "オプショナルチェーン ?. を使用して、オプショナル値がnilでない場合のみプロパティやメソッドにアクセスできます。",
    },
    {
      id: 8,
      title: "問題8: 暗黙的アンラップオプショナル",
      instruction:
        "初期化後に必ず値を持つことが保証されているオプショナル型として正しい宣言はどれですか？",
      hint: "暗黙的アンラップオプショナルは ! を使用して宣言します。",
      options: [
        "var name: String!",
        "var name: String!!",
        "var name: String?!",
        "var name: auto String?",
      ],
      correctAnswer: 0,
      explanation:
        "暗黙的アンラップオプショナル（!）は初期化後に必ず値を持つことが保証されている場合に使用します。アクセス時に自動的にアンラップされます。",
    },
    {
      id: 9,
      title: "問題9: 複数のオプショナルバインディング",
      instruction:
        "複数のオプショナル値を同時にチェックするif let文として正しいコードはどれですか？",
      hint: "複数のオプショナルバインディングはカンマで区切って記述できます。",
      options: [
        'if let name = optionalName, let age = optionalAge {\n    print("\\(name): \\(age)歳")\n}',
        'if let name = optionalName && let age = optionalAge {\n    print("\\(name): \\(age)歳")\n}',
        'if let name = optionalName; let age = optionalAge {\n    print("\\(name): \\(age)歳")\n}',
        'if let (name, age) = (optionalName, optionalAge) {\n    print("\\(name): \\(age)歳")\n}',
      ],
      correctAnswer: 0,
      explanation:
        "複数のオプショナルバインディングはカンマで区切って記述でき、すべての値がnilでない場合のみif文が実行されます。",
    },
    {
      id: 10,
      title: "問題10: オプショナル型の比較",
      instruction:
        "オプショナル値と通常の値を比較する正しいコードはどれですか？",
      hint: "Swift では一部のオプショナル型と非オプショナル型を直接比較できます。",
      options: [
        'if optionalNumber == 5 {\n    print("値は5です")\n}',
        'if optionalNumber! == 5 {\n    print("値は5です")\n}',
        'if unwrap(optionalNumber) == 5 {\n    print("値は5です")\n}',
        'if compare(optionalNumber, 5) {\n    print("値は5です")\n}',
      ],
      correctAnswer: 0,
      explanation:
        "Swift では多くの場合、オプショナル型と非オプショナル型を直接比較できます。オプショナル値がnilの場合は比較結果がfalseになります。",
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
  <title>オプショナル型の使用 - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="Swiftのオプショナル型を実践的に学習。安全なコードの書き方とnil処理の方法を身に付けよう。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">shield</i>
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
