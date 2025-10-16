<script>
	import { onDestroy } from 'svelte';

	// デモ用の勉強時間トラッカー状態
	let subjects = $state([
		{ name: '数学', time: 0, isRunning: false },
		{ name: '英語', time: 0, isRunning: false },
		{ name: '国語', time: 0, isRunning: false }
	]);
	let currentSubject = $state(null);
	let timerInterval = null;
	let newSubjectName = $state('');
	let toastMessage = $state('');

	// タイマーを開始する関数
	function startTimer(subject) {
		// すでに動いているタイマーを停止
		if (currentSubject && currentSubject !== subject) {
			stopTimer(currentSubject);
		}
		currentSubject = subject;
		subject.isRunning = true;
		timerInterval = setInterval(() => {
			subject.time += 1;
			// Svelteのリアクティブ性をトリガーするために再代入
			subjects = [...subjects];
		}, 1000);
	}

	// タイマーを停止する関数
	function stopTimer(subject) {
		if (subject.isRunning) {
			subject.isRunning = false;
			if (currentSubject === subject) {
				if (timerInterval) {
					clearInterval(timerInterval);
					timerInterval = null;
				}
				currentSubject = null;
			}
		}
	}

	// 時間をリセットする関数
	function resetTimer(subject) {
		stopTimer(subject);
		subject.time = 0;
		// Svelteのリアクティブ性をトリガーするために再代入
		subjects = [...subjects];
	}

	// すべての時間をリセットする関数
	function resetAllTimers() {
		// 実行中のタイマーを停止
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
		currentSubject = null;

		// すべての教科の時間をリセット
		subjects = subjects.map((subject) => ({
			...subject,
			time: 0,
			isRunning: false
		}));
	}

	// 新しい教科を追加する関数
	function addSubject() {
		if (newSubjectName.trim() && !subjects.some((s) => s.name === newSubjectName.trim())) {
			subjects = [...subjects, { name: newSubjectName.trim(), time: 0, isRunning: false }];
			toastMessage = `"${newSubjectName.trim()}" を追加しました！`;
			newSubjectName = '';
			// 3秒後にトーストを消す
			setTimeout(() => {
				toastMessage = '';
			}, 3000);
		}
	}

	// 教科を削除する関数
	function removeSubject(subject) {
		if (subject.isRunning) {
			stopTimer(subject);
		}
		subjects = subjects.filter((s) => s !== subject);
	}

	// 時間をフォーマットする関数
	function formatTime(seconds) {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	// コンポーネントが破棄される時にタイマーをクリア
	onDestroy(() => {
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		// すべてのタイマーを停止
		subjects.forEach((subject) => {
			subject.isRunning = false;
		});
		currentSubject = null;
	});
</script>

<div class="card mb-8 bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="mb-4 card-title text-2xl">デモアプリ: 勉強時間トラッカー</h2>
		<p class="mb-6">
			以下は、勉強時間トラッカーのデモです。教科ごとにタイマーを動かして時間を記録できます。
			TimerプロジェクトとTodoListプロジェクトで学んだ知識を応用しています。
		</p>

		<div class="flex justify-center">
			<div class="mockup-phone border-primary">
				<div class="camera"></div>
				<div class="display">
					<div class="artboard artboard-demo phone-1 bg-gradient-to-b from-gray-900 to-black">
						<!-- iOSスタイルのアプリ -->
						<div class="flex h-full flex-col bg-black">
							<!-- メインコンテンツ -->
							<div class="flex-1 overflow-y-auto px-6 py-4">
								<!-- 教科リスト -->
								<div class="mb-6 space-y-3">
									{#each subjects as subject (subject.name)}
										<div class="rounded-2xl border border-gray-700 bg-gray-800 p-4 shadow-lg">
											<div class="flex items-center justify-between">
												<div class="flex-1">
													<span class="font-semibold text-white">{subject.name}</span>
													<div class="mt-1 text-lg font-bold text-blue-400">
														{formatTime(subject.time)}
													</div>
												</div>
												<div class="flex space-x-2">
													{#if subject.isRunning}
														<button
															class="ios-btn ios-btn-stop animate-pulse"
															onclick={() => stopTimer(subject)}
														>
															<span class="text-xs">停止</span>
														</button>
													{:else}
														<button
															class="ios-btn ios-btn-start"
															onclick={() => startTimer(subject)}
															disabled={currentSubject !== null && currentSubject !== subject}
														>
															<span class="text-xs">開始</span>
														</button>
													{/if}
													<button
														class="ios-btn ios-btn-secondary"
														onclick={() => resetTimer(subject)}
													>
														<span class="text-xs">リセット</span>
													</button>
													<button
														class="ios-btn ios-btn-delete"
														onclick={() => removeSubject(subject)}
													>
														<span class="text-xs">削除</span>
													</button>
												</div>
											</div>
										</div>
									{/each}
								</div>

								<!-- 新しい教科を追加 -->
								<div class="mb-6 rounded-2xl border border-gray-700 bg-gray-800 p-4">
									<div class="flex space-x-3">
										<input
											type="text"
											placeholder="新しい教科名を入力"
											class="ios-input flex-1"
											bind:value={newSubjectName}
											onkeydown={(e) => {
												if (e.key === 'Enter') {
													addSubject();
												}
											}}
										/>
										<button
											class="ios-btn ios-btn-add"
											onclick={addSubject}
											disabled={!newSubjectName.trim()}
										>
											<span class="text-xs">追加</span>
										</button>
									</div>
								</div>

								<!-- 合計時間表示 -->
								<div
									class="rounded-2xl border border-gray-200 bg-white p-6 text-center text-black shadow-md transition-all duration-300 hover:shadow-lg"
								>
									<div class="mb-2 text-sm font-medium text-gray-600">今日の合計勉強時間</div>
									<div class="mb-4 text-3xl font-bold text-black transition-all duration-500">
										{formatTime(subjects.reduce((total, subject) => total + subject.time, 0))}
									</div>
									<button class="ios-btn ios-btn-destructive w-full" onclick={resetAllTimers}>
										<span class="text-sm font-medium">すべてリセット</span>
									</button>
								</div>
							</div>

							<!-- ホームインジケーター -->
							<div class="flex justify-center py-2">
								<div class="h-1 w-32 rounded-full bg-gray-600"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- トースト通知 -->
{#if toastMessage}
	<div class="toast-top toast-end toast">
		<div class="alert alert-success">
			<span>{toastMessage}</span>
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";

	/* iOSスタイルのボタン */
	.ios-btn {
		@apply rounded-full px-4 py-2 font-medium transition-all duration-200 active:scale-95;
		min-height: 36px;
		border: none;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.ios-btn:active {
		transform: scale(0.95);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.ios-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.ios-btn-start {
		@apply bg-green-500 text-white hover:bg-green-600;
	}

	.ios-btn-stop {
		@apply bg-red-500 text-white hover:bg-red-600;
	}

	.ios-btn-secondary {
		@apply bg-gray-600 text-white hover:bg-gray-500;
	}

	.ios-btn-add {
		@apply bg-blue-500 text-white hover:bg-blue-600;
	}

	.ios-btn-delete {
		@apply bg-red-400 text-white hover:bg-red-500;
	}

	.ios-btn-destructive {
		@apply bg-red-500 text-white hover:bg-red-600;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	/* iOSスタイルの入力フィールド */
	.ios-input {
		@apply rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-base text-white;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
		transition: all 0.2s ease;
	}

	.ios-input:focus {
		@apply border-blue-400 ring-2 ring-blue-300;
		box-shadow:
			inset 0 1px 3px rgba(0, 0, 0, 0.3),
			0 0 0 3px rgba(59, 130, 246, 0.2);
		outline: none;
	}

	.ios-input::placeholder {
		@apply text-gray-500;
	}
</style>
