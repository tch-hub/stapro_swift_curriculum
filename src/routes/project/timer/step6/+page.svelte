<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">ステップ6: タイマーロジックの追加</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/timer/step5" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/timer/step7" class="btn btn-primary">次のステップ →</a>
	</div>

	<!-- ステップ説明 -->
	<div class="card mb-8 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">このステップで学ぶこと</h2>
			<ul class="list-inside list-disc">
				<li>Timer.scheduledTimerの使い方</li>
				<li>非同期処理の基本</li>
				<li>クロージャの使用</li>
				<li>タイマー管理（開始・停止）</li>
			</ul>
		</div>
	</div>

	<!-- 手順 -->
	<div class="space-y-6">
		<div>
			<h2 class="mb-4 text-3xl font-bold">1. countDownメソッドの追加</h2>
			<p class="mb-4">1秒ごとにカウントダウンを行うメソッドを追加します：</p>
			<CodeBlock
				title="TimerViewModel.swift (countDownメソッド追加)"
				code={`import SwiftUI

class TimerViewModel: ObservableObject {
    @Published var remainingTime = 0
    @Published var timerState: TimerState = .idle
    var timer: Timer?
    var totalTime: Int = 0
    
    func startTimer(hours: Int, minutes: Int, seconds: Int) {
        remainingTime = hours * 3600 + minutes * 60 + seconds
        totalTime = remainingTime
        timerState = .running
        countDown()
    }
    
    func stopTimer() {
        timerState = .idle
        timer?.invalidate()
    }
    
    func pauseTimer() {
        timerState = .paused
        timer?.invalidate()
    }
    
    func restartTimer() {
        timerState = .running
        countDown()
    }
    
    // 新しく追加: カウントダウン処理
    func countDown() {
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
            if self.remainingTime > 0 {
                self.remainingTime -= 1
            } else {
                timer.invalidate()
                self.timerState = .idle
                // 後でアラームを追加
            }
        }
    }
}`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">2. Timer.scheduledTimerの説明</h2>
			<p class="mb-4">
				Timer.scheduledTimerは、指定した時間間隔で処理を繰り返すタイマーを作成します：
			</p>
			<CodeBlock
				title="Timer.scheduledTimerの構文"
				code={`Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
    // 1秒ごとに実行される処理
    if self.remainingTime > 0 {
        self.remainingTime -= 1
    } else {
        timer.invalidate()  // タイマーを停止
        self.timerState = .idle
    }
}`}
			/>
			<ul class="mt-4 list-inside list-disc space-y-2">
				<li><code>withTimeInterval: 1</code>: 1秒間隔で実行</li>
				<li><code>repeats: true</code>: 繰り返し実行</li>
				<li><code>{`{ timer in ... }`}</code>: 実行されるクロージャ</li>
				<li><code>timer.invalidate()</code>: タイマーを停止</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">3. クロージャについて</h2>
			<p class="mb-4">クロージャは、実行可能なコードのブロックです：</p>
			<CodeBlock
				title="クロージャの例"
				code={`{ timer in
    // この部分がクロージャ
    if self.remainingTime > 0 {
        self.remainingTime -= 1
    } else {
        timer.invalidate()
        self.timerState = .idle
    }
}`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">4. タイマーの管理</h2>
			<p class="mb-4">タイマーを適切に管理することが重要です：</p>
			<ul class="list-inside list-disc space-y-2">
				<li><code>timer?.invalidate()</code>: タイマーを停止</li>
				<li>新しいタイマーを開始する前に古いタイマーを停止</li>
				<li>メモリリークを防ぐためにタイマーを適切に破棄</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">5. テストしてみましょう</h2>
			<p class="mb-4">ここまで実装したら、実際にタイマーが動作するかテストしてみましょう：</p>
			<ol class="list-inside list-decimal space-y-2">
				<li>時間を設定（例: 0時間 0分 10秒）</li>
				<li>「開始」ボタンをタップ</li>
				<li>タイマーがカウントダウンし始めるか確認</li>
				<li>一時停止・再開・キャンセルが動作するか確認</li>
			</ol>
		</div>
	</div>

	<!-- 次のステップ -->
	<div class="mt-12 text-center">
		<a href="{base}/project/timer/step7" class="btn btn-lg btn-primary"
			>ステップ7: アラーム機能の実装へ進む</a
		>
	</div>
</div>
