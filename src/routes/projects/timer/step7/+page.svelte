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
	<title>Step 7: 音声アラーム機能の実装 - Swift学習カリキュラム</title>
	<meta name="description" content="AVFoundationを使って音声アラーム機能を実装し、タイマー終了時に音を鳴らす機能を追加します。" />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
	<div class="grid">
		<div class="s12 center-align">
			<h1 class="primary-text">
				<i class="large">volume_up</i>
			</h1>
			<h2>Step 7: 音声アラーム機能の実装</h2>
			<p class="large-text">AVFoundationで音声アラーム機能を実装しよう</p>
			<div class="space"></div>
			<div class="chip primary">
				<span>Step 7 / 8</span>
			</div>
			<div class="chip secondary">
				<span>AVFoundation・音声</span>
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
					<li>AVFoundationフレームワークの基本</li>
					<li>AVAudioPlayerクラスの使い方</li>
					<li>音声ファイルの再生と停止</li>
					<li>システム音とカスタム音の使い分け</li>
				</ul>
			</article>
		</div>
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="secondary-text">engineering</i> 実装するもの</h6>
				<ul>
					<li>音声再生マネージャー</li>
					<li>複数のアラーム音</li>
					<li>音量調整機能</li>
					<li>タイマー終了時の音声通知</li>
				</ul>
			</article>
		</div>
	</div>
</section>

<div class="space"></div>

<!-- AVFoundationの基本 -->
<section>
	<h3>AVFoundationフレームワーク</h3>
	<p>AVFoundationは、Appleが提供する音声・動画の再生と録音を行うためのフレームワークです。</p>
	
	<div class="space"></div>
	
	<div class="grid">
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="primary-text">library_music</i> AVAudioPlayer</h6>
				<p class="small-text">音声ファイルの再生を行うメインクラス</p>
				<ul class="small-text">
					<li>MP3、WAV、AAC等の形式をサポート</li>
					<li>音量、再生速度の調整が可能</li>
					<li>ループ再生機能</li>
				</ul>
			</article>
		</div>
		
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="secondary-text">settings</i> AVAudioSession</h6>
				<p class="small-text">音声セッションの管理を行うクラス</p>
				<ul class="small-text">
					<li>他のアプリとの音声共有設定</li>
					<li>バックグラウンド再生の制御</li>
					<li>音声カテゴリの設定</li>
				</ul>
			</article>
		</div>
	</div>
</section>

<div class="space"></div>

<!-- SoundManagerの作成 -->
<section>
	<h3>SoundManagerの実装</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">add</i> 新しいファイルを作成</h6>
		<p>Servicesフォルダに新しいSwiftファイルを作成します：</p>
		<ol>
			<li>Xcodeのプロジェクトナビゲーターでプロジェクトを右クリック</li>
			<li>「New Group」を選択し、「Services」という名前のフォルダを作成</li>
			<li>「Services」フォルダ内で「New File...」を選択</li>
			<li>「Swift File」を選択し、ファイル名を「SoundManager.swift」に設定</li>
		</ol>
	</article>
</section>

<div class="space"></div>

