<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import TimerDemo from '$lib/components/TimerDemo.svelte';
	import { timerSteps } from './steps-config';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">タイマーアプリプロジェクト</h1>
	<p class="mb-12 text-center text-lg">
		シンプルなタイマーアプリを作成します。時間設定、カウントダウン、アラーム機能を実装します。
	</p>

	<!-- プロジェクト概要 -->
	<div class="card mb-8 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">プロジェクト概要</h2>
			<p class="mb-4">
				このプロジェクトでは、SwiftUIを使ってタイマーアプリを作成します。以下の機能を学習できます：
			</p>
			<ul class="mb-4 list-inside list-disc">
				<li>SwiftUIでのUI構築</li>
				<li>状態管理（@State, @StateObject）</li>
				<li>タイマーの実装</li>
				<li>アラーム音の再生</li>
				<li>アニメーションの実装</li>
				<li>MVVMアーキテクチャ</li>
			</ul>
			<div class="card-actions justify-end">
				<a href="{base}/source/Timer.zip" download class="btn btn-primary"
					>プロジェクトをダウンロード</a
				>
			</div>
		</div>
	</div>

	<!-- プロジェクト構造 -->
	<div class="mb-8">
		<h2 class="mb-6 text-3xl font-bold">プロジェクト構造</h2>
		<div class="mockup-code">
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

	<!-- ライブデモ -->
	<TimerDemo />

	<!-- 制作ステップ -->
	<div class="mb-8">
		<h2 class="mb-6 text-3xl font-bold">制作ステップ</h2>
		<p class="mb-6">
			タイマーアプリを8つのステップで段階的に作成しましょう。各ステップで必要な知識と実装方法を詳しく説明します。
		</p>

		<div class="space-y-4">
			{#each timerSteps as step}
				<div class="card bg-base-100 shadow-lg">
					<div class="card-body">
						<div class="flex items-center justify-between">
							<div>
								<h3 class="card-title text-xl">{step.title}</h3>
								<p class="text-sm opacity-70">{step.summary}</p>
							</div>
							<a href="{base}/project/timer/{step.id}" class="btn btn-primary">開始</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- コードサンプル -->
	<div class="space-y-8">
		<!-- TimerApp.swift -->
		<CodeBlock
			title="TimerApp.swift - アプリのエントリーポイント"
			code={`//
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
}`}
		/>

		<!-- ContentView.swift -->
		<CodeBlock
			title="ContentView.swift - メインのビュー"
			code={`//
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
}`}
		/>

		<!-- TimerViewModel.swift -->
		<CodeBlock
			title="TimerViewModel.swift - タイマーのロジック"
			code={`//
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
}`}
		/>

		<!-- TimeSelectionView.swift -->
		<CodeBlock
			title="TimeSelectionView.swift - 時間設定ビュー"
			code={`//
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
}`}
		/>

		<!-- TimerDisplayView.swift -->
		<CodeBlock
			title="TimerDisplayView.swift - タイマー表示ビュー"
			code={`//
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
}`}
		/>

		<!-- ColorButton.swift -->
		<CodeBlock
			title="ColorButton.swift - カスタムボタン"
			code={`//
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
}`}
		/>

		<!-- TimePicker.swift -->
		<CodeBlock
			title="TimePicker.swift - 時間選択ピッカー"
			code={`//
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
            ForEach(Array(range), id: \.self) { value in
                Text("\\(value) \\(title)").tag(value)
            }
        }
        .pickerStyle(.wheel)
    }
}`}
		/>
	</div>
</div>
