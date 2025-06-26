<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/CodeBlock.svelte';
	
	// コードコピー機能
	function copyToClipboard(code, buttonId) {
		navigator.clipboard.writeText(code).then(() => {
			const button = document.getElementById(buttonId);
			const originalText = button.innerHTML;
			button.innerHTML = '<i>check</i><span>コピー完了！</span>';
			button.classList.add('tertiary');
			
			setTimeout(() => {
				button.innerHTML = originalText;
				button.classList.remove('tertiary');
			}, 2000);
		});
	}
</script>

<svelte:head>
	<title>Step 8: 最終統合とアラートシステム - Swift学習カリキュラム</title>
	<meta name="description" content="すべてのコンポーネントを統合し、完成度の高いタイマーアプリを完成させます。" />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
	<div class="grid">
		<div class="s12 center-align">
			<h1 class="primary-text">
				<i class="large">integration_instructions</i>
			</h1>
			<h2>Step 8: 最終統合とアラートシステム</h2>
			<p class="large-text">すべてを統合してタイマーアプリを完成させよう</p>
			<div class="space"></div>
			<div class="chip primary">
				<span>Step 8 / 8</span>
			</div>
			<div class="chip secondary">
				<span>統合・完成・UI/UX</span>
			</div>
		</div>
	</div>
</section>

<div class="space"></div>

<!-- 学習目標 -->
<section>
	<h3>このステップで学ぶこと</h3>
	<div class="grid">
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="primary-text">target</i> 学習目標</h6>
				<ul>
					<li>コンポーネントの統合とデバッグ</li>
					<li>ユーザーエクスペリエンスの向上</li>
					<li>アラートとnotificationの実装</li>
					<li>アプリの最終調整とテスト</li>
				</ul>
			</article>
		</div>
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="secondary-text">engineering</i> 完成するもの</h6>
				<ul>
					<li>完全に動作するタイマーアプリ</li>
					<li>ユーザーフレンドリーなUI</li>
					<li>エラーハンドリング機能</li>
					<li>アクセシビリティ対応</li>
				</ul>
			</article>
		</div>
	</div>
</section>

<div class="space"></div>

