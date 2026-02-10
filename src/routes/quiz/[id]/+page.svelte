<script>
	import { base, resolve } from '$app/paths';
	import { onMount, onDestroy } from 'svelte';

	/** @type {import("./$types").PageData} */
	export let data;

	// 現在の問題インデックス
	let currentQuestionIndex = 0;
	// スコア
	let score = 0;
	// 選択された答え
	let selectedAnswer = null;
	// 答えを表示するかどうか
	let showAnswer = false;
	// ヒントを表示するかどうかとヒント使用フラグ
	let showHint = false;
	let hintUsed = false;
	// 結果表示フラグと直近のスコア情報
	let showResults = false;
	let finalResults = null;
	// ローカルストレージにスコアを保存するためのキー接頭辞
	const scoreStoragePrefix = 'quiz-score-';
	// 問題順をシャッフルしたリスト
	let orderedQuiz = shuffleArray([...data.quizData]);
	// チート検知用: 回答履歴を記録
	let answerHistory = [];
	// チート検知フラグ
	let cheatDetected = false;

	// 追加のチート対策用ステート
	let questionStartTime = 0;
	let blurCount = 0;
	let fastAnswerCount = 0;
	const FAST_ANSWER_THRESHOLD = 800; // ms

	// ハッシュによる改ざん検知
	let salt = '';
	let secureScore = { value: 0, hash: '' };

	onMount(() => {
		questionStartTime = Date.now();
		salt = Math.random().toString(36).substring(7);
		secureScore = { value: 0, hash: generateHash(0, salt) };
		document.addEventListener('visibilitychange', handleVisibilityChange);
	});

	// 簡易的なハッシュ生成関数
	function generateHash(val, saltKey) {
		const str = val + '-' + saltKey;
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash |= 0; // Convert to 32bit integer
		}
		return hash.toString();
	}

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		}
	});

	function handleVisibilityChange() {
		if (document.hidden) {
			blurCount++;
		}
	}

	// 現在の問題を取得
	$: currentQuestion = orderedQuiz[currentQuestionIndex];

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
		const isCorrect = index === shuffledCorrect;
		const earnedPoint = isCorrect && !hintUsed;

		const timeTaken = Date.now() - questionStartTime;
		const isTooFast = timeTaken < FAST_ANSWER_THRESHOLD;

		if (isTooFast) {
			fastAnswerCount++;
		}

		// 回答履歴を記録（チート検知用）
		answerHistory.push({
			questionIndex: currentQuestionIndex,
			isCorrect: isCorrect,
			hintUsed: hintUsed,
			earnedPoint: earnedPoint,
			timeTaken: timeTaken,
			isTooFast: isTooFast,
			timestamp: Date.now()
		});

		if (earnedPoint) {
			score++;
			// セキュアスコアも更新
			secureScore = {
				value: score,
				hash: generateHash(score, salt)
			};
		}
	}

	// チート検知: スコアと回答履歴の整合性をチェック
	function detectCheat() {
		// 履歴から正当に獲得したポイントを計算
		const validScore = answerHistory.filter((h) => h.earnedPoint).length;

		// 現在のスコアが履歴と一致しない場合はチート
		if (score !== validScore) {
			return true;
		}

		// 回答数が問題数より多い場合もチート
		// 回答数が問題数より多い場合もチート
		if (answerHistory.length > orderedQuiz.length) {
			return true;
		}

		// タブ切り替えや高速回答が多すぎる場合もチートとみなす
		// (基準は厳しすぎないように設定: 例 タブ切り替え1回以上 または 高速回答3回以上)
		if (blurCount > 0 || fastAnswerCount > 2) {
			return true;
		}

		// ハッシュ検証: 変数が直接書き換えられていないかチェック
		const currentHash = generateHash(score, salt);
		if (score !== secureScore.value || currentHash !== secureScore.hash) {
			console.warn('Tampering detected: Score mismatch or hash invalid');
			return true;
		}

		return false;
	}

	// 結果をローカルストレージに保存する
	function persistScoreToStorage(finalScore) {
		const key = scoreStoragePrefix + data.sectionId;
		const payload = { highScore: finalScore, lastScore: finalScore, cheated: false };
		if (typeof localStorage === 'undefined') {
			return payload;
		}
		let stored = {};
		const raw = localStorage.getItem(key);
		if (raw) {
			try {
				stored = JSON.parse(raw);
			} catch {
				stored = {};
			}
		}
		payload.highScore = Math.max(stored.highScore ?? 0, finalScore);
		// 正常にクリアした場合は不正フラグをリセット
		payload.cheated = false;
		localStorage.setItem(key, JSON.stringify(payload));
		return payload;
	}

	// 不正スコアをマークする
	function markCheatScore() {
		const key = scoreStoragePrefix + data.sectionId;
		if (typeof localStorage === 'undefined') {
			return { highScore: 0, lastScore: 0, cheated: true };
		}
		let stored = {};
		const raw = localStorage.getItem(key);
		if (raw) {
			try {
				stored = JSON.parse(raw);
			} catch {
				stored = {};
			}
		}
		// 不正フラグを立てて保存
		const payload = {
			highScore: stored.highScore ?? 0,
			lastScore: stored.lastScore ?? 0,
			cheated: true
		};
		localStorage.setItem(key, JSON.stringify(payload));
		return payload;
	}

	// 結果画面を表示する処理
	function completeQuiz() {
		// チート検知を実行
		cheatDetected = detectCheat();

		// チートが検知されなかった場合のみスコアを保存
		if (!cheatDetected) {
			finalResults = persistScoreToStorage(score);
		} else {
			// 不正スコアとしてマーク
			finalResults = markCheatScore();
		}
		showResults = true;
	}

	// 練習問題をリセットする
	function restartQuiz() {
		orderedQuiz = shuffleArray([...data.quizData]);
		currentQuestionIndex = 0;
		score = 0;
		selectedAnswer = null;
		showAnswer = false;
		showHint = false;
		hintUsed = false;
		showResults = false;
		finalResults = null;
		answerHistory = [];
		cheatDetected = false;
		blurCount = 0;
		fastAnswerCount = 0;
		questionStartTime = Date.now();
		salt = Math.random().toString(36).substring(7);
		secureScore = { value: 0, hash: generateHash(0, salt) };
	}

	// 次の問題または結果表示をトリガー
	function handleContinue() {
		if (currentQuestionIndex < orderedQuiz.length - 1) {
			nextQuestion();
			return;
		}
		completeQuiz();
	}

	// 次の問題へ進む関数
	function nextQuestion() {
		selectedAnswer = null;
		showAnswer = false;
		showHint = false;
		hintUsed = false;
		hintUsed = false;
		currentQuestionIndex++;
		questionStartTime = Date.now();
	}
