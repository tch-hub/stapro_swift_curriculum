<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">ステップ8: 最終調整とテスト</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/timer/step7" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/timer" class="btn btn-primary">プロジェクト完了！</a>
	</div>

	<!-- ステップ説明 -->
	<div class="card mb-8 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">このステップで学ぶこと</h2>
			<ul class="list-inside list-disc">
				<li>カスタムButtonコンポーネントの作成</li>
				<li>コードのリファクタリング</li>
				<li>総合的なテスト</li>
				<li>完成したアプリの確認</li>
			</ul>
		</div>
	</div>

	<!-- 手順 -->
	<div class="space-y-6">
		<div>
			<h2 class="mb-4 text-3xl font-bold">1. ColorButtonコンポーネントの作成</h2>
			<p class="mb-4">再利用可能なカスタムボタンコンポーネントを作成します：</p>
			<div class="card mb-6 bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="flex flex-col gap-6 lg:flex-row">
						<div class="flex-1">
							<CodeBlock
								title="ColorButton.swift"
								code={`import SwiftUI

struct ColorButton: View {
    let text: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(text)
                .foregroundStyle(color)
                .font(.subheadline)
        }
        .frame(width: 90, height: 90)
        .background(color.opacity(0.2))
        .clipShape(Circle())
    }
}`}
							/>
							<p class="mt-4 text-sm text-base-content opacity-80">
								ColorButtonは再利用可能な円形ボタンコンポーネントです。text, color,
								actionをパラメータとして受け取り、指定された色で円形のボタンを表示します。
							</p>
						</div>
						<div class="flex flex-1 items-center justify-center">
							<div class="relative">
								<img
									src="{base}/images/timer/button.png"
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
			<h2 class="mb-4 text-3xl font-bold">2. ContentViewのリファクタリング</h2>
			<p class="mb-4">ColorButtonを使ってContentViewを整理します：</p>
			<CodeBlock
				title="ContentView.swift (最終版)"
				code={`import SwiftUI
import AVFAudio

enum TimerState {
    case idle
    case running
    case paused
}

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
            
            HStack(spacing: 130) {
                ColorButton(text: "キャンセル", color: .black, action: viewModel.stopTimer)
                    .opacity(viewModel.timerState == .idle ? 0.3 : 1)
                    .disabled(viewModel.timerState == .idle)
                
                switch viewModel.timerState {
                case .idle:
                    ColorButton(text: "開始", color: .green, action: {
                        viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
                    })
                case .running:
                    ColorButton(text: "一時停止", color: .orange, action: viewModel.pauseTimer)
                case .paused:
                    ColorButton(text: "再開", color: .green, action: viewModel.restartTimer)
                }
            }
        }
        .alert("時間です", isPresented: $viewModel.isShowingAlert) {
            Button("完了") {
                viewModel.isShowingAlert = false
                viewModel.timerState = .idle
                viewModel.audioPlayer?.stop()
            }
        }
    }
}

#Preview {
    ContentView()
        .preferredColorScheme(.dark)
}`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">3. プロジェクト構造の最終確認</h2>
			<p class="mb-4">完成したプロジェクトの構造を確認しましょう：</p>
			<div class="mockup-code mb-6">
				<pre><code
						>Timer/
├── TimerApp.swift
├── ContentView.swift
├── ViewModels/
│   └── TimerViewModel.swift
├── Views/
│   ├── TimeSelectionView.swift
│   └── TimerDisplayView.swift
└── Components/
    ├── ColorButton.swift
    └── TimePicker.swift</code
					></pre>
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">4. 総合テスト</h2>
			<p class="mb-4">アプリのすべての機能をテストしましょう：</p>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="card bg-base-200">
					<div class="card-body">
						<h3 class="card-title">基本機能テスト</h3>
						<ul class="list-inside list-disc">
							<li>時間を設定できるか</li>
							<li>タイマーが開始されるか</li>
							<li>カウントダウンが正確か</li>
							<li>一時停止・再開が動作するか</li>
							<li>キャンセルが動作するか</li>
						</ul>
					</div>
				</div>

				<div class="card bg-base-200">
					<div class="card-body">
						<h3 class="card-title">UIテスト</h3>
						<ul class="list-inside list-disc">
							<li>時間設定ビューが表示されるか</li>
							<li>タイマー表示ビューが表示されるか</li>
							<li>プログレスバーがアニメーションするか</li>
							<li>ボタンの状態が正しく変化するか</li>
							<li>アラートが表示されるか</li>
						</ul>
					</div>
				</div>

				<div class="card bg-base-200">
					<div class="card-body">
						<h3 class="card-title">音声テスト</h3>
						<ul class="list-inside list-disc">
							<li>タイマー終了時に音声が再生されるか</li>
							<li>アラートで音声が停止するか</li>
							<li>音声ファイルが正しく読み込まれるか</li>
						</ul>
					</div>
				</div>

				<div class="card bg-base-200">
					<div class="card-body">
						<h3 class="card-title">エッジケーステスト</h3>
						<ul class="list-inside list-disc">
							<li>0秒のタイマーは動作するか</li>
							<li>長時間（1時間以上）のタイマーは動作するか</li>
							<li>アプリをバックグラウンドにしても動作するか</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">5. 完成したアプリの機能</h2>
			<p class="mb-4">これでタイマーアプリが完成しました！以下の機能を実装できました：</p>
			<ul class="list-inside list-disc space-y-2">
				<li>⏰ 時間設定（時・分・秒）</li>
				<li>▶️ タイマー開始</li>
				<li>⏸️ 一時停止・再開</li>
				<li>⏹️ キャンセル</li>
				<li>🔄 カウントダウン表示</li>
				<li>📊 プログレスバー表示</li>
				<li>🔔 アラーム音声</li>
				<li>⚠️ 完了アラート</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">6. 次のステップ</h2>
			<p class="mb-4">タイマーアプリが完成したら、以下の改善を試してみましょう：</p>
			<ul class="list-inside list-disc space-y-2">
				<li>複数のアラーム音を追加</li>
				<li>タイマーの履歴を保存</li>
				<li>ダークモード対応</li>
				<li>通知機能の追加</li>
				<li>プリセット時間の追加</li>
			</ul>
		</div>
	</div>

	<!-- 完了メッセージ -->
	<div class="mt-12 text-center">
		<div class="card bg-success text-success-content">
			<div class="card-body">
				<h2 class="card-title">🎉 おめでとうございます！</h2>
				<p>タイマーアプリの制作が完了しました！</p>
				<p>SwiftUIの基本的な概念を学び、実際のアプリを作成することができました。</p>
				<div class="mt-4 card-actions justify-center">
					<a href="{base}/project" class="btn btn-primary">他のプロジェクトに挑戦</a>
				</div>
			</div>
		</div>
	</div>
</div>
