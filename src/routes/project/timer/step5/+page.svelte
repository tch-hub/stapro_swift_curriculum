<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">ステップ5: ViewModelの作成</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/timer/step4" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/timer/step6" class="btn btn-primary">次のステップ →</a>
	</div>

	<!-- ステップ説明 -->
	<div class="card mb-8 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">このステップで学ぶこと</h2>
			<ul class="list-inside list-disc">
				<li>MVVMアーキテクチャの基本</li>
				<li>ObservableObjectプロトコル</li>
				<li>@Publishedプロパティラッパー</li>
				<li>@StateObjectの使い方</li>
				<li>ビジネスロジックとUIの分離</li>
			</ul>
		</div>
	</div>

	<!-- 手順 -->
	<div class="space-y-6">
		<div>
			<h2 class="mb-4 text-3xl font-bold">1. TimerViewModelの作成</h2>
			<p class="mb-4">タイマーのロジックを管理するViewModelクラスを作成します：</p>
			<CodeBlock
				title="TimerViewModel.swift"
				code={`import SwiftUI

class TimerViewModel: ObservableObject {
    // 公開プロパティ（ビューに変更を通知）
    @Published var remainingTime = 0
    @Published var timerState: TimerState = .idle
    
    // 内部プロパティ
    var timer: Timer?
    var totalTime: Int = 0
    
    // タイマーを開始
    func startTimer(hours: Int, minutes: Int, seconds: Int) {
        remainingTime = hours * 3600 + minutes * 60 + seconds
        totalTime = remainingTime
        timerState = .running
        // 後でcountDownメソッドを追加
    }
    
    // タイマーを停止
    func stopTimer() {
        timerState = .idle
        timer?.invalidate()
    }
    
    // タイマーを一時停止
    func pauseTimer() {
        timerState = .paused
        timer?.invalidate()
    }
    
    // タイマーを再開
    func restartTimer() {
        timerState = .running
        // 後でcountDownメソッドを追加
    }
}`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">2. ObservableObjectについて</h2>
			<p class="mb-4">
				ObservableObjectは、クラスのプロパティ変更をビューに通知するためのプロトコルです：
			</p>
			<ul class="list-inside list-disc space-y-2">
				<li><code>class TimerViewModel: ObservableObject</code>と宣言</li>
				<li><code>@Published</code>がついたプロパティの変更がビューに通知される</li>
				<li>ビューは自動的に再描画される</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">3. @Publishedについて</h2>
			<p class="mb-4">@PublishedはObservableObjectのプロパティに付けて、変更を通知します：</p>
			<CodeBlock
				title="@Publishedの例"
				code={`@Published var remainingTime = 0  // この値が変わるとビューに通知
@Published var timerState: TimerState = .idle  // この値が変わるとビューに通知

var timer: Timer?  // @Publishedがついていないので通知されない`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">4. ContentViewの更新</h2>
			<p class="mb-4">ContentViewでViewModelを使用するように更新します：</p>
			<CodeBlock
				title="ContentView.swift (更新版)"
				code={`import SwiftUI

enum TimerState {
    case idle
    case running
    case paused
}

struct ContentView: View {
    @StateObject var viewModel = TimerViewModel()  // ViewModelを使用
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
                if viewModel.timerState == .idle {
                    Button("開始") {
                        viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
                    }
                    .padding()
                    .background(Color.green)
                    .foregroundColor(.white)
                    .cornerRadius(10)
                } else if viewModel.timerState == .running {
                    Button("一時停止") {
                        viewModel.pauseTimer()
                    }
                    .padding()
                    .background(Color.orange)
                    .foregroundColor(.white)
                    .cornerRadius(10)
                } else if viewModel.timerState == .paused {
                    Button("再開") {
                        viewModel.restartTimer()
                    }
                    .padding()
                    .background(Color.green)
                    .foregroundColor(.white)
                    .cornerRadius(10)
                }
                
                Button("キャンセル") {
                    viewModel.stopTimer()
                }
                .padding()
                .background(Color.gray)
                .foregroundColor(.white)
                .cornerRadius(10)
                .opacity(viewModel.timerState == .idle ? 0.3 : 1)
                .disabled(viewModel.timerState == .idle)
            }
        }
        .padding()
    }
}

#Preview {
    ContentView()
}`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">5. @StateObjectについて</h2>
			<p class="mb-4">
				@StateObjectはObservableObjectをビューで使用するためのプロパティラッパーです：
			</p>
			<ul class="list-inside list-disc space-y-2">
				<li><code>@StateObject var viewModel = TimerViewModel()</code></li>
				<li>ビューのライフサイクルに合わせてViewModelが管理される</li>
				<li>ViewModelの@Publishedプロパティが変わるとビューが再描画される</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">6. MVVMアーキテクチャ</h2>
			<p class="mb-4">MVVM（Model-View-ViewModel）は、UIとロジックを分離する設計パターンです：</p>
			<ul class="list-inside list-disc space-y-2">
				<li><strong>Model</strong>: データとビジネスロジック</li>
				<li><strong>View</strong>: UIの表示（SwiftUIのView）</li>
				<li><strong>ViewModel</strong>: ViewとModelの仲介役</li>
			</ul>
			<p>ViewModelはUIの状態を管理し、Viewにデータを提供します。</p>
		</div>
	</div>

	<!-- 次のステップ -->
	<div class="mt-12 text-center">
		<a href="{base}/project/timer/step6" class="btn btn-lg btn-primary"
			>ステップ6: タイマーロジックの追加へ進む</a
		>
	</div>
</div>
