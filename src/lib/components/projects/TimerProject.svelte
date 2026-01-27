<script>
	import { base } from '$app/paths';
	import TimerDemo from '$lib/components/TimerDemo.svelte';
	import { timerSteps } from '$lib/data/projects/timer-steps';
	import ProjectSteps from './ProjectSteps.svelte';
	import ProjectCodeSamples from './ProjectCodeSamples.svelte';

	const codeSamples = [
		{
			title: 'TimerApp.swift - アプリのエントリーポイント',
			fileName: 'TimerApp.swift',
			code: `//
//  TimerApp.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/09.
//

import SwiftUI

@main
struct TimerApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}`
		},
		{
			title: 'ContentView.swift - メインのビュー',
			fileName: 'ContentView.swift',
			code: `//
//  ContentView.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/09.
//

import SwiftUI
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
}`
		},
		{
			title: 'TimerViewModel.swift - タイマーのロジック',
			fileName: 'TimerViewModel.swift',
			code: `//
//  TimerViewModel.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/14.
//

import SwiftUI
import Combine
import AVFoundation

class TimerViewModel: ObservableObject {
    @Published var remainingTime = 0
    @Published var timerState: TimerState = .idle
    @Published var isShowingAlert = false
    var audioPlayer: AVAudioPlayer?
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
    
    func playSound() {
        guard let url = Bundle.main.url(forResource: "Alarm", withExtension: "mp3") else {return}
        
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: url)
            audioPlayer?.play()
        } catch {
            print("音声ファイルが再生できませんでした")
        }
    }
    
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
}`
		},
		{
			title: 'TimeSelectionView.swift - 時間設定ビュー',
			fileName: 'TimeSelectionView.swift',
			code: `//
//  TimeSelectionView.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/10.
//

import SwiftUI

struct TimeSelectionView: View {
    @Binding var hours: Int
    @Binding var minutes: Int
    @Binding var seconds: Int
    
    var body: some View {
        HStack {
            TimePicker(title: "時間", range: 0...23, selection: $hours)
            TimePicker(title: "分", range: 0...59, selection: $minutes)
            TimePicker(title: "秒", range: 0...59, selection: $seconds)
        }
    }
}`
		},
		{
			title: 'TimerDisplayView.swift - タイマー表示ビュー',
			fileName: 'TimerDisplayView.swift',
			code: `//
//  TimerDisplayView.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/23.
//

import SwiftUI

struct TimerDisplayView: View {
    var remainingTime: Int
    var totalTime: Int
    
    var completionPercentage: Double {
        return (totalTime > 0) ? (Double(remainingTime) / Double(totalTime)) : 1
    }
    
    var body: some View {
        ZStack {
            Circle()
                .trim(from: 0.0, to: CGFloat(completionPercentage))
                .stroke(style: StrokeStyle(lineWidth: 10, lineCap: .round))
                .foregroundColor(.orange)
                .rotationEffect(Angle(degrees: 270))
                .animation(.linear, value: completionPercentage)
                .padding(10)
            
            Text(formatTime(seconds: remainingTime))
                .font(.system(size: 70))
        }
    }
    
    func formatTime(seconds: Int) -> String {
        let hours = seconds / 3600
        let minutes = (seconds % 3600) / 60
        let seconds = seconds % 60
        return String(format: "%02d:%02d:%02d", hours, minutes, seconds)
    }
}`
		},
		{
			title: 'ColorButton.swift - カスタムボタン',
			fileName: 'ColorButton.swift',
			code: `//
//  ColorButton.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/19.
//

import SwiftUI

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
}`
		},
		{
			title: 'TimePicker.swift - 時間選択ピッカー',
			fileName: 'TimePicker.swift',
			code: `//
//  TimePicker.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/11.
//

import SwiftUI

struct TimePicker: View {
    var title: String
    var range: ClosedRange<Int>
    @Binding var selection: Int
    
    var body: some View {
        Picker(selection: $selection, label: Text(title)) {
            ForEach(Array(range), id: \\.self) { value in
                Text("\\(value) \\(title)").tag(value)
            }
        }
        .pickerStyle(.wheel)
    }
}`
		}
	];
