<script>
  import { base } from "$app/paths";

  // ステップデータ
  const steps = [
    {
      id: 1,
      title: "プロジェクトの準備",
      description: "Xcodeで新しいSwiftUIプロジェクトを作成しよう",
      duration: "10分",
      icon: "settings",
      content: {
        overview: "Xcodeで新しいプロジェクトを作成し、基本的な設定を行います。",
        tasks: [
          "Xcodeを起動する",
          "新しいプロジェクトを作成（iOS App、SwiftUI）",
          "プロジェクト名を「Timer」にする",
          "Bundle Identifierを設定する",
        ],
        code: `// 最初に自動生成される TimerApp.swift
import SwiftUI

@main
struct TimerApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}`,
        tips: [
          "プロジェクト名は半角英数字で設定しよう",
          "Bundle Identifierは一意である必要があります",
          "SwiftUIを選択することを忘れずに",
        ],
      },
    },
    {
      id: 2,
      title: "タイマーの状態を管理するEnum",
      description: "タイマーの3つの状態（待機、実行中、一時停止）を定義しよう",
      duration: "15分",
      icon: "category",
      content: {
        overview:
          "タイマーの状態を管理するためのEnumを作成し、基本的な構造を理解します。",
        tasks: [
          "ContentView.swiftにTimerStateを追加",
          "3つの状態を定義する",
          "基本的なViewの構造を作成",
        ],
        code: `// TimerStateを定義
enum TimerState {
    case idle      // 待機中
    case running   // 実行中
    case paused    // 一時停止中
}

struct ContentView: View {
    @State var timerState: TimerState = .idle
    
    var body: some View {
        VStack {
            Text("タイマーアプリ")
                .font(.largeTitle)
            
            Text("現在の状態: \\(timerState)")
        }
    }
}`,
        tips: [
          "Enumは関連する値をグループ化するのに便利",
          "@Stateは値の変更をViewに反映させる",
          "スネークケースではなくキャメルケースを使う",
        ],
      },
    },
    {
      id: 3,
      title: "時間設定用のPicker作成",
      description:
        "時、分、秒を選択できるカスタムPickerコンポーネントを作成しよう",
      duration: "20分",
      icon: "schedule",
      content: {
        overview:
          "再利用可能なTimePickerコンポーネントを作成し、時間選択機能を実装します。",
        tasks: [
          "新しいSwiftファイル「TimePicker.swift」を作成",
          "Bindingを使って値を親に返す機能を実装",
          "Pickerのスタイルを設定",
        ],
        code: `// TimePicker.swift
import SwiftUI

struct TimePicker: View {
    var title: String
    var range: ClosedRange<Int>
    @Binding var selection: Int
    
    var body: some View {
        Picker(selection: $selection, label: Text(title)) {
            ForEach(range, id: \\.self) { value in
                Text("\\(value) \\(title)").tag(value)
            }
        }
        .pickerStyle(.wheel)
    }
}

// ContentView.swiftに追加
struct ContentView: View {
    @State var hours = 0
    @State var minutes = 0
    @State var seconds = 0
    
    var body: some View {
        VStack {
            HStack {
                TimePicker(title: "時間", range: 0...23, selection: $hours)
                TimePicker(title: "分", range: 0...59, selection: $minutes)
                TimePicker(title: "秒", range: 0...59, selection: $seconds)
            }
        }
    }
}`,
        tips: [
          "@Bindingは親子間でのデータ共有に使用",
          "$マークでBinding型として渡す",
          "ForEachを使って配列やRangeをループ",
        ],
      },
    },
    {
      id: 4,
      title: "ViewModelでビジネスロジック管理",
      description: "ObservableObjectを使ってタイマーのロジックを管理しよう",
      duration: "25分",
      icon: "psychology",
      content: {
        overview:
          "MVVMパターンを使ってViewとロジックを分離し、保守性の高いコードを作成します。",
        tasks: [
          "新しいSwiftファイル「TimerViewModel.swift」を作成",
          "ObservableObjectプロトコルを実装",
          "@Publishedでプロパティを監視可能にする",
        ],
        code: `// TimerViewModel.swift
import SwiftUI

class TimerViewModel: ObservableObject {
    @Published var remainingTime = 0
    @Published var timerState: TimerState = .idle
    @Published var isShowingAlert = false
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
    
    private func countDown() {
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
            if self.remainingTime > 0 {
                self.remainingTime -= 1
            } else {
                timer.invalidate()
                self.isShowingAlert = true
            }
        }
    }
}

// ContentViewで使用
struct ContentView: View {
    @StateObject var viewModel = TimerViewModel()
    
    var body: some View {
        // ViewModelを使用したUI
    }
}`,
        tips: [
          "ObservableObjectはSwiftUIでの状態管理の基本",
          "@Publishedは値の変更を自動的にUIに反映",
          "ビジネスロジックはViewModelに分離する",
        ],
      },
    },
    {
      id: 5,
      title: "円形プログレスバーの実装",
      description: "残り時間を視覚的に表示する円形プログレスバーを作成しよう",
      duration: "30分",
      icon: "donut_large",
      content: {
        overview:
          "Circleとtrimを使って美しい円形プログレスバーを実装し、タイマーの進行状況を視覚化します。",
        tasks: [
          "新しいSwiftファイル「TimerDisplayView.swift」を作成",
          "Circleを使ってプログレスバーを描画",
          "アニメーションを追加して滑らかな表示を実現",
        ],
        code: `// TimerDisplayView.swift
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
}`,
        tips: [
          "ZStackで要素を重ねて配置",
          "trimで円の一部分だけを表示",
          "String.formatで時間表示を整形",
        ],
      },
    },
    {
      id: 6,
      title: "カスタムボタンコンポーネント",
      description: "統一感のあるカスタムボタンを作成しよう",
      duration: "20分",
      icon: "smart_button",
      content: {
        overview:
          "再利用可能なカスタムボタンコンポーネントを作成し、一貫したデザインを実現します。",
        tasks: [
          "新しいSwiftファイル「ColorButton.swift」を作成",
          "色とアクションをカスタマイズ可能にする",
          "円形のデザインを実装",
        ],
        code: `// ColorButton.swift
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
}

// 使用例
ColorButton(text: "開始", color: .green) {
    // ボタンが押された時の処理
    print("開始ボタンが押されました")
}`,
        tips: [
          "クロージャで外部から処理を渡せるように設計",
          "opacityで半透明効果を追加",
          "clipShapeで形を変更",
        ],
      },
    },
    {
      id: 7,
      title: "音声アラーム機能の実装",
      description: "AVFoundationを使ってタイマー終了時に音を鳴らそう",
      duration: "25分",
      icon: "volume_up",
      content: {
        overview:
          "AVFoundationフレームワークを使って、タイマー終了時に音声アラームを再生する機能を実装します。",
        tasks: [
          "AVFoundationフレームワークをインポート",
          "音声ファイルをプロジェクトに追加",
          "AVAudioPlayerで音声再生機能を実装",
        ],
        code: `// TimerViewModel.swift に追加
import AVFoundation

class TimerViewModel: ObservableObject {
    // ...既存のコード...
    var audioPlayer: AVAudioPlayer?
    
    func playSound() {
        guard let url = Bundle.main.url(forResource: "Alarm", withExtension: "mp3") else {
            print("音声ファイルが見つかりません")
            return
        }
        
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: url)
            audioPlayer?.play()
        } catch {
            print("音声ファイルが再生できませんでした: \\(error)")
        }
    }
    
    private func countDown() {
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
            if self.remainingTime > 0 {
                self.remainingTime -= 1
            } else {
                timer.invalidate()
                self.isShowingAlert = true
                self.playSound() // 音声再生
            }
        }
    }
}`,
        tips: [
          "音声ファイルは.mp3や.wavを使用",
          "Bundle.mainでアプリ内のリソースにアクセス",
          "do-catchでエラーハンドリングを実装",
        ],
      },
    },
    {
      id: 8,
      title: "UI統合とアラート機能",
      description: "全ての機能を統合し、アラート表示を実装しよう",
      duration: "20分",
      icon: "integration_instructions",
      content: {
        overview:
          "作成した全てのコンポーネントを統合し、完全に動作するタイマーアプリを完成させます。",
        tasks: [
          "TimeSelectionViewを作成して時間選択UIを分離",
          "状態に応じてボタンの表示を切り替え",
          "アラート機能を実装",
        ],
        code: `// TimeSelectionView.swift
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
}

// ContentView.swift - 最終版
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
                ColorButton(text: "キャンセル", color: .white, action: viewModel.stopTimer)
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
}`,
        tips: [
          "switchで状態に応じたUIを実装",
          "opacityとdisabledで無効状態を表現",
          "alertモディファイアでアラート表示",
        ],
      },
    },
  ];

  // 現在選択されているステップ
  let selectedStep = 1;

  // 現在のステップを取得
  $: currentStep = steps.find((s) => s.id === selectedStep) || steps[0];

  // コードをクリップボードにコピー
  function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
      console.log("コードをコピーしました");
    });
  }