<!-- SoundManager.swiftの実装 -->
<section>
	<h3>SoundManager.swiftの実装</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">code</i> SoundManager.swift</h6>
		<p>以下のコードを新しく作成したSoundManager.swiftファイルに入力してください：</p>
		
		<div class="space"></div>
		
		<CodeBlock code={`import AVFoundation
import UIKit

// アラーム音の種類を定義
enum AlarmSound: String, CaseIterable {
    case classic = "classic_alarm"
    case gentle = "gentle_bell"
    case digital = "digital_beep"
    case nature = "nature_chime"
    case system = "system_sound"
    
    var displayName: String {
        switch self {
        case .classic:
            return "クラシック"
        case .gentle:
            return "やさしいベル"
        case .digital:
            return "デジタルビープ"
        case .nature:
            return "自然のチャイム"
        case .system:
            return "システム音"
        }
    }
    
    var fileName: String? {
        switch self {
        case .system:
            return nil // システム音は音声ファイル不要
        default:
            return self.rawValue
        }
    }
}

// 音声管理クラス
class SoundManager: ObservableObject {
    // MARK: - Properties
    @Published var currentVolume: Float = 0.8
    @Published var selectedAlarmSound: AlarmSound = .classic
    @Published var isPlaying: Bool = false
    
    private var audioPlayer: AVAudioPlayer?
    private var audioSession = AVAudioSession.sharedInstance()
    
    // MARK: - Initialization
    init() {
        setupAudioSession()
    }
    
    // MARK: - Audio Session Setup
    private func setupAudioSession() {
        do {
            // 音声セッションのカテゴリを設定
            try audioSession.setCategory(.playback, mode: .default, options: [.allowBluetooth])
            try audioSession.setActive(true)
        } catch {
            print("音声セッションの設定に失敗しました: \(error)")
        }
    }
    
    // MARK: - Public Methods
    func playAlarm() {
        if selectedAlarmSound == .system {
            playSystemSound()
        } else {
            playCustomSound()
        }
    }
    
    func stopAlarm() {
        audioPlayer?.stop()
        isPlaying = false
    }
    
    func previewSound(_ sound: AlarmSound) {
        selectedAlarmSound = sound
        playAlarm()
        
        // 3秒後に自動停止
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
            self.stopAlarm()
        }
    }
    
    func setVolume(_ volume: Float) {
        currentVolume = volume
        audioPlayer?.volume = volume
    }
    
    // MARK: - Private Methods
    private func playSystemSound() {
        // システム音（AudioServicesPlaySystemSound）
        let systemSoundID: SystemSoundID = 1005 // システムの通知音
        AudioServicesPlaySystemSound(systemSoundID)
        
        // バイブレーション
        let impactFeedback = UIImpactFeedbackGenerator(style: .heavy)
        impactFeedback.impactOccurred()
        
        isPlaying = true
        
        // 1秒後に停止状態にする（システム音は短いため）
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.isPlaying = false
        }
    }
    
    private func playCustomSound() {
        guard let fileName = selectedAlarmSound.fileName else {
            playSystemSound()
            return
        }
        
        // 音声ファイルのパスを取得
        guard let soundURL = Bundle.main.url(forResource: fileName, withExtension: "mp3") else {
            print("音声ファイルが見つかりません: \(fileName).mp3")
            // ファイルが見つからない場合はシステム音にフォールバック
            playSystemSound()
            return
        }
        
        do {
            // AVAudioPlayerを初期化
            audioPlayer = try AVAudioPlayer(contentsOf: soundURL)
            audioPlayer?.delegate = self
            audioPlayer?.volume = currentVolume
            audioPlayer?.numberOfLoops = 3 // 3回繰り返し
            
            // 再生開始
            let success = audioPlayer?.play() ?? false
            if success {
                isPlaying = true
            } else {
                print("音声の再生に失敗しました")
                playSystemSound() // フォールバック
            }
            
        } catch {
            print("AVAudioPlayerの初期化に失敗しました: \(error)")
            playSystemSound() // フォールバック
        }
    }
    
    // MARK: - Utility Methods
    func getAllAlarmSounds() -> [AlarmSound] {
        return AlarmSound.allCases
    }
    
    func isValidSoundFile(_ sound: AlarmSound) -> Bool {
        guard let fileName = sound.fileName else {
            return true // システム音は常に有効
        }
        
        return Bundle.main.url(forResource: fileName, withExtension: "mp3") != nil
    }
    
    deinit {
        audioPlayer?.stop()
        try? audioSession.setActive(false)
    }
}

// MARK: - AVAudioPlayerDelegate
extension SoundManager: AVAudioPlayerDelegate {
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        DispatchQueue.main.async {
            self.isPlaying = false
        }
    }
    
    func audioPlayerDecodeErrorDidOccur(_ player: AVAudioPlayer, error: Error?) {
        print("音声デコードエラー: \(error?.localizedDescription ?? "不明なエラー")")
        DispatchQueue.main.async {
            self.isPlaying = false
        }
    }
}`} />
	</article>
</section>

<div class="space"></div>

<!-- TimerViewModelとの統合 -->
<section>
	<h3>TimerViewModelとの統合</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">integration</i> TimerViewModel.swiftの更新</h6>
		<p>Step 4で作成したTimerViewModelにSoundManagerを統合します：</p>
		
		<div class="space"></div>
		    <CodeBlock 
      code={`// TimerViewModel.swiftに追加する部分
import SwiftUI
import Foundation

class TimerViewModel: ObservableObject {
    // ...既存のプロパティ...
    
    // SoundManagerを追加
    @Published var soundManager = SoundManager()
    
    // ...既存のメソッド...
    
    // timerFinishedメソッドを更新
    private func timerFinished() {
        currentState = .finished
        timer?.invalidate()
        timer = nil
        
        // アラーム音を鳴らす
        soundManager.playAlarm()
        
        // 通知やその他の処理
        showCompletionAlert = true
    }
    
    // アラーム停止メソッドを追加
    func stopAlarm() {
        soundManager.stopAlarm()
    }
    
    // ...既存のコード...
}`} 
      language="swift" 
    />
	</article>
