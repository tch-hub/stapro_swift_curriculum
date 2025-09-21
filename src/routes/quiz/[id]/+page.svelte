<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	/** @type {import('./$types').PageData} */
	export let data;

	// 現在の問題インデックス
	let currentQuestionIndex = 0;
	// スコア
	let score = 0;
	// 選択された答え
	let selectedAnswer = null;
	// 答えを表示するかどうか
	let showAnswer = false;
	// ヒントを表示するかどうか
	let showHint = false;

	// 現在の問題を取得
	$: currentQuestion = data.quizData[currentQuestionIndex];

	// 選択肢をシャッフルする関数
	function shuffleArray(array) {
		const shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}

	// シャッフルされた選択肢と正解インデックス
	$: shuffledOptions = shuffleArray(currentQuestion.options);
	$: shuffledCorrect = shuffledOptions.indexOf(currentQuestion.options[currentQuestion.correct]);

	// 答えを選択する関数
	function selectAnswer(index) {
		selectedAnswer = index;
		showAnswer = true;
		if (index === shuffledCorrect) {
			score++;
		}
	}

	// ヒントを表示する関数
	function toggleHint() {
		showHint = !showHint;
	}

	// 次の問題へ進む関数
	function nextQuestion() {
		selectedAnswer = null;
		showAnswer = false;
		showHint = false;
		if (currentQuestionIndex < data.quizData.length - 1) {
			currentQuestionIndex++;
		} else {
			// クイズ終了
			alert(`クイズ終了！スコア: ${score}/${data.quizData.length}`);
			// リセット
			currentQuestionIndex = 0;
			score = 0;
		}
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Swift 4択問題練習 - 項目 {data.sectionId}</h1>
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">問題 {currentQuestionIndex + 1} / {data.quizData.length}</h2>
			<p class="mb-4 text-lg">{currentQuestion.question}</p>
			<button class="btn mb-4 btn-outline btn-info" onclick={toggleHint}>
				{showHint ? 'ヒントを隠す' : 'ヒントを表示'}
			</button>
			{#if showHint}
				<div class="mb-4 alert alert-info">
					<p>{currentQuestion.hint}</p>
				</div>
			{/if}
			<div class="grid grid-cols-1 gap-2">
				{#each shuffledOptions as option, index}
					<button
						class="btn w-full"
						class:justify-between={showAnswer}
						class:btn-outline={!showAnswer}
						class:btn-success={showAnswer && index === shuffledCorrect}
						class:btn-error={showAnswer && selectedAnswer === index && index !== shuffledCorrect}
						class:pointer-events-none={showAnswer}
						aria-disabled={showAnswer}
						onclick={() => selectAnswer(index)}
					>
						<span>{option}</span>

						{#if showAnswer}
							<span>
								{#if index === shuffledCorrect}
									正解
								{:else if index === selectedAnswer}
									不正解
								{/if}
							</span>
						{/if}
					</button>
				{/each}
			</div>
			{#if showAnswer}
				<div class="mt-4">
					<div class="mt-2 rounded bg-base-200 p-4">
						<p class="text-sm">{currentQuestion.explanation}</p>
					</div>
				</div>
				<button class="btn mt-4 btn-primary" onclick={nextQuestion}>
					{currentQuestionIndex < data.quizData.length - 1 ? '次の問題' : 'クイズをリセット'}
				</button>
			{/if}
		</div>
	</div>
	<div class="mt-4">
		<p>スコア: {score} / {data.quizData.length}</p>
	</div>
	<div class="mt-4">
		<a href="{base}/quiz" class="btn btn-secondary">戻る</a>
	</div>
</div>