</script>

<svelte:head>
  <title>タイマーアプリ作成 - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="SwiftUIを使ってタイマーアプリを作成するプロジェクトベース学習。実際に動くアプリを段階的に開発。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">timer</i>
      </h1>
      <h2>タイマーアプリを作ろう</h2>
      <p class="large-text">
        SwiftUIを使って実用的なタイマーアプリを段階的に開発しよう！
      </p>
      <div class="space"></div>
      <div class="chip primary">
        <span>初級〜中級</span>
      </div>
      <div class="chip secondary">
        <span>所要時間: 3-4時間</span>
      </div>
      <div class="chip tertiary">
        <span>全{steps.length}ステップ</span>
      </div>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- プロジェクト概要 -->
<section>
  <div class="center-align">
    <h3>このプロジェクトで学べること</h3>
    <p class="medium-text">
      実際のアプリ開発で必要な技術を実践的に習得できます
    </p>
  </div>

  <div class="space"></div>

  <div class="grid">
    <div class="s12 m6 l3">
      <article class="round border padding">
        <div class="center-align">
          <i class="large primary-text">architecture</i>
          <h6>MVVMパターン</h6>
          <p class="small-text">ViewとViewModelを分離した設計パターン</p>
        </div>
      </article>
    </div>

    <div class="s12 m6 l3">
      <article class="round border padding">
        <div class="center-align">
          <i class="large secondary-text">widgets</i>
          <h6>SwiftUI基礎</h6>
          <p class="small-text">@State、@Binding、@ObservableObjectの使い方</p>
        </div>
      </article>
    </div>

    <div class="s12 m6 l3">
      <article class="round border padding">
        <div class="center-align">
          <i class="large tertiary-text">palette</i>
          <h6>カスタムUI</h6>
          <p class="small-text">円形プログレスバーやカスタムボタンの作成</p>
        </div>
      </article>
    </div>

    <div class="s12 m6 l3">
      <article class="round border padding">
        <div class="center-align">
          <i class="large inverse-text">volume_up</i>
          <h6>音声処理</h6>
          <p class="small-text">AVFoundationを使った音声再生</p>
        </div>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- ステップ一覧 -->