</section>

<div class="space"></div>

<!-- 音声設定UIの作成 -->
<section>
	<h3>音声設定UIの作成</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">add</i> SoundSettingsView.swiftの作成</h6>
		<p>音声設定用のビューを作成します：</p>
		
		<div class="space"></div>
            <CodeBlock 
      code={`import SwiftUI

struct SoundSettingsView: View {
    @ObservedObject var soundManager: SoundManager
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // 音量設定
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        Image(systemName: "speaker.fill")
                            .foregroundStyle(.secondary)
                        Text("音量")
                            .font(.headline)
                    }
                    
                    HStack {
                        Image(systemName: "speaker.wave.1")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        
                        Slider(
                            value: Binding(
                                get: { soundManager.currentVolume },
                                set: { soundManager.setVolume($0) }
                            ),
                            in: 0...1
                        )
                        .accentColor(.blue)
                        
                        Image(systemName: "speaker.wave.3")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    
                    Text("音量: \(Int(soundManager.currentVolume * 100))%")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .padding()
                .background(Color(.systemGray6))
                .clipShape(RoundedRectangle(cornerRadius: 12))
                
                // アラーム音選択
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        Image(systemName: "music.note")
                            .foregroundStyle(.secondary)
                        Text("アラーム音")
                            .font(.headline)
                    }
                    
                    LazyVGrid(columns: [
                        GridItem(.flexible()),
                        GridItem(.flexible())
                    ], spacing: 10) {
                        ForEach(soundManager.getAllAlarmSounds(), id: \.self) { sound in
                            SoundOptionView(
                                sound: sound,
                                isSelected: soundManager.selectedAlarmSound == sound,
                                isValid: soundManager.isValidSoundFile(sound)
                            ) {
                                soundManager.selectedAlarmSound = sound
                                soundManager.previewSound(sound)
                            }
                        }
                    }
                }
                .padding()
                .background(Color(.systemGray6))
                .clipShape(RoundedRectangle(cornerRadius: 12))
                
                // プレビューコントロール
                HStack(spacing: 20) {
                    CustomButton(
                        "プレビュー再生",
                        icon: "play.fill",
                        variant: .primary
                    ) {
                        soundManager.previewSound(soundManager.selectedAlarmSound)
                    }
                    
                    if soundManager.isPlaying {
                        CustomButton(
                            "停止",
                            icon: "stop.fill",
                            variant: .danger
                        ) {
                            soundManager.stopAlarm()
                        }
                    }
                }
                
                Spacer()
            }
            .padding()
            .navigationTitle("音声設定")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("完了") {
                        dismiss()
                    }
                }
            }
        }
    }
}

// 音声選択肢のビュー
struct SoundOptionView: View {
    let sound: AlarmSound
    let isSelected: Bool
    let isValid: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: iconName)
                    .font(.title2)
                    .foregroundStyle(isSelected ? .white : .primary)
                
                Text(sound.displayName)
                    .font(.caption)
                    .foregroundStyle(isSelected ? .white : .primary)
                    .multilineTextAlignment(.center)
            }
            .frame(height: 70)
            .frame(maxWidth: .infinity)
            .background(
                RoundedRectangle(cornerRadius: 10)
                    .fill(isSelected ? Color.blue : Color(.systemBackground))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(
                        isSelected ? Color.blue : Color(.systemGray4),
                        lineWidth: isSelected ? 2 : 1
                    )
            )
            .opacity(isValid ? 1.0 : 0.6)
        }
        .disabled(!isValid)
    }
    
    private var iconName: String {
        switch sound {
        case .classic:
            return "alarm"
        case .gentle:
            return "bell"
        case .digital:
            return "waveform"
        case .nature:
            return "leaf"
        case .system:
            return "speaker.wave.2"
        }
    }
}

// プレビュー用のコード
#Preview {
    SoundSettingsView(soundManager: SoundManager())
}")
}`} 
      language="swift" 
    />
	</article>
</section>

<div class="space"></div>