<!-- 完成版ContentViewの実装 -->
<section>
	<h3>完成版ContentViewの実装</h3>
	<article class="round border padding">
		<h6><i class="primary-text">code</i> 最終版ContentView.swift</h6>
		<p>これまでのステップで作成したすべてのコンポーネントを統合します：</p>
		<div class="space"></div>
		<CodeBlock code={`import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = TimerViewModel()
    @State private var showingSoundSettings = false
    @State private var showingHelp = false

    var body: some View {
        NavigationView {
            VStack(spacing: 25) {
                // ヘッダー
                header

                // メインタイマー表示
                mainTimerDisplay

                // 時間設定（停止中のみ表示）
                if viewModel.currentState == .stopped {
                    timePickerSection
                }

                // コントロールボタン
                controlButtons

                // 設定ボタン
                settingsButtons

                Spacer()
            }
            .padding()
            .background(backgroundGradient)
            .navigationBarHidden(true)
        }
        .navigationViewStyle(StackNavigationViewStyle())
        .sheet(isPresented: $showingSoundSettings) {
            SoundSettingsView(soundManager: viewModel.soundManager)
        }
        .sheet(isPresented: $showingHelp) {
            HelpView()
        }
        .alert("タイマー終了", isPresented: $viewModel.showCompletionAlert) {
            Button("OK") {
                viewModel.stopAlarm()
                viewModel.resetTimer()
            }
            Button("スヌーズ (1分)") {
                viewModel.stopAlarm()
                viewModel.startSnooze(minutes: 1)
            }
        } message: {
            Text("設定された時間が経過しました")
        }
        .onAppear {
            setupApp()
        }
    }

    // MARK: - View Components

    private var header: some View {
        HStack {
            Text("タイマー")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundStyle(.primary)
            
            Spacer()
            
            // ステータス表示
            statusChip
        }
    }
    
    private var statusChip: some View {
        HStack(spacing: 6) {
            Circle()
                .fill(statusColor)
                .frame(width: 8, height: 8)
            
            Text(statusText)
                .font(.caption)
                .fontWeight(.medium)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(statusColor.opacity(0.2))
        .clipShape(Capsule())
    }
    
    private var mainTimerDisplay: some View {
        VStack(spacing: 20) {
            // 円形プログレスバー
            CircularProgressView(
                progress: viewModel.progress,
                centerText: viewModel.formattedTime,
                progressColor: progressColor
            )
            .scaleEffect(viewModel.currentState == .running ? 1.05 : 1.0)
            .animation(.easeInOut(duration: 0.3), value: viewModel.currentState)
            
            // 進捗情報
            if viewModel.currentState != .stopped {
                progressInfo
            }
        }
    }
    
    private var progressInfo: some View {
        VStack(spacing: 8) {
            HStack {
                Text("進捗")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                
                Spacer()
                
                Text("\\(Int(viewModel.progress * 100))%")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundStyle(progressColor)
            }
            
            ProgressView(value: viewModel.progress)
                .progressViewStyle(LinearProgressViewStyle(tint: progressColor))
        }
        .padding(.horizontal)
    }
    
    private var timePickerSection: some View {
        VStack(spacing: 15) {
            Text("時間を設定してください")
                .font(.headline)
                .foregroundStyle(.secondary)
            
            TimePicker(
                hours: $viewModel.selectedHours,
                minutes: $viewModel.selectedMinutes,
                seconds: $viewModel.selectedSeconds
            )
            .transition(.scale.combined(with: .opacity))
        }
        .animation(.easeInOut(duration: 0.3), value: viewModel.currentState)
    }
    
    private var controlButtons: some View {
        HStack(spacing: 20) {
            // メインコントロールボタン
            TimerControlButton(timerState: viewModel.currentState) {
                handleMainButtonTap()
            }
            
            // リセットボタン（必要時のみ表示）
            if viewModel.currentState != .stopped {
                CustomButton(
                    "リセット",
                    icon: "arrow.clockwise",
                    variant: .secondary
                ) {
                    withAnimation {
                        viewModel.resetTimer()
                    }
                }
                .transition(.scale.combined(with: .opacity))
            }
        }
        .animation(.easeInOut(duration: 0.3), value: viewModel.currentState)
    }
    
    private var settingsButtons: some View {
        HStack(spacing: 15) {
            // 音声設定
            IconButton(icon: "speaker.wave.2", variant: .secondary) {
                showingSoundSettings = true
            }
            
            // ヘルプ
            IconButton(icon: "questionmark.circle", variant: .secondary) {
                showingHelp = true
            }
            
            // 通知設定（将来の拡張用）
            IconButton(icon: "bell", variant: .secondary) {
                // 通知設定画面を開く（今回は省略）
            }
        }
    }
    
    // MARK: - Computed Properties
    
    private var statusText: String {
        switch viewModel.currentState {
        case .stopped:
            return "停止中"
        case .running:
            return "実行中"
        case .paused:
            return "一時停止"
        case .finished:
            return "完了"
        }
    }
    
    private var statusColor: Color {
        switch viewModel.currentState {
        case .stopped:
            return .gray
        case .running:
            return .green
        case .paused:
            return .orange
        case .finished:
            return .blue
        }
    }
    
    private var progressColor: Color {
        switch viewModel.progress {
        case 0.0..<0.3:
            return .red
        case 0.3..<0.7:
            return .orange
        default:
            return .green
        }
    }
    
    private var backgroundGradient: some View {
        LinearGradient(
            colors: [
                Color(.systemBackground),
                Color(.systemGray6).opacity(0.3)
            ],
            startPoint: .top,
            endPoint: .bottom
        )
        .ignoresSafeArea()
    }
    
    // MARK: - Methods
    
    private func handleMainButtonTap() {
        withAnimation(.easeInOut(duration: 0.3)) {
            switch viewModel.currentState {
            case .stopped, .paused:
                if isValidTimeSelected() {
                    viewModel.startTimer()
                } else {
                    showTimeSelectionError()
                }
            case .running:
                viewModel.pauseTimer()
            case .finished:
                viewModel.resetTimer()
            }
        }
    }
    
    private func isValidTimeSelected() -> Bool {
        let totalSeconds = viewModel.selectedHours * 3600 + viewModel.selectedMinutes * 60 + viewModel.selectedSeconds
        return totalSeconds > 0
    }
    
    private func showTimeSelectionError() {
        // エラーフィードバック
        let impactFeedback = UIImpactFeedbackGenerator(style: .heavy)
        impactFeedback.impactOccurred()
        
        // TODO: エラーアラートまたはトーストメッセージを表示
    }
    
    private func setupApp() {
        // アプリ起動時の初期設定
        // 必要に応じて設定を読み込む
    }
}

// MARK: - Help View
struct HelpView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    helpSection(
                        title: "基本的な使い方",
                        icon: "timer",
                        content: "1. 時間を設定します\n2. 開始ボタンをタップします\n3. タイマーが完了すると音とバイブレーションでお知らせします"
                    )
                    
                    helpSection(
                        title: "コントロール",
                        icon: "play.circle",
                        content: "• 開始: タイマーを開始します\n• 停止: タイマーを一時停止します\n• リセット: タイマーを初期状態に戻します"
                    )
                    
                    helpSection(
                        title: "音声設定",
                        icon: "speaker.wave.2",
                        content: "設定ボタンから音量やアラーム音を変更できます。複数の音声から選択可能です。"
                    )
                    
                    helpSection(
                        title: "ヒント",
                        icon: "lightbulb",
                        content: "• 画面を閉じてもバックグラウンドで動作します\n• アラーム音は音量ボタンで調整できます\n• スヌーズ機能で1分間延長できます"
                    )
                }
                .padding()
            }
            .navigationTitle("ヘルプ")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("閉じる") {
                        dismiss()
                    }
                }
            }
        }
    }
    
    private func helpSection(title: String, icon: String, content: String) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Image(systemName: icon)
                    .foregroundStyle(.blue)
                    .font(.title2)
                
                Text(title)
                    .font(.headline)
                    .fontWeight(.semibold)
            }
            
            Text(content)
                .font(.body)
                .foregroundStyle(.secondary)
                .lineSpacing(4)
        }
        .padding()
        .background(Color(.systemGray6))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

// MARK: - Preview
#Preview {
    ContentView()
}`} />

	</article>
