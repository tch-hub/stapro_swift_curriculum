<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">ステップ7: アラーム機能の実装</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/timer/step6" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/timer/step8" class="btn btn-primary">次のステップ →</a>
	</div>

	<!-- ステップ説明 -->
	<div class="card mb-8 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">このステップで学ぶこと</h2>
			<ul class="list-inside list-disc">
				<li>AVFoundationフレームワークの使用</li>
				<li>AVAudioPlayerでの音声再生</li>
				<li>Alertの表示方法</li>
				<li>アセットファイルの管理</li>
			</ul>
		</div>
	</div>

	<!-- 手順 -->
	<div class="space-y-6">
		<div>
			<h2 class="mb-4 text-3xl font-bold">1. AVFoundationのインポート</h2>
			<p class="mb-4">音声再生のためにAVFoundationフレームワークをインポートします：</p>
			<CodeBlock
				title="TimerViewModel.swift (AVFoundationインポート)"
				code={`import SwiftUI
import Combine
import AVFoundation  // 音声再生のために追加

class TimerViewModel: ObservableObject {
    // ... 既存のプロパティ ...
    @Published var isShowingAlert = false  // アラート表示フラグを追加
    var audioPlayer: AVAudioPlayer?  // 音声プレイヤーを追加
    
    // ... 既存のメソッド ...
    
    // countDownメソッドを更新
    func countDown() {
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
            if self.remainingTime > 0 {
                self.remainingTime -= 1
            } else {
                timer.invalidate()
                self.isShowingAlert = true
                self.playSound()
            }
        }
    }
    
    // 新しく追加: 音声再生メソッド
    func playSound() {
        guard let url = Bundle.main.url(forResource: "Alarm", withExtension: "mp3") else {
            return
        }
        
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: url)
            audioPlayer?.play()
        } catch {
            print("音声ファイルが再生できませんでした")
        }
    }
}`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">2. アラーム音声ファイルの追加</h2>
			<p class="mb-4">Xcodeプロジェクトにアラーム音声ファイルを追加します：</p>
			<ol class="list-inside list-decimal space-y-2">
				<li>
					ダウンロードしたプロジェクトの<code>Alarm.mp3</code>ファイルをXcodeプロジェクトにドラッグ
				</li>
				<li>「Copy items if needed」にチェック</li>
				<li>「Add to targets」でTimerターゲットを選択</li>
				<li>ファイルがAssets.xcassetsに追加される</li>
			</ol>
			<p class="mt-4">
				または、Xcodeで新規ファイルを作成して音声ファイルをインポートすることもできます。
			</p>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">3. AVAudioPlayerについて</h2>
			<p class="mb-4">AVAudioPlayerは、音声ファイルの再生を行うクラスです：</p>
			<CodeBlock
				title="AVAudioPlayerの使用例"
				code={`// 音声ファイルのURLを取得
guard let url = Bundle.main.url(forResource: "Alarm", withExtension: "mp3") else {
    return
}

// AVAudioPlayerを作成して再生
do {
    audioPlayer = try AVAudioPlayer(contentsOf: url)
    audioPlayer?.play()
} catch {
    print("音声ファイルが再生できませんでした")
}`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">4. ContentViewにAlertを追加</h2>
			<p class="mb-4">タイマーが終了したときにアラートを表示します：</p>
			<div class="card mb-6 bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="flex flex-col gap-6 lg:flex-row">
						<div class="flex-1">
							<CodeBlock
								title="ContentView.swift (Alert追加)"
								code={`import AVFAudio
								
struct ContentView: View {
@StateObject var viewModel = TimerViewModel()
@State var hours = 0
@State var minutes = 0
@State var seconds = 0
    
    var body: some View {
        VStack {
            if viewModel.timerState == .idle {
                TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
            } else {
                TimerDisplayView(remainingTime: viewModel.remainingTime, totalTime: viewModel.totalTime)
            }
            
            HStack {
                // ... ボタンのコード ...
            }
        }
        .padding()
        .alert("時間です", isPresented: $viewModel.isShowingAlert) {
            Button("完了") {
                viewModel.isShowingAlert = false
                viewModel.timerState = .idle
                viewModel.audioPlayer?.stop()  // 音声を停止
            }
        }
    }
}`}
							/>
							<p class="mt-4 text-sm text-base-content opacity-80">
								.alert()モディファイアを使ってタイマー終了時にアラートを表示します。アラートには「完了」ボタンを配置し、押すとタイマーをリセットします。
							</p>
						</div>
						<div class="flex flex-1 items-center justify-center">
							<div class="relative">
								<img
									src="{base}/images/timer/t71.png"
									alt="iPhone mockup"
									class="w-full max-w-xs"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">5. Alertについて</h2>
			<p class="mb-4">Alertは、重要なメッセージを表示するためのモーダルダイアログです：</p>
			<CodeBlock
				title="Alertの構文"
				code={`.alert("タイトル", isPresented: $isShowing) {
    Button("ボタン名") {
        // ボタンがタップされた時の処理
    }
}`}
			/>
			<ul class="mt-4 list-inside list-disc space-y-2">
				<li><code>isPresented</code>: アラートを表示するかどうかのBinding</li>
				<li>クロージャ内でボタンを定義</li>
				<li>ボタンがタップされるとアラートが自動的に閉じる</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">6. テストしてみましょう</h2>
			<p class="mb-4">アラーム機能を実装したらテストしてみましょう：</p>
			<ol class="list-inside list-decimal space-y-2">
				<li>短い時間（例: 5秒）を設定</li>
				<li>タイマーを開始</li>
				<li>時間が来たらアラートが表示されるか確認</li>
				<li>音声が再生されるか確認</li>
				<li>「完了」ボタンでアラートが閉じるか確認</li>
			</ol>
		</div>
	</div>

	<!-- 次のステップ -->
	<div class="mt-12 text-center">
		<a href="{base}/project/timer/step8" class="btn btn-lg btn-primary"
			>ステップ8: 最終調整とテストへ進む</a
		>
	</div>
</div>