</script>

<div class="container mx-auto p-4" data-base={base}>
	{#if showResults}
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				{#if cheatDetected}
					<div class="mb-4 alert alert-error">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 shrink-0 stroke-current"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>不正な操作が検知されました。スコアは記録されません。</span>
					</div>
					<h2 class="card-title">練習問題の結果</h2>
					<p class="mb-2 text-lg text-error">スコア: 無効（不正検知）</p>
					<p class="mb-2 text-lg text-error">スコア: 無効（不正検知）</p>
					<div class="text-sm text-base-content/70">
						<p>正しく回答してください。</p>
						{#if blurCount > 0}
							<p>・タブの切り替えやウィンドウの非アクティブ化が検知されました。</p>
						{/if}
						{#if fastAnswerCount > 2}
							<p>・回答時間が短すぎるアクションが多数検知されました。</p>
						{/if}
						{#if score !== secureScore.value}
							<p>・スコアデータの整合性が取れません。</p>
						{/if}
					</div>
				{:else}
					<h2 class="card-title">練習問題の結果</h2>
					<p class="mb-2 text-lg">スコア: {score} / {orderedQuiz.length}</p>
					<p class="text-sm text-base-content/70">ハイスコア: {finalResults?.highScore ?? score}</p>
					<p class="text-sm text-base-content/70">
						前回のスコア: {finalResults?.lastScore ?? score}
					</p>
				{/if}
				<div class="card-actions justify-end gap-2">
					<button class="btn btn-primary" onclick={restartQuiz}>もう一度挑戦</button>
					<a href={resolve('/quiz')} class="btn btn-secondary">一覧へ戻る</a>
				</div>
			</div>
		</div>
	{:else}
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				{#if blurCount > 0}
					<div class="mb-2 alert alert-warning py-2 text-sm">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 shrink-0 stroke-current"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						<span
							>注意: 画面から離れたことが検知されました。スコアが無効になる可能性があります。</span
						>
					</div>
				{/if}
				<h2 class="card-title">問題 {currentQuestionIndex + 1} / {orderedQuiz.length}</h2>
				<p class="mb-4 text-lg">{currentQuestion.question}</p>
				<button
					class="btn text-left btn-ghost"
					onclick={() => {
						showHint = true;
						hintUsed = true;
					}}
				>
					{showHint ? currentQuestion.hint : 'ヒントを表示'}
				</button>
				<div class="grid grid-cols-1 gap-2">
					{#each shuffledOptions as option, index (option + '-' + index)}
						<button
							class="btn w-full"
							class:justify-between={showAnswer}
							class:btn-outline={!showAnswer}
							class:btn-success={showAnswer && index === shuffledCorrect}
							class:btn-error={showAnswer && selectedAnswer === index && index !== shuffledCorrect}
							class:pointer-events-none={showAnswer && index !== selectedAnswer}
							aria-disabled={showAnswer && index !== selectedAnswer}
							onclick={() => {
								if (showAnswer && index === selectedAnswer) {
									handleContinue();
									return;
								}
								selectAnswer(index);
							}}
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
					<div class="mt-4 flex gap-2">
						<button class="btn w-full btn-primary" onclick={handleContinue}>
							{currentQuestionIndex < orderedQuiz.length - 1 ? '次の問題' : '結果を見る'}
						</button>
					</div>
				{/if}
			</div>
		</div>
		<div class="mt-4">
			<p>スコア: {score} / {orderedQuiz.length}</p>
		</div>
		<div class="mt-4">
			<a href={resolve('/quiz')} class="btn btn-secondary">戻る</a>
		</div>
	{/if}
</div>
