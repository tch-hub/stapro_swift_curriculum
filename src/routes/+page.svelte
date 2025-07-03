<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";

  // デバッグ用：ベースパスをコンソールに出力
  console.log("Base path:", base);
  console.log(
    "Current location:",
    typeof window !== "undefined" ? window.location.href : "SSR"
  );

  // 進捗管理のためのリアクティブ変数
  let completedLessons = $state(new Set());
  let isLoaded = $state(false);

  // カリキュラムデータを格納する変数
  let fullCurriculum = $state([]);
  let categoryInfo = $state([]);

  // fullCurriculumからcategoryInfoを動的生成する関数
  function generateCategoryInfo(curriculum) {
    const categoryMap = new Map();

    // 各レッスンのカテゴリを分析
    curriculum.forEach((lesson) => {
      if (!categoryMap.has(lesson.category)) {
        categoryMap.set(lesson.category, {
          name: lesson.category,
          lessons: [],
          color: lesson.color,
          icon: lesson.icon,
          description: `${lesson.category}の学習を通して実践的なスキルを習得します。`,
        });
      }
      categoryMap.get(lesson.category).lessons.push(lesson.lesson);
    });

    // カテゴリ情報を配列に変換
    const generatedCategories = Array.from(categoryMap.values()).map(
      (category) => {
        const sortedLessons = category.lessons.sort((a, b) => a - b);
        const minLesson = sortedLessons[0];
        const maxLesson = sortedLessons[sortedLessons.length - 1];

        return {
          name: category.name,
          lessons:
            minLesson === maxLesson
              ? `第${minLesson}回`
              : `第${minLesson}-${maxLesson}回`,
          count: sortedLessons.length,
          color: category.color,
          icon: category.icon,
          description: category.description,
        };
      }
    );

    return generatedCategories;
  }

  // categoryInfoとfullCurriculumの整合性をチェックする関数
  function validateCategoryInfo(curriculum, categories) {
    const curriculumCategories = new Set(
      curriculum.map((lesson) => lesson.category)
    );
    const categoryInfoNames = new Set(categories.map((cat) => cat.name));

    // カテゴリ名が一致しない場合はfalse
    if (curriculumCategories.size !== categoryInfoNames.size) {
      return false;
    }

    for (let categoryName of curriculumCategories) {
      if (!categoryInfoNames.has(categoryName)) {
        return false;
      }
    }

    // 各カテゴリのレッスン数が一致するかチェック
    for (let category of categories) {
      const actualCount = curriculum.filter(
        (lesson) => lesson.category === category.name
      ).length;
      if (actualCount !== category.count) {
        return false;
      }
    }

    return true;
  }

  // JSONファイルからカリキュラムデータを読み込む
  async function loadCurriculumData() {
    try {
      const response = await fetch(`${base}/curriculum-data.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      fullCurriculum = data.fullCurriculum;

      // categoryInfoが存在し、整合性がある場合はそれを使用
      if (
        data.categoryInfo &&
        data.categoryInfo.length > 0 &&
        validateCategoryInfo(fullCurriculum, data.categoryInfo)
      ) {
        categoryInfo = data.categoryInfo;
        console.log("JSONのcategoryInfoを使用します");
      } else {
        categoryInfo = generateCategoryInfo(fullCurriculum);
        console.log(
          "categoryInfoを動的生成しました（JSONの情報が不一致または存在しません）"
        );
      }

      console.log("カリキュラムデータを読み込みました:", {
        fullCurriculum,
        categoryInfo,
        generatedFromCurriculum:
          !data.categoryInfo || data.categoryInfo.length === 0,
      });
    } catch (error) {
      console.error("カリキュラムデータの読み込みに失敗しました:", error);
      // フォールバック: エラー時は空配列を設定
      fullCurriculum = [];
      categoryInfo = [];
    }
  }

  // ローカルストレージから進捗を読み込む
  function loadProgress() {
    if (typeof window !== "undefined") {
      const savedProgress = localStorage.getItem("swift-curriculum-progress");
      if (savedProgress) {
        try {
          const progressArray = JSON.parse(savedProgress);
          completedLessons = new Set(progressArray);
        } catch (error) {
          console.error("進捗データの読み込みに失敗しました:", error);
          completedLessons = new Set();
        }
      }
      isLoaded = true;
    }
  }

  // ローカルストレージに進捗を保存する
  function saveProgress() {
    if (typeof window !== "undefined") {
      const progressArray = Array.from(completedLessons);
      localStorage.setItem(
        "swift-curriculum-progress",
        JSON.stringify(progressArray)
      );
    }
  }

  // レッスンの完了状態を切り替える
  function toggleLessonCompletion(lessonNumber) {
    if (completedLessons.has(lessonNumber)) {
      completedLessons.delete(lessonNumber);
    } else {
      completedLessons.add(lessonNumber);
    }
    completedLessons = new Set(completedLessons); // リアクティブ更新のため
    saveProgress();
  }

  // 進捗率を計算する
  function getProgressPercentage() {
    return Math.round((completedLessons.size / fullCurriculum.length) * 100);
  }

  // カテゴリごとの進捗を計算する
  function getCategoryProgress(categoryName) {
    const categoryLessons = fullCurriculum.filter(
      (lesson) => lesson.category === categoryName
    );
    const completedInCategory = categoryLessons.filter((lesson) =>
      completedLessons.has(lesson.lesson)
    );
    return {
      completed: completedInCategory.length,
      total: categoryLessons.length,
      percentage: Math.round(
        (completedInCategory.length / categoryLessons.length) * 100
      ),
    };
  }

  // コンポーネントマウント時に進捗とカリキュラムデータを読み込む
  onMount(async () => {
    await loadCurriculumData();
    loadProgress();
  });

  // メインナビゲーションのカードデータ（メインの学習コース）
  const mainCourseCards = [
    {
      id: 1,
      title: "環境構築",
      description: "Swift開発に必要な環境を段階的に構築",
      icon: "build",
      href: `${base}/setup`,
      color: "primary",
      features: [
        "Xcodeのインストール",
        "開発者アカウント設定",
        "プロジェクト作成手順",
        "トラブルシューティング",
      ],
    },
    {
      id: 2,
      title: "チュートリアル",
      description: "Swiftの基本的な文法を実践的に学習",
      icon: "school",
      href: `${base}/tutorial`,
      color: "secondary",
      features: [
        "変数・定数の宣言",
        "データ型と型推論",
        "制御構造",
        "関数・クラス",
      ],
    },
    {
      id: 3,
      title: "実践プロジェクト",
      description: "実際にアプリを作って学習",
      icon: "rocket_launch",
      href: `${base}/projects`,
      color: "tertiary",
      features: [
        "タイマーアプリ作成",
        "段階的な開発手順",
        "SwiftUI活用",
        "実用的なアプリ",
      ],
    },
  ];

  // オプション学習コンテンツ
  const optionalCards = [
    {
      id: 4,
      title: "練習問題",
      description: "コーディング練習で理解を深める",
      icon: "quiz",
      href: `${base}/practice`,
      color: "primary",
      features: [
        "基本構文の練習",
        "段階的な難易度",
        "実践的な問題",
        "解説付き",
      ],
    },
    {
      id: 5,
      title: "チートシート",
      description: "Swiftの構文を素早く確認",
      icon: "description",
      href: `${base}/cheatsheet`,
      color: "primary",
      features: ["構文の早見表", "コード例付き", "分野別整理", "リファレンス"],
    },
  ];
</script>

<svelte:head>
  <title>Stapro Swift Curriculum</title>
  <meta name="description" content="Stapro Swift Curriculum" />
</svelte:head>

<!-- ヒーローセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="">
        <i class="extra primary-text">code</i>
        Swift学習カリキュラム
      </h1>
      <p class="hero-description">
        基本構文から実践的なアプリ開発まで、<br />
        段階的に学習できるカリキュラムです。<br />
        プログラミング未経験でも安心して始められます。
      </p>
      <div class="space"></div>
      <div class="hero-buttons">
        <a href="{base}/setup" class="button large primary">
          <i>play_arrow</i>
          <span>学習を始める</span>
        </a>
        <a href="{base}/tutorial" class="button large transparent primary-text">
          <i>school</i>
          <span>チュートリアル</span>
        </a>
      </div>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- メイン学習コース -->
<section>
  <div class="grid">
    <div class="s12 center-align">
      <h2>メイン学習コース</h2>
      <p class="large-text">
        以下の順序で進めることで、基礎から実践まで体系的に学習できます
      </p>
      <div class="space"></div>
    </div>

    {#each mainCourseCards as card}
      <div class="s12 m6 l4">
        <article class="main-course-card">
          <div class="card-header center-align">
            <i class="large {card.color}-text">{card.icon}</i>
            <h5>{card.title}</h5>
            <p class="medium-text">{card.description}</p>
          </div>

          <div class="space"></div>

          <div class="card-features">
            <ul class="list border">
              {#each card.features as feature}
                <li>{feature}</li>
              {/each}
            </ul>
          </div>

          <div class="space"></div>

          <a href={card.href} class="button {card.color} fill">
            <i>arrow_forward</i>
            <span>開始する</span>
          </a>
        </article>
      </div>
    {/each}
  </div>
</section>

<div class="space"></div>

<!-- オプション学習コンテンツ -->
<section>
  <div class="grid">
    <div class="s12 center-align">
      <h2>オプション学習コンテンツ</h2>
      <p class="large-text">必要に応じて活用できる追加コンテンツです</p>
      <div class="space"></div>
    </div>

    {#each optionalCards as card}
      <div class="s12 m6">
        <article class="optional-card">
          <div class="card-header center-align">
            <i class="large {card.color}-text">{card.icon}</i>
            <h5>{card.title}</h5>
            <p class="medium-text">{card.description}</p>
          </div>

          <div class="space"></div>

          <div class="card-features">
            <ul class="list border">
              {#each card.features as feature}
                <li>{feature}</li>
              {/each}
            </ul>
          </div>

          <div class="space"></div>

          <a href={card.href} class="button {card.color} outline">
            <i>arrow_forward</i>
            <span>確認する</span>
          </a>
        </article>
      </div>
    {/each}
  </div>
</section>

<div class="space"></div>

<!-- 進捗表示セクション -->
{#if isLoaded && fullCurriculum.length > 0}
  <section class="progress-section">
    <div class="grid">
      <div class="s12 center-align">
        <h2>学習進捗</h2>
        <div class="overall-progress">
          <div class="progress-circle">
            <div
              class="circle-progress"
              style="--progress: {getProgressPercentage()}%"
            >
              <span class="progress-text">{getProgressPercentage()}%</span>
            </div>
          </div>
          <p class="progress-summary">
            {completedLessons.size} / {fullCurriculum.length} レッスン完了
          </p>
        </div>
        <div class="space"></div>
      </div>

      <!-- カテゴリ別進捗 -->
      {#each categoryInfo as category}
        {@const categoryProgress = getCategoryProgress(category.name)}
        <div class="s12 m6 l4">
          <article class="category-progress-card">
            <div class="card-header center-align">
              <i class="large {category.color}-text">{category.icon}</i>
              <h6>{category.name}</h6>
              <div class="category-progress-bar">
                <div class="progress-bar">
                  <div
                    class="progress-fill {category.color}"
                    style="width: {categoryProgress.percentage}%"
                  ></div>
                </div>
                <span class="progress-label">
                  {categoryProgress.completed}/{categoryProgress.total} 完了
                </span>
              </div>
            </div>
          </article>
        </div>
      {/each}
    </div>
  </section>
{/if}

<div class="space"></div>

{#if fullCurriculum.length > 0}
  <section>
    <div class="grid">
      <div class="s12 center-align">
        <h2>24回カリキュラム全体構成</h2>
        <p class="large-text">
          全24回の授業で、Swiftの基礎からアプリ開発まで体系的に学習します
        </p>
        <div class="space"></div>
      </div>

      <!-- カテゴリ別概要 -->
      {#each categoryInfo as category}
        <div class="s12 m6 l4">
          <article class="category-overview-card">
            <div class="card-header center-align">
              <i class="large {category.color}-text">{category.icon}</i>
              <h5>{category.name}</h5>
              <p class="category-lessons">{category.lessons}</p>
              <div class="lesson-count">
                <span class="chip {category.color}">
                  {category.count}回の授業
                </span>
              </div>
            </div>
          </article>
        </div>
      {/each}
    </div>
  </section>
{:else}
  <section>
    <div class="grid">
      <div class="s12 center-align">
        <div class="loading">
          <i class="large">hourglass_empty</i>
          <p>カリキュラムデータを読み込み中...</p>
        </div>
      </div>
    </div>
  </section>
{/if}

<div class="space"></div>

{#if fullCurriculum.length > 0}
  <!-- 詳細カリキュラム -->
  <section>
    <div class="grid">
      <div class="s12 center-align">
        <h2>詳細カリキュラム</h2>
        <p class="large-text">
          各回の学習内容（チェックボックスで進捗を管理できます）
        </p>
        <div class="space"></div>
      </div>

      <div class="s12">
        <div class="curriculum-timeline">
          {#each fullCurriculum as lesson}
            <div class="timeline-item">
              <div class="timeline-marker">
                <div class="lesson-number {lesson.color}">
                  {lesson.lesson}
                </div>
              </div>
              <div class="timeline-content">
                {#if completedLessons.has(lesson.lesson)}
                  <!-- 完了済みレッスン（BeerCSS Expansion使用） -->
                  <article>
                    <details>
                      <summary>
                        <div class="row">
                          <label class="checkbox extra">
                            <input
                              type="checkbox"
                              checked={true}
                              onchange={() =>
                                toggleLessonCompletion(lesson.lesson)}
                            />
                            <span></span>
                          </label>
                          <div class="max">
                            <span class="lesson-title-mini">{lesson.title}</span>
                          </div>
                          <i class="summary-arrow">expand_more</i>
                        </div>
                      </summary>
                      <div class="">
                          <div class="row">
                            <button class="chip {lesson.color} s12">{lesson.category}</button>
                            <i class="{lesson.color}-text">{lesson.icon}</i>
                          </div>
                          {#if lesson.description}
                            <p class="">{lesson.description}</p>
                          {/if}
                      </div>
                    </details>
                  </article>
                {:else}
                  <!-- 未完了レッスン（通常表示） -->
                  <article class="grid">
                    <button class="chip {lesson.color} s12">{lesson.category}</button>
                    <nav class="s12">
                      <label class="checkbox extra">
                        <input
                          type="checkbox"
                          checked={false}
                          onchange={() => toggleLessonCompletion(lesson.lesson)}
                        />
                        <span></span>
                      </label>
                      <div class="lesson-info">
                        <h6 class="lesson-title">{lesson.title}</h6>
                      </div>
                      <div class="lesson-icon">
                        <i class="{lesson.color}-text">{lesson.icon}</i>
                      </div>
                    </nav>
                    {#if lesson.description}
                      <p class="s12">{lesson.description}</p>
                    {/if}
                  </article>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>
{/if}

<div class="space"></div>
<section>
  <div class="grid">
    <div class="s12 center-align">
      <h2>このカリキュラムの特徴</h2>
      <div class="space"></div>
    </div>

    <div class="s12 m4">
      <article class="card round feature-card">
        <div class="padding center-align">
          <i class="large primary-text">school</i>
          <h5>段階的学習</h5>
          <p>基礎から応用まで、無理のないペースで学習を進められます。</p>
        </div>
      </article>
    </div>

    <div class="s12 m4">
      <article class="card round feature-card">
        <div class="padding center-align">
          <i class="large secondary-text">build</i>
          <h5>実践重視</h5>
          <p>
            実際にアプリを作りながら学ぶので、実用的なスキルが身につきます。
          </p>
        </div>
      </article>
    </div>
  </div>
</section>

<style>
  .hero-section {
    padding: 4rem 0;
    background: linear-gradient(
      135deg,
      var(--primary-container) 0%,
      var(--secondary-container) 50%,
      var(--tertiary-container) 100%
    );
    border-radius: 1rem;
    margin-bottom: 3rem;
  }

  .hero-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: bold;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .hero-subtitle {
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    font-weight: 500;
    margin-bottom: 1rem;
    color: var(--primary);
  }

  .hero-description {
    font-size: clamp(1rem, 2vw, 1.2rem);
    line-height: 1.6;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .card-features li:before {
    content: "✓";
    color: var(--primary);
    font-weight: bold;
    margin-right: 0.5rem;
  }

  .learning-flow {
    background: linear-gradient(
      135deg,
      var(--primary) 0%,
      var(--secondary) 100%
    );
    border-radius: 1rem;
    padding: 3rem 0;
  }

  .step-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    backdrop-filter: blur(10px);
  }

  .step-number {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    flex-shrink: 0;
  }

  .step-content {
    flex: 1;
  }

  .feature-card {
    transition: transform 0.2s ease;
    height: 100%;
  }

  .main-course-card {
    border: 2px solid var(--primary);
    border-radius: 0.5rem;
  }

  .optional-card {
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    height: 100%;
    border: 1px dashed var(--outline);
    border-radius: 0.5rem;
    padding: 1rem;
    opacity: 0.8;
  }

  /* 24回カリキュラム用スタイル */
  .category-overview-card {
    border: 2px solid var(--outline);
    border-radius: 0.5rem;
    padding: 1.5rem;
    height: 100%;
    transition: transform 0.2s ease;
  }

  .category-overview-card:hover {
    transform: translateY(-2px);
  }

  .category-lessons {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0.5rem 0;
  }

  .lesson-count {
    margin-top: 1rem;
  }

  /* 進捗管理用スタイル */
  .progress-section {
    background: var(--surface-container);
    border-radius: 1rem;
    padding: 2rem 0;
    margin: 2rem 0;
  }

  .overall-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .progress-circle {
    position: relative;
    width: 120px;
    height: 120px;
  }

  .circle-progress {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(
      var(--primary) 0deg,
      var(--primary) calc(var(--progress) * 3.6deg),
      var(--outline-variant) calc(var(--progress) * 3.6deg),
      var(--outline-variant) 360deg
    );
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .circle-progress::before {
    content: "";
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: var(--surface);
    position: absolute;
  }

  .progress-text {
    font-size: 1.5rem;
    font-weight: bold;
    z-index: 1;
    color: var(--primary);
  }

  .progress-summary {
    font-size: 1.1rem;
    margin: 0;
  }

  .category-progress-card {
    border: 1px solid var(--outline-variant);
    border-radius: 0.5rem;
    padding: 1rem;
    height: 100%;
  }

  .category-progress-bar {
    margin-top: 1rem;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--outline-variant);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-label {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  /* チェックボックス用スタイル */
  .lesson-checkbox-container {
    margin-right: 1rem;
  }

  .checkbox-wrapper {
    position: relative;
    cursor: pointer;
    user-select: none;
  }

  .lesson-checkbox {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: relative;
    height: 24px;
    width: 24px;
    border: 2px solid var(--outline);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .checkmark::after {
    content: "✓";
    position: absolute;
    color: white;
    font-size: 14px;
    font-weight: bold;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .lesson-card.completed {
    opacity: 0.8;
    background: var(--success-container);
  }

  /* BeerCSS Expansions用スタイル */
  .completed-lesson {
    background: var(--success-container);
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }

  .completed-summary {
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: background-color 0.2s ease;
  }

  .completed-summary:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .lesson-summary-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .lesson-title-mini {
    font-size: 1rem;
    font-weight: 500;
    opacity: 0.9;
  }

  .summary-arrow {
    transition: transform 0.2s ease;
    color: var(--on-surface-variant);
  }

  .lesson-details-expanded {
    padding: 0 1rem 1rem 1rem;
    border-top: 1px solid var(--outline-variant);
    animation: expandContent 0.3s ease;
  }

  .lesson-expanded-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding-top: 1rem;
  }

  .lesson-icon-container {
    flex-shrink: 0;
  }

  .lesson-icon {
    font-size: 1.5rem;
  }

  @keyframes expandContent {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ローディング表示用スタイル */
  .loading {
    padding: 2rem 0;
    opacity: 0.6;
  }

  .loading i {
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* レッスン詳細説明用スタイル */
  .lesson-description {
    margin-top: 0.75rem;
    font-size: 0.95rem;
    line-height: 1.5;
    opacity: 0.8;
    color: var(--on-surface-variant);
  }

  .completion-badge {
    margin-left: auto;
  }

  .curriculum-timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
  }

  .timeline-item {
    display: flex;
    margin-bottom: 2rem;
    position: relative;
  }

  .timeline-marker {
    flex-shrink: 0;
    margin-right: 1.5rem;
    display: flex;
    align-items: flex-start;
    padding-top: 0.5rem;
  }

  .lesson-number {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    font-size: 1.1rem;
  }

  .lesson-number.primary {
    background-color: var(--primary);
  }

  .lesson-number.secondary {
    background-color: var(--secondary);
  }

  .lesson-number.tertiary {
    background-color: var(--tertiary);
  }

  .timeline-content {
    flex: 1;
  }

  .lesson-card {
    background: var(--surface-container);
    border-radius: 0.5rem;
    padding: 1.5rem;
    border-left: 4px solid var(--primary);
    transition: transform 0.2s ease;
  }

  .lesson-card:hover {
    transform: translateX(5px);
  }

  .lesson-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .lesson-icon {
    flex-shrink: 0;
  }

  .lesson-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .lesson-title {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.4;
  }

  .lesson-category.chip.small {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }

  /* レスポンシブ対応 */
  @media (max-width: 768px) {
    .timeline-item {
      flex-direction: column;
    }

    .timeline-marker {
      margin-right: 0;
      margin-bottom: 1rem;
      justify-content: center;
    }

    .lesson-card {
      padding: 1rem;
    }

    .lesson-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
</style>