<!-- 音声ファイルの追加 -->
<section>
	<h3>音声ファイルの追加方法</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">folder</i> 音声ファイルをプロジェクトに追加</h6>
		<p>カスタム音声ファイルをXcodeプロジェクトに追加する手順：</p>
		
		<div class="space"></div>
		
		<ol>
			<li>音声ファイル（MP3形式）を準備する</li>
			<li>Xcodeのプロジェクトナビゲーターでプロジェクトを右クリック</li>
			<li>「Add Files to "プロジェクト名"...」を選択</li>
			<li>以下のファイル名で音声ファイルを追加：
				<ul>
					<li>classic_alarm.mp3</li>
					<li>gentle_bell.mp3</li>
					<li>digital_beep.mp3</li>
					<li>nature_chime.mp3</li>
				</ul>
			</li>
			<li>「Add to target」でアプリのターゲットが選択されていることを確認</li>
		</ol>
		
		<div class="space"></div>
		
		<div class="secondary-container round padding">
			<h6 class="">音声ファイルが見つからない場合</h6>
			<p class="">音声ファイルがない場合でも、SoundManagerはシステム音にフォールバックするため、アプリは正常に動作します。後から音声ファイルを追加することも可能です。</p>
		</div>
	</article>
</section>

<div class="space"></div>

<!-- ContentViewでの音声設定統合 -->
<section>
	<h3>ContentViewでの音声設定統合</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">integration</i> 音声設定ボタンの追加</h6>
		<p>ContentViewに音声設定ボタンを追加する例：</p>
		
		<div class="space"></div>
		    <CodeBlock 
      code={`struct ContentView: View {
    @StateObject private var viewModel = TimerViewModel()
    @State private var showingSoundSettings = false
    
    var body: some View {
        VStack(spacing: 30) {
            // ...既存のコンテンツ...
            
            // 設定ボタン
            HStack(spacing: 15) {
                IconButton(icon: "speaker.wave.2") {
                    showingSoundSettings = true
                }
                
                // その他の設定ボタン...
            }
        }
        .padding()
        .sheet(isPresented: $showingSoundSettings) {
            SoundSettingsView(soundManager: viewModel.soundManager)
        }
        // タイマー終了時のアラート
        .alert("タイマー終了", isPresented: $viewModel.showCompletionAlert) {
            Button("OK") {
                viewModel.stopAlarm()
                viewModel.showCompletionAlert = false
            }
            Button("スヌーズ (1分)") {
                viewModel.stopAlarm()
                viewModel.startSnooze()
                viewModel.showCompletionAlert = false
            }
        } message: {
            Text("設定された時間が経過しました")
        }
    }
}`} 
      language="swift" 
    />

	</article>
</section>

<div class="space"></div>

<!-- よくあるエラーと解決方法 -->
<section>
	<h3>よくあるエラーと解決方法</h3>
	
	<div class="grid">
		<div class="s12 m6">
			<article class="round border padding error-container">
				<h6><i class="error-text">warning</i> 音が鳴らない</h6>
				<div class="code-container small">
					<pre><code>Sound file not found</code></pre>
				</div>
				<p class="small-text"><strong>原因:</strong> 音声ファイルがプロジェクトに追加されていない</p>
				<p class="small-text"><strong>解決:</strong> Bundle.main.url()でファイルの存在確認</p>
			</article>
		</div>
		
		<div class="s12 m6">
			<article class="round border padding error-container">
				<h6><i class="error-text">warning</i> 音量が調整できない</h6>
				<div class="code-container small">
					<pre><code>Volume not changing</code></pre>
				</div>
				<p class="small-text"><strong>原因:</strong> audioPlayer?.volumeの設定タイミング</p>
				<p class="small-text"><strong>解決:</strong> play()実行前に音量を設定</p>
			</article>
		</div>
	</div>
</section>

<div class="space"></div>

<!-- ナビゲーション -->
<section>
	<div class="grid">
		<div class="s6">
			<a href="{base}/projects/timer/step6" class="button transparent primary-text">
				<i>arrow_back</i>
				<span>Step 6に戻る</span>
			</a>
		</div>
		<div class="s6 right-align">
			<a href="{base}/projects/timer/step8" class="button primary">
				<span>Step 8へ進む</span>
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
	
	.code-container {
		position: relative;
		margin: 1rem 0;
	}
	
	.code-container.small {
		margin: 0.5rem 0;
	}
	
	.code-container pre {
		background: #f5f5f5;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.4;
	}
	
	.error-container {
		border-left: 4px solid var(--error);
	}
	
	ol, ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}
	
	li {
		margin: 0.25rem 0;
	}
</style>