</section>

<div class="space"></div>

<!-- TimerViewModelの最終更新 -->
<section>
	<h3>TimerViewModelの最終更新</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">update</i> スヌーズ機能とアラート機能の追加</h6>
		<p>TimerViewModelに不足している機能を追加します：</p>
		
		<div class="space"></div>
		
		<CodeBlock code={`// TimerViewModel.swiftに追加するコード
class TimerViewModel: ObservableObject {
    // ...既存のプロパティ...
    
    // アラート表示用のプロパティ
    @Published var showCompletionAlert: Bool = false
    
    // ...既存のメソッド...
    
    // スヌーズ機能
    func startSnooze(minutes: Int = 1) {
        let snoozeTime = TimeInterval(minutes * 60)
        totalTime = snoozeTime
        remainingTime = snoozeTime
        currentState = .running
        
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
            self.updateTimer()
        }
    }
    
    // timerFinishedメソッドを更新
    private func timerFinished() {
        currentState = .finished
        timer?.invalidate()
        timer = nil
        
        // アラーム音を鳴らす
        soundManager.playAlarm()
        
        // アラートを表示
        showCompletionAlert = true
        
        // バイブレーション
        let impactFeedback = UIImpactFeedbackGenerator(style: .heavy)
        impactFeedback.impactOccurred()
        
        // 通知（オプション）
        scheduleLocalNotification()
    }
    
    // ローカル通知の送信
    private func scheduleLocalNotification() {
        let content = UNMutableNotificationContent()
        content.title = "タイマー終了"
        content.body = "設定された時間が経過しました"
        content.sound = .default
        
        let request = UNNotificationRequest(
            identifier: "timer_finished",
            content: content,
            trigger: nil // 即座に表示
        )
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("通知の送信に失敗しました: \(error)")
            }
        }
    }
    
    // 通知権限の要求
    func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(
            options: [.alert, .sound, .badge]
        ) { granted, error in
            DispatchQueue.main.async {
                if granted {
                    print("通知権限が許可されました")
                } else {
                    print("通知権限が拒否されました")
                }
            }
        }
    }
}`} />
	</article>
</section>

<div class="space"></div>

