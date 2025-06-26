<script>
  import { base } from "$app/paths";

  // 練習問題のデータ
  const problemData = {
    id: 3,
    title: "条件分岐の実装",
    description: "if文を使って条件による処理分岐を作ってみよう",
    difficulty: "中級",
    category: "制御構造",
  };

  // 練習問題のステップ
  const steps = [
    {
      id: 1,
      title: "問題1: 基本的なif文",
      instruction:
        "年齢が18歳以上の場合に「成人です」と出力するif文として正しいコードはどれですか？",
      hint: "if文の条件部分には比較演算子を使います。18歳以上は >= 演算子を使用します。",
      options: [
        'if age >= 18 {\n    print("成人です")\n}',
        'if age > 18 {\n    print("成人です")\n}',
        'if age == 18 {\n    print("成人です")\n}',
        'if (age >= 18) {\n    print("成人です")\n}',
      ],
      correctAnswer: 0,
      explanation:
        "18歳以上という条件は >= 演算子を使用します。Swiftでは条件式を括弧で囲む必要はありません。",
    },
    {
      id: 2,
      title: "問題2: if-else文",
      instruction:
        "点数が60点以上なら「合格」、そうでなければ「不合格」を出力するif-else文として正しいコードはどれですか？",
      hint: "if-else文では、条件が真の場合とそうでない場合の両方の処理を記述します。",
      options: [
        'if score >= 60 {\n    print("合格")\n} else {\n    print("不合格")\n}',
        'if score > 60 {\n    print("合格")\n} else {\n    print("不合格")\n}',
        'if score >= 60 {\n    print("合格")\n}\nelse {\n    print("不合格")\n}',
        'if score == 60 {\n    print("合格")\n} else {\n    print("不合格")\n}',
      ],
      correctAnswer: 0,
      explanation:
        "60点以上は >= 演算子を使用し、else節は同じ行に記述するのが一般的です。",
    },
    {
      id: 3,
      title: "問題3: if-else if-else文",
      instruction:
        "成績を判定するコードです。90点以上は「優」、80点以上は「良」、60点以上は「可」、それ以外は「不可」を出力する正しいコードはどれですか？",
      hint: "複数の条件を順番にチェックするには else if を使用します。条件は上から順に評価されます。",
      options: [
        'if score >= 90 {\n    print("優")\n} else if score >= 80 {\n    print("良")\n} else if score >= 60 {\n    print("可")\n} else {\n    print("不可")\n}',
        'if score >= 60 {\n    print("可")\n} else if score >= 80 {\n    print("良")\n} else if score >= 90 {\n    print("優")\n} else {\n    print("不可")\n}',
        'if score == 90 {\n    print("優")\n} else if score == 80 {\n    print("良")\n} else if score == 60 {\n    print("可")\n} else {\n    print("不可")\n}',
        'if score > 90 {\n    print("優")\n} else if score > 80 {\n    print("良")\n} else if score > 60 {\n    print("可")\n} else {\n    print("不可")\n}',
      ],
      correctAnswer: 0,
      explanation:
        "条件は高い値から順に記述し、>= 演算子を使用して範囲を指定します。90点以上、80点以上、60点以上の順序が重要です。",
    },
    {
      id: 4,
      title: "問題4: 論理演算子 AND",
      instruction:
        "年齢が18歳以上かつ65歳未満の場合に「働き盛りです」と出力するif文として正しいコードはどれですか？",
      hint: "AND条件には && 演算子を使用します。2つの条件が両方とも真の場合に実行されます。",
      options: [
        'if age >= 18 && age < 65 {\n    print("働き盛りです")\n}',
        'if age >= 18 || age < 65 {\n    print("働き盛りです")\n}',
        'if age > 18 && age <= 65 {\n    print("働き盛りです")\n}',
        'if age >= 18 and age < 65 {\n    print("働き盛りです")\n}',
      ],
      correctAnswer: 0,
      explanation:
        "AND条件は && 演算子を使用し、18歳以上（>=）かつ65歳未満（<）の条件を組み合わせます。",
    },
    {
      id: 5,
      title: "問題5: 論理演算子 OR",
      instruction:
        "曜日が「土曜日」または「日曜日」の場合に「休日です」と出力するif文として正しいコードはどれですか？",
      hint: "OR条件には || 演算子を使用します。どちらか一方の条件が真の場合に実行されます。",
      options: [
        'if day == "土曜日" || day == "日曜日" {\n    print("休日です")\n}',
        'if day == "土曜日" && day == "日曜日" {\n    print("休日です")\n}',
        'if day = "土曜日" || day = "日曜日" {\n    print("休日です")\n}',
        'if day == "土曜日" or day == "日曜日" {\n    print("休日です")\n}',
      ],
      correctAnswer: 0,
      explanation:
        "OR条件は || 演算子を使用し、文字列の比較には == 演算子を使用します。",
    },
    {
      id: 6,
      title: "問題6: 論理演算子 NOT",
      instruction:
        "ログインしていない場合に「ログインしてください」と出力するif文として正しいコードはどれですか？",
      hint: "NOT条件には ! 演算子を使用します。条件を否定（逆転）させます。",
      options: [
        'if !isLoggedIn {\n    print("ログインしてください")\n}',
        'if isLoggedIn == false {\n    print("ログインしてください")\n}',
        'if not isLoggedIn {\n    print("ログインしてください")\n}',
        'if isLoggedIn != true {\n    print("ログインしてください")\n}',
      ],
      correctAnswer: 0,
      explanation:
        "Bool型の否定には ! 演算子を使用するのが最もシンプルで推奨されます。",
    },
    {
      id: 7,
      title: "問題7: 三項演算子",
      instruction:
        "年齢が18歳以上なら「大人」、そうでなければ「子供」を変数に代入する三項演算子の正しい使い方はどれですか？",
      hint: "三項演算子は ? と : を使用して、条件 ? 真の場合の値 : 偽の場合の値 という形式で書きます。",
      options: [
        'let category = age >= 18 ? "大人" : "子供"',
        'let category = age >= 18 : "大人" ? "子供"',
        'let category = if age >= 18 "大人" else "子供"',
        'let category = age >= 18 ? "大人" || "子供"',
      ],
      correctAnswer: 0,
      explanation:
        "三項演算子は 条件 ? 真の値 : 偽の値 の形式で、短いif-else文の代替として使用できます。",
    },
    {
      id: 8,
      title: "問題8: switch文の基本",
      instruction:
        "曜日の数値（1-7）に応じて曜日名を出力するswitch文として正しいコードはどれですか？",
      hint: "switch文では各caseの最後にbreakが不要です。Swiftでは自動的にbreakされます。",
      options: [
        'switch dayNumber {\ncase 1:\n    print("月曜日")\ncase 2:\n    print("火曜日")\ndefault:\n    print("無効な曜日")\n}',
        'switch dayNumber {\ncase 1:\n    print("月曜日")\n    break\ncase 2:\n    print("火曜日")\n    break\ndefault:\n    print("無効な曜日")\n}',
        'switch (dayNumber) {\ncase 1:\n    print("月曜日")\ncase 2:\n    print("火曜日")\ndefault:\n    print("無効な曜日")\n}',
        'switch dayNumber {\ncase 1 =>\n    print("月曜日")\ncase 2 =>\n    print("火曜日")\ndefault =>\n    print("無効な曜日")\n}',
      ],
      correctAnswer: 0,
      explanation:
        "Swiftのswitch文では自動的にbreakされるため、明示的にbreakを書く必要はありません。また、switch式を括弧で囲む必要もありません。",
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
  <title>条件分岐の実装 - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="Swiftの条件分岐を実践的に学習。if文、switch文、論理演算子の使い方を身に付けよう。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">alt_route</i>
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