<section>
  <div class="center-align">
    <h3>開発ステップ</h3>
    <p class="medium-text">順番に進めて完全なタイマーアプリを作成しましょう</p>
  </div>

  <div class="space"></div>

  <div class="grid">
    {#each steps as step}
      <div class="s12 m6 l4">
        <article class="card round">
          <div class="padding">
            <div class="row">
              <div class="max">
                <h6>ステップ {step.id}: {step.title}</h6>
                <p class="small-text">{step.description}</p>
              </div>

            </div>

            <div class="space"></div>

            <div class="row">

              <div class="chip small outline">
                <i class="small">schedule</i>
                <span>{step.duration}</span>
              </div>
            </div>

            <div class="space"></div>

            <a
              href="{base}/projects/timer/step{step.id}"
              class="button primary block"
            >
              <i>play_arrow</i>
              <span>ステップを始める</span>
            </a>
          </div>
        </article>
      </div>
    {/each}
  </div>
</section>

<div class="space"></div>

<!-- 完成イメージ -->
<section class="primary-container round padding">
  <div class="center-align">
    <h4 class="">完成したアプリの機能</h4>
    <div class="space"></div>
  </div>

  <div class="grid">
    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">schedule</i>
        </div>
        <div class="max">
          <h6 class="">時間設定</h6>
          <p class="">時、分、秒を自由に設定できるインタラクティブなPicker</p>
        </div>
      </div>
    </div>

    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">donut_large</i>
        </div>
        <div class="max">
          <h6 class="">視覚的進行表示</h6>
          <p class="">円形プログレスバーで残り時間を分かりやすく表示</p>
        </div>
      </div>
    </div>

    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">play_pause</i>
        </div>
        <div class="max">
          <h6 class="">柔軟な操作</h6>
          <p class="">開始、一時停止、再開、キャンセルの完全な制御</p>
        </div>
      </div>
    </div>

    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">notifications</i>
        </div>
        <div class="max">
          <h6 class="">音声アラーム</h6>
          <p class="">時間終了時の音声通知とアラート表示</p>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- 必要な準備 -->
<section class="secondary-container round padding">
  <div class="center-align">
    <h4 class="">開発前の準備</h4>
    <div class="space"></div>
  </div>

  <div class="grid">
    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">laptop_mac</i>
        </div>
        <div class="max">
          <h6 class="">Xcode 15以上</h6>
          <p class="">
            最新のSwiftUIを使用するため、Xcode
            15以上をインストールしてください。
          </p>
        </div>
      </div>
    </div>

    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">music_note</i>
        </div>
        <div class="max">
          <h6 class="">音声ファイル</h6>
          <p class="">
            アラーム用の音声ファイル（.mp3または.wav）を用意してください。
          </p>
        </div>
      </div>
    </div>

    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">quick_reference</i>
        </div>
        <div class="max">
          <h6 class="">Swiftチートシート</h6>
          <p class="">分からない構文があったらチートシートを参照しましょう。</p>
        </div>
      </div>
    </div>
  </div>

  <div class="space"></div>
  <div class="center-align">
    <a href="{base}/cheatsheet" class="button white primary-text">
      <i>quick_reference</i>
      <span>Swiftチートシートを見る</span>
    </a>
  </div>
</section>

<div class="space"></div>

<!-- ナビゲーション -->
<section>
  <div class="center-align">
    <a href="{base}/projects" class="button transparent primary-text">
      <i>arrow_back</i>
      <span>プロジェクト一覧</span>
    </a>
    <span class="space"></span>
    <a href="{base}/cheatsheet" class="button secondary">
      <i>quick_reference</i>
      <span>チートシート</span>
    </a>
  </div>
</section>

<style>
  .hero-section {
    padding: 3rem 0;
    background: linear-gradient(
      135deg,
      var(--primary-container) 0%,
      var(--secondary-container) 100%
    );
    border-radius: 1rem;
    margin-bottom: 2rem;
  }

  .large-text {
    font-size: 1.2rem;
    line-height: 1.6;
  }

  .medium-text {
    font-size: 1.1rem;
    line-height: 1.5;
  }

  .small-text {
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .card {
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .card .padding {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

</style>