<!-- アプリの初期設定 -->
<section>
	<h3>TimerApp.swiftの最終設定</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">app</i> メインアプリファイルの設定</h6>
		<p>TimerApp.swiftを更新してアプリの初期設定を行います：</p>
		
		<div class="space"></div>
		    <CodeBlock 
      code={`import SwiftUI

@main
struct TimerApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onAppear {
                    setupApp()
                }
        }
    }
    
    private func setupApp() {
        // アプリの初期設定
        configureAppearance()
        requestNotificationPermission()
    }
    
    private func configureAppearance() {
        // ナビゲーションバーの外観設定
        let navBarAppearance = UINavigationBarAppearance()
        navBarAppearance.configureWithOpaqueBackground()
        navBarAppearance.backgroundColor = UIColor.systemBackground
        navBarAppearance.titleTextAttributes = [
            .foregroundColor: UIColor.label,
            .font: UIFont.systemFont(ofSize: 20, weight: .semibold)
        ]
        
        UINavigationBar.appearance().standardAppearance = navBarAppearance
        UINavigationBar.appearance().scrollEdgeAppearance = navBarAppearance
        
        // タブバーの外観設定（将来の拡張用）
        UITabBar.appearance().backgroundColor = UIColor.systemBackground
    }
    
    private func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(
            options: [.alert, .sound, .badge]
        ) { granted, error in
            if let error = error {
                print("通知権限の要求に失敗しました: \(error)")
            }
        }
    }
}`} 
      language="swift" 
    />

	</article>
</section>

<div class="space"></div>

<!-- テストとデバッグ -->
<section>
	<h3>テストとデバッグ</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">bug_report</i> 動作確認項目</h6>
		<p>完成したアプリの動作を確認しましょう：</p>
		
		<div class="space"></div>
		
		<div class="grid">
			<div class="s12 m6">
				<h6>基本機能の確認</h6>
				<ul>
					<li>時間設定が正しく動作する</li>
					<li>タイマーの開始・停止・リセットが動作する</li>
					<li>円形プログレスバーが正しく更新される</li>
					<li>残り時間の表示が正確である</li>
				</ul>
			</div>
			
			<div class="s12 m6">
				<h6>音声・通知の確認</h6>
				<ul>
					<li>アラーム音が正しく再生される</li>
					<li>音量調整が機能する</li>
					<li>バイブレーションが動作する</li>
					<li>完了アラートが表示される</li>
				</ul>
			</div>
		</div>
		
		<div class="space"></div>
		    <CodeBlock 
      code={`// デバッグ用のコード（TimerViewModelに追加）
func debugTimer() {
    print("=== タイマーデバッグ情報 ===")
    print("現在の状態: \(currentState)")
    print("残り時間: \(remainingTime)")
    print("総時間: \(totalTime)")
    print("進捗: \(progress)")
    print("フォーマット済み時間: \(formattedTime)")
    print("========================")
}

// 使用例：ボタンタップ時などに呼び出し
Button("デバッグ") {
    viewModel.debugTimer()
}`} 
      language="swift" 
    />
	</article>
</section>

<div class="space"></div>

<!-- アプリの拡張アイデア -->
<section>
	<h3>さらなる拡張アイデア</h3>
	
	<div class="grid">
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="primary-text">extension</i> 機能拡張</h6>
				<ul>
					<li>複数のタイマーを同時実行</li>
					<li>プリセット時間の保存</li>
					<li>タイマー履歴の記録</li>
					<li>ダークモード・テーマの切り替え</li>
					<li>Apple Watchとの連携</li>
				</ul>
			</article>
		</div>
		
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="secondary-text">integration</i> 他機能との連携</h6>
				<ul>
					<li>Shorcut appとの連携</li>
					<li>Widgets for iOS 14+</li>
					<li>Background App Refresh</li>
					<li>CloudKitでのデータ同期</li>
					<li>VoiceOverアクセシビリティ対応</li>
				</ul>
			</article>
		</div>
	</div>
</section>

<div class="space"></div>