</script>

<div class="container mx-auto max-w-5xl px-4 py-8">
	<div class="mb-12 text-center">
		<h1 class="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
			タイマーアプリプロジェクト
		</h1>
		<p class="mx-auto max-w-2xl text-lg text-base-content/80">
			シンプルなタイマーアプリを作成します。時間設定、カウントダウン、アラーム機能を実装します。
		</p>
	</div>

	<!-- プロジェクト概要 -->
	<section class="mb-16">
		<div class="card overflow-hidden bg-base-100 shadow-xl">
			<div class="card-body p-8 sm:p-10">
				<div class="flex flex-col gap-8 lg:flex-row lg:items-start">
					<div class="flex-1">
						<h2 class="mb-4 text-2xl font-bold">プロジェクト概要</h2>
						<p class="mb-6 leading-relaxed">
							このプロジェクトでは、SwiftUIを使ってタイマーアプリを作成します。以下の機能を学習できます：
						</p>
						<ul class="mb-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
							<li class="flex items-center gap-2">
								<svg
									class="h-5 w-5 text-success"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								SwiftUIでのUI構築
							</li>
							<li class="flex items-center gap-2">
								<svg
									class="h-5 w-5 text-success"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								状態管理（@State, @StateObject）
							</li>
							<li class="flex items-center gap-2">
								<svg
									class="h-5 w-5 text-success"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								タイマーの実装
							</li>
							<li class="flex items-center gap-2">
								<svg
									class="h-5 w-5 text-success"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								アラーム音の再生
							</li>
							<li class="flex items-center gap-2">
								<svg
									class="h-5 w-5 text-success"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								アニメーションの実装
							</li>
							<li class="flex items-center gap-2">
								<svg
									class="h-5 w-5 text-success"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								MVVMアーキテクチャ
							</li>
						</ul>
						<div>
							<a href="{base}/source/Timer.zip" download class="btn btn-primary">
								<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
								プロジェクトをダウンロード
							</a>
						</div>
					</div>
					<div class="flex w-full justify-center lg:w-1/3">
						<TimerDemo />
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- プロジェクト構造 -->
	<section class="mb-16 hidden">
		<!-- Hiding project structure for now as it takes space and might be redundant with code samples? Or keep it? The user wanted less scrolling.
             Let's keep it but maybe compact? Or just put it in a details tag. -->
		<details class="collapse-arrow collapse bg-base-200">
			<summary class="collapse-title text-xl font-medium">プロジェクト構造</summary>
			<div class="collapse-content">
				<div class="mockup-code text-sm">
					<pre><code
							>Timer/
├── TimerApp.swift          # アプリのエントリーポイント
├── ContentView.swift        # メインのビュー
├── ViewModels/
│   └── TimerViewModel.swift # タイマーのロジック
├── Views/
│   ├── TimeSelectionView.swift  # 時間設定ビュー
│   └── TimerDisplayView.swift   # タイマー表示ビュー
└── Components/
    ├── ColorButton.swift    # カスタムボタン
    └── TimePicker.swift     # 時間選択ピッカー</code
						></pre>
				</div>
			</div>
		</details>
	</section>

	<!-- 制作ステップ -->
	<section class="mb-16">
		<h2 class="mb-8 text-3xl font-bold">制作ステップ</h2>
		<p class="mb-8 text-lg text-base-content/80">
			タイマーアプリを8つのステップで段階的に作成しましょう。各ステップで必要な知識と実装方法を詳しく説明します。
		</p>
		<ProjectSteps steps={timerSteps} projectId="timer" />
	</section>

	<!-- コードサンプル -->
	<section class="mb-16">
		<h2 class="mb-8 text-3xl font-bold">完成コード</h2>
		<ProjectCodeSamples {codeSamples} />
	</section>
</div>
