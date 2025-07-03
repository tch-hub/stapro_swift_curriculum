<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import QuizQuestion from "$lib/QuizQuestion.svelte";

  // ページロード時に渡される問題ID
  const { data } = $props();
  const problemId = data.problemId;

  // 問題データを格納する変数
  let problemData = $state(null);
  let loading = $state(true);
  let error = $state(null);

  // チートシートデータを格納する変数
  let cheatsheetData = $state(null);
  let relatedCheatsheets = $state([]);

  // 問題の状態管理
  let currentStep = $state(0);
  let showHint = $state(false);
  let showStepNavigation = $state(false);

  // コーディング問題用の状態管理
  let showSampleAnswer = $state(false);
  let showExpectedOutput = $state(false);

  // 各ステップの完了状態を管理
  let stepCompletionStatus = $state([]);

  // 練習問題完了状態
  let isAllCompleted = $state(false);

  // 完了ボタンのローディング状態
  let isCompletingProblem = $state(false);

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

      // チートシートデータも読み込む
      await loadCheatsheetData();

      loading = false;

      // 各ステップの完了状態を初期化
      stepCompletionStatus = Array(problem.steps?.length || 0).fill(false);
    } catch (err) {
      error = err.message;
      loading = false;
    }
  }

  // チートシートデータを読み込む関数
  async function loadCheatsheetData() {
    try {
      const response = await fetch(`${base}/cheatsheet-data.json`);
      if (response.ok) {
        const data = await response.json();
        cheatsheetData = data;
        findRelatedCheatsheets();
      }
    } catch (err) {
      console.warn("チートシートデータの読み込みに失敗しました:", err);
    }
  }

  // 関連するチートシートを見つける関数
  function findRelatedCheatsheets() {
    if (!cheatsheetData || !problemData) return;

    // より詳細なカテゴリマッピング
    const categoryMapping = {
      変数: ["variables"],
      データ型: ["types"],
      基本的な型: ["types"],
      制御構文: ["conditionals", "loops"],
      条件分岐: ["conditionals"],
      繰り返し: ["loops"],
      関数: ["functions"],
      クロージャ: ["closures"],
      コレクション: ["arrays", "dictionaries"],
      配列: ["arrays"],
      辞書: ["dictionaries"],
      クラス: ["classes"],
      構造体: ["classes"],
      "クラス・構造体": ["classes"],
      エラーハンドリング: ["error-handling"],
      非同期処理: ["async"],
      プロトコル: ["protocols"],
      オプショナル: ["optionals"],
      列挙型: ["enums"],
    };

    // 問題カテゴリに対応するチートシートIDを取得
    const relatedSectionIds = categoryMapping[problemData.category] || [];

    // まず完全一致で検索
    let foundSections = cheatsheetData.sections.filter((section) =>
      relatedSectionIds.includes(section.id)
    );

    // 完全一致がない場合は部分一致で検索
    if (foundSections.length === 0) {
      foundSections = cheatsheetData.sections.filter(
        (section) =>
          section.title.includes(problemData.category) ||
          problemData.category.includes(section.title) ||
          section.title
            .toLowerCase()
            .includes(problemData.category.toLowerCase()) ||
          problemData.category
            .toLowerCase()
            .includes(section.title.toLowerCase())
      );
    }

    relatedCheatsheets = foundSections;
  }

  // チートシートを別タブで開く関数
  function openCheatsheet(sectionId = null) {
    const cheatsheetUrl = sectionId
      ? `${base}/cheatsheet#${sectionId}`
      : `${base}/cheatsheet`;
    window.open(cheatsheetUrl, "_blank");
  }

  // QuizQuestion用のコールバック関数
  function handleQuizAnswer(result) {
    // 完了状態を更新
    stepCompletionStatus[currentStep] = true;

    // 全ての問題が完了したかチェック
    checkAllCompleted();
  }

  // ヒント表示切り替え
  function toggleHint() {
    showHint = !showHint;
  }

  // QuizQuestionリセット時のコールバック
  function handleQuizReset() {
    // 完了状態をリセット
    stepCompletionStatus[currentStep] = false;
  }

  function nextStep() {
    if (!problemData || currentStep >= problemData.steps.length - 1) return;

    // コーディング問題の場合は次に進む際に完了済みとしてマークする
    if (isCurrentStepCoding && !stepCompletionStatus[currentStep]) {
      stepCompletionStatus[currentStep] = true;
    }

    currentStep++;
    showHint = false;
    showSampleAnswer = false;
    showExpectedOutput = false;

    // 完了状態をチェック
    checkAllCompleted();
  }

  // 前の問題に戻る
  function previousStep() {
    if (currentStep <= 0) return;

    // 現在のステップがコーディング問題で未完了の場合は完了済みとしてマークする
    if (isCurrentStepCoding && !stepCompletionStatus[currentStep]) {
      stepCompletionStatus[currentStep] = true;
    }

    currentStep--;
    showHint = false;
    showSampleAnswer = false;
    showExpectedOutput = false;

    // 完了状態をチェック
    checkAllCompleted();
  }

  // ヒントの表示切り替え（コーディング問題用）
  function toggleCodingHint() {
    showHint = !showHint;
  }

  // コーディング問題用: サンプル解答の表示切り替え
  function toggleSampleAnswer() {
    showSampleAnswer = !showSampleAnswer;
  }

  // コーディング問題用: 期待される出力の表示切り替え
  function toggleExpectedOutput() {
    showExpectedOutput = !showExpectedOutput;
  }

  // ステップナビゲーションの表示切り替え
  function toggleStepNavigation() {
    showStepNavigation = !showStepNavigation;
  }

  // 特定のステップに移動する関数
  function goToStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= problemData.steps.length) return;

    // 現在のステップがコーディング問題で未完了の場合は完了済みとしてマークする
    if (isCurrentStepCoding && !stepCompletionStatus[currentStep]) {
      stepCompletionStatus[currentStep] = true;
    }

    currentStep = stepIndex;
    showHint = false;
    showStepNavigation = false;
    showSampleAnswer = false;
    showExpectedOutput = false;

    // 完了状態をチェック
    checkAllCompleted();
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

  // 完了状態をチェックする関数
  function checkAllCompleted() {
    if (problemData && problemData.steps) {
      const allCompleted = stepCompletionStatus.every(
        (status) => status === true
      );
      if (allCompleted && !isAllCompleted) {
        isAllCompleted = true;
        // 少し遅延させて表示
        setTimeout(() => {
          // スクロールして完了メッセージを表示
          const completionSection =
            document.getElementById("completion-message");
          if (completionSection) {
            completionSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 500);
      }
    }
  }

  // 現在のステップの進捗
  const progress = $derived(
    problemData && problemData.steps
      ? ((currentStep + 1) / problemData.steps.length) * 100
      : 0
  );

  // 現在のステップがコーディング問題かどうかを判定
  const isCurrentStepCoding = $derived(
    problemData && problemData.steps && problemData.steps[currentStep]
      ? problemData.steps[currentStep].type === "coding"
      : false
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

  <!-- 関連するチートシート -->
  {#if relatedCheatsheets && relatedCheatsheets.length > 0}
    <section>
      <div class="grid">
        <div class="s12">
          <article class="tertiary-container round padding">
            <h6><i>book</i> 関連するチートシート</h6>
            <p class="small">
              この問題に関連する内容を確認できます（別タブで開きます）
            </p>
            <div class="row">
              {#each relatedCheatsheets as cheatsheet}
                <button
                  class="button tertiary small margin"
                  onclick={() => openCheatsheet(cheatsheet.id)}
                  title="チートシート「{cheatsheet.title}」を別タブで開く"
                >
                  <i class="small">{cheatsheet.icon || "book"}</i>
                  <span>{cheatsheet.title}</span>
                  <i class="small">open_in_new</i>
                </button>
              {/each}
              <button
                class="button transparent small margin"
                onclick={() => openCheatsheet()}
                title="チートシート一覧を別タブで開く"
              >
                <i class="small">library_books</i>
                <span>全てのチートシート</span>
                <i class="small">open_in_new</i>
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <div class="space"></div>
  {:else if cheatsheetData}
    <!-- 関連するチートシートが見つからない場合でも、チートシート一覧は表示 -->
    <section>
      <div class="grid">
        <div class="s12">
          <article class="surface-variant round padding">
            <div class="row">
              <div class="max">
                <h6><i>book</i> チートシートで確認</h6>
                <p class="small">チートシートで基本的な内容を確認できます</p>
              </div>
              <div class="min">
                <button
                  class="button tertiary"
                  onclick={() => openCheatsheet()}
                  title="チートシート一覧を別タブで開く"
                >
                  <i>library_books</i>
                  <span>チートシート</span>
                  <i class="small">open_in_new</i>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <div class="space"></div>
  {/if}

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
              class=""
              value={progress}
              max="100"
              title="学習進捗: {Math.round(progress)}%"
            ></progress>
          </article>
          <!-- 問題ナビゲーションボタン -->
          <div class="center-align">
            <div class="space"></div>
            <button class="button transparent" onclick={toggleStepNavigation}>
              <i>list</i>
              <span>問題を選択</span>
            </button>
          </div>
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
                          <div class="small left-align">
                            {#if step.type === "coding"}
                              <i class="small">code</i>
                            {:else}
                              <i class="small">quiz</i>
                            {/if}
                            {step.title}
                          </div>
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
        {#if isCurrentStepCoding}
          <!-- コーディング問題の場合 -->
          <h5 class="primary-text">{problemData.steps[currentStep].title}</h5>
          <article class="surface-variant round padding border-left secondary">
            <pre class="small left-align wrap">{problemData.steps[currentStep]
                .instruction}</pre>
          </article>

          <h6><i>code</i> コーディング課題</h6>
          <div class="space"></div>

          <article class="tertiary-container round padding">
            <h6><i>info</i> 課題の進め方</h6>
            <p class="small">
              1.
              上記の要件を読んで、Xcodeで新しいPlaygroundファイルを作成してください<br
              />
              2. 要件に従ってSwiftコードを記述してください<br />
              3. コードを実行して、期待される出力と一致するか確認してください<br
              />
              4. 分からない場合は、ヒントやサンプル解答を参考にしてください
            </p>
          </article>
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

          <!-- 期待される出力 -->
          {#if showExpectedOutput}
            <article class="primary-container round padding">
              <h6>
                <i>output</i> 期待される出力
              </h6>
              <pre class="small left-align wrap">{problemData.steps[currentStep]
                  .expectedOutput}</pre>
            </article>
            <div class="space"></div>
          {/if}

          <!-- サンプル解答 -->
          {#if showSampleAnswer}
            <article class="error-container round padding">
              <h6>
                <i>code</i> サンプル解答
              </h6>
              <pre class="small left-align wrap">{problemData.steps[currentStep]
                  .sampleAnswer}</pre>
              <div class="space"></div>
              <p class="small">{problemData.steps[currentStep].explanation}</p>
            </article>
            <div class="space"></div>
          {/if}

          <!-- コーディング問題用のアクションボタン -->
          <div class="row">
            <button class="button transparent" onclick={toggleCodingHint}>
              <i>lightbulb</i>
              <span>{showHint ? "ヒントを隠す" : "ヒントを見る"}</span>
            </button>
            <button class="button transparent" onclick={toggleExpectedOutput}>
              <i>output</i>
              <span
                >{showExpectedOutput ? "出力例を隠す" : "期待される出力"}</span
              >
            </button>
            <button
              class="button transparent error-text"
              onclick={toggleSampleAnswer}
            >
              <i>code</i>
              <span
                >{showSampleAnswer ? "解答を隠す" : "サンプル解答を見る"}</span
              >
            </button>
            {#if relatedCheatsheets && relatedCheatsheets.length > 0}
              <button
                class="button transparent tertiary-text"
                onclick={() => openCheatsheet(relatedCheatsheets[0].id)}
                title="関連するチートシートを確認"
              >
                <i>book</i>
                <span>チートシート</span>
                <i class="small">open_in_new</i>
              </button>
            {:else if cheatsheetData}
              <button
                class="button transparent tertiary-text"
                onclick={() => openCheatsheet()}
                title="チートシート一覧を確認"
              >
                <i>library_books</i>
                <span>チートシート</span>
                <i class="small">open_in_new</i>
              </button>
            {/if}
          </div>
        {:else}
          <!-- 選択式問題の場合 -->
          <QuizQuestion
            question={{
              title: problemData.steps[currentStep].title,
              instruction: problemData.steps[currentStep].instruction,
              options: problemData.steps[currentStep].options,
              correctAnswer: problemData.steps[currentStep].correctAnswer,
              explanation: problemData.steps[currentStep].explanation,
              hint: problemData.steps[currentStep].hint,
            }}
            onAnswer={handleQuizAnswer}
            {showHint}
            onToggleHint={toggleHint}
            onReset={handleQuizReset}
          />

          <!-- チートシートボタン -->
          <div class="padding">
            <div class="row">
              {#if relatedCheatsheets && relatedCheatsheets.length > 0}
                <button
                  class="button transparent tertiary-text"
                  onclick={() => openCheatsheet(relatedCheatsheets[0].id)}
                  title="関連するチートシートを確認"
                >
                  <i>book</i>
                  <span>チートシート</span>
                  <i class="small">open_in_new</i>
                </button>
              {:else if cheatsheetData}
                <button
                  class="button transparent tertiary-text"
                  onclick={() => openCheatsheet()}
                  title="チートシート一覧を確認"
                >
                  <i>library_books</i>
                  <span>チートシート</span>
                  <i class="small">open_in_new</i>
                </button>
              {/if}
            </div>
          </div>
        {/if}
      </article>
    </section>

    <div class="space"></div>

    <!-- 全ての問題完了メッセージ -->
    {#if isAllCompleted}
      <section id="completion-message">
        <div class="grid">
          <div class="s12">
            <article class="primary-container center-align round large-padding">
              <div class="row">
                <div class="max">
                  <h4 class="primary-text">
                    <i class="large">celebration</i>
                  </h4>
                  <h5>お疲れ様でした！</h5>
                  <p class="medium">
                    「{problemData.title}」の全ての問題を完了しました。<br />
                    素晴らしい頑張りです！🎉
                  </p>
                  <div class="space"></div>
                  <div class="row">
                    <a href="{base}/practice" class="button primary large">
                      <i>check_circle</i>
                      <span>練習問題一覧に戻る</span>
                    </a>
                    <a
                      href="{base}/projects"
                      class="button secondary large margin"
                    >
                      <i>build</i>
                      <span>プロジェクトに挑戦</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div class="space"></div>
    {/if}

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
              {#if isAllCompleted}
                <!-- 全完了時は完了メッセージエリアへのスクロールボタン -->
                <button
                  class="button primary"
                  onclick={() => {
                    const completionSection =
                      document.getElementById("completion-message");
                    if (completionSection) {
                      completionSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  <i>celebration</i>
                  <span>完了メッセージを見る</span>
                </button>
              {:else if currentStep === problemData.steps.length - 1}
                <button
                  class="button primary"
                  onclick={() => {
                    // 最後の問題でコーディング問題の場合は完了扱いにする
                    if (
                      isCurrentStepCoding &&
                      !stepCompletionStatus[currentStep]
                    ) {
                      isCompletingProblem = true;
                      stepCompletionStatus[currentStep] = true;
                      checkAllCompleted();
                      // 完了後、問題一覧ページに戻る
                      setTimeout(() => {
                        window.location.href = `${base}/practice`;
                      }, 500);
                    }
                  }}
                  disabled={isCompletingProblem}
                >
                  {#if isCompletingProblem}
                    <progress class="circle small"></progress>
                    <span>完了中...</span>
                  {:else}
                    <i>check</i>
                    <span>完了</span>
                  {/if}
                </button>
              {:else}
                <button
                  class="button primary"
                  onclick={nextStep}
                  disabled={!stepCompletionStatus[currentStep] &&
                    !isCurrentStepCoding}
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

  /* 無効化されたボタンのスタイル */
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