<!-- 学習の振り返り -->
<section>
	<h3>学習の振り返り</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">school</i> このプロジェクトで習得したスキル</h6>
		
		<div class="space"></div>
		
		<div class="grid">
			<div class="s12 m6">
				<h6>Swift言語の知識</h6>
				<ul>
					<li>Enumとswitch文の活用</li>
					<li>ObservableObjectとMVVMパターン</li>
					<li>プロパティラッパー（@Published, @State, @Binding）</li>
					<li>クラスとストラクトの使い分け</li>
				</ul>
			</div>
			
			<div class="s12 m6">
				<h6>SwiftUIの知識</h6>
				<ul>
					<li>カスタムコンポーネントの作成</li>
					<li>アニメーションとトランジション</li>
					<li>レイアウトシステム（VStack, HStack, ZStack）</li>
					<li>ナビゲーションとシート表示</li>
				</ul>
			</div>
			
			<div class="s12 m6">
				<h6>iOS開発の知識</h6>
				<ul>
					<li>AVFoundationでの音声制御</li>
					<li>UserNotificationsでの通知</li>
					<li>ハプティックフィードバック</li>
					<li>Timerクラスでの時間管理</li>
				</ul>
			</div>
			
			<div class="s12 m6">
				<h6>設計パターン</h6>
				<ul>
					<li>MVVM（Model-View-ViewModel）</li>
					<li>Delegate パターン</li>
					<li>Singleton パターン</li>
					<li>コンポーネント指向設計</li>
				</ul>
			</div>
		</div>
	</article>
</section>

<div class="space"></div>

<!-- 完了チェックリスト -->
<section>
	<h3>最終完了チェックリスト</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">checklist</i> 全ステップの確認項目</h6>
		<div class="space"></div>
		
		<label class="checkbox">
			<input type="checkbox">
			<span>すべてのSwiftファイルが正しく作成された</span>
		</label>
		
		<label class="checkbox">
			<input type="checkbox">
			<span>タイマーの基本機能（開始・停止・リセット）が動作する</span>
		</label>
		
		<label class="checkbox">
			<input type="checkbox">
			<span>円形プログレスバーが正しく表示される</span>
		</label>
		
		<label class="checkbox">
			<input type="checkbox">
			<span>音声アラーム機能が動作する</span>
		</label>
		
		<label class="checkbox">
			<input type="checkbox">
			<span>カスタムボタンが正しく表示・動作する</span>
		</label>
		
		<label class="checkbox">
			<input type="checkbox">
			<span>時間選択機能が正常に動作する</span>
		</label>
		
		<label class="checkbox">
			<input type="checkbox">
			<span>設定画面（音声設定・ヘルプ）が表示される</span>
		</label>
		
		<label class="checkbox">
			<input type="checkbox">
			<span>アラートとスヌーズ機能が動作する</span>
		</label>
		
		<label class="checkbox">
			<input type="checkbox">
			<span>アプリのUIが美しく、使いやすい</span>
		</label>
		
		<label class="checkbox">
			<input type="checkbox">
			<span>エラーハンドリングが適切に行われている</span>
		</label>
	</article>
</section>

<div class="space"></div>

<!-- おめでとうメッセージ -->
<section>
	<div class="primary-container round padding center-align">
		<h3 class="">🎉 おめでとうございます！ 🎉</h3>
		<div class="space"></div>
		<p class=" large-text">
			タイマーアプリが完成しました！<br>
			あなたは本格的なiOSアプリ開発のスキルを身につけました。
		</p>
		<div class="space"></div>
		<p class="">
			このプロジェクトで学んだ知識を活用して、さらに高度なアプリにチャレンジしてみてください。
		</p>
	</div>
</section>

<div class="space"></div>

<!-- ナビゲーション -->
<section>
	<div class="grid">
		<div class="s6">
			<a href="{base}/projects/timer/step7" class="button transparent primary-text">
				<i>arrow_back</i>
				<span>Step 7に戻る</span>
			</a>
		</div>
		<div class="s6 right-align">
			<a href="{base}/projects" class="button success">
				<span>他のプロジェクトを見る</span>
				<i>arrow_forward</i>
			</a>
		</div>
	</div>
	
	<div class="space"></div>
	
	<div class="center-align">
		<a href="{base}/projects/timer" class="button transparent secondary-text">
			<i>list</i>
			<span>タイマープロジェクト概要に戻る</span>
		</a>
	</div>
</section>

<style>
	.hero-section {
		padding: 3rem 0;
		background: linear-gradient(135deg, var(--primary-container) 0%, var(--secondary-container) 100%);
		border-radius: 1rem;
		margin-bottom: 2rem;
	}
	
	.large-text {
		font-size: 1.2rem;
		line-height: 1.6;
	}
	

	

	
	.checkbox {
		display: block;
		margin: 0.5rem 0;
	}
	
	ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}
	
	li {
		margin: 0.25rem 0;
	}
</style>
