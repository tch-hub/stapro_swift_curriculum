<script>
  import { base } from "$app/paths";
  import CodeBlock from "$lib/CodeBlock.svelte";
</script>

<svelte:head>
  <title>Step 4: ViewModelの実装 - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="ObservableObjectとMVVMパターンを使ってタイマーのデータ管理を行うViewModelを実装します。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">data_object</i>
      </h1>
      <h2>Step 4: ViewModelの実装</h2>
      <p class="large-text">
        タイマーのデータ管理とビジネスロジックを実装しよう
      </p>
      <div class="space"></div>
      <div class="chip primary">
        <span>Step 4 / 8</span>
      </div>
      <div class="chip secondary">
        <span>MVVM・ObservableObject</span>
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
          <li>ObservableObjectプロトコルの理解</li>
          <li>@Publishedプロパティラッパーの使い方</li>
          <li>Timerクラスを使った時間管理</li>
          <li>MVVMパターンの実装</li>
        </ul>
      </article>
    </div>
    <div class="s12 m6">
      <article class="round border padding">
        <h6><i class="secondary-text">engineering</i> 実装するもの</h6>
        <ul>
          <li>TimerViewModelクラス</li>
          <li>タイマーの開始・停止・リセット機能</li>
          <li>残り時間の計算と更新</li>
          <li>UIとの双方向データバインディング</li>
        </ul>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- MVVMパターンの復習 -->
<section>
  <h3>MVVMパターンの復習</h3>
  <p>ViewModelは、ビューとモデルの間を取り持つ重要な役割を果たします。</p>

  <div class="space"></div>

  <div class="grid">
    <div class="s12 m4">
      <article class="round border padding center-align">
        <h6><i class="primary-text">visibility</i> View</h6>
        <p class="small-text">UI表示とユーザー操作を担当</p>
      </article>
    </div>
    <div class="s12 m4">
      <article class="round border padding center-align primary-container">
        <h6 class=""><i>data_object</i> ViewModel</h6>
        <p class=" small-text">データ管理とビジネスロジックを担当</p>
      </article>
    </div>
    <div class="s12 m4">
      <article class="round border padding center-align">
        <h6><i class="secondary-text">storage</i> Model</h6>
        <p class="small-text">データ構造と状態管理を担当</p>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- ObservableObjectの概念 -->
<section>
  <h3>ObservableObjectとは</h3>

  <article class="round border padding">
    <h6><i class="primary-text">info</i> ObservableObjectの役割</h6>
    <p>
      ObservableObjectは、データの変更をSwiftUIビューに自動的に通知するプロトコルです。
    </p>

    <div class="space"></div>

    <CodeBlock
      code={`import SwiftUI

class MyViewModel: ObservableObject {
    @Published var count = 0 // この値が変更されると自動的にUIが更新される

    func increment() {
        count += 1
    }
}`}
    />

    <div class="space"></div>

    <div class="primary-container round padding">
      <h6 class="">重要なポイント</h6>
      <ul class="">
        <li><strong>ObservableObject:</strong> プロトコルとして実装</li>
        <li><strong>@Published:</strong> 変更を監視するプロパティ</li>
        <li><strong>class:</strong> 参照型として定義（structではない）</li>
      </ul>
    </div>
  </article>
</section>

<div class="space"></div>

<!-- TimerViewModelの作成 -->
<section>
  <h3>TimerViewModelの実装</h3>

  <article class="round border padding">
    <h6><i class="primary-text">add</i> 新しいファイルを作成</h6>
    <p>ViewModelsフォルダに新しいSwiftファイルを作成します：</p>
    <ol>
      <li>
        Xcodeのプロジェクトナビゲーターで「ViewModels」フォルダを右クリック
      </li>
      <li>「New File...」を選択</li>
      <li>
        「Swift File」を選択し、ファイル名を「TimerViewModel.swift」に設定
      </li>
    </ol>
  </article>
</section>

<div class="space"></div>

<!-- TimerViewModel.swiftの実装 -->
<section>
  <h3>TimerViewModel.swiftの実装</h3>

  <article class="round border padding">
    <h6><i class="primary-text">code</i> TimerViewModel.swift</h6>
    <p>
      以下のコードを新しく作成したTimerViewModel.swiftファイルに入力してください：
    </p>

    <div class="space"></div>

    <CodeBlock
      code={`import SwiftUI
import Foundation

class TimerViewModel: ObservableObject {
    // MARK: - Published Properties（UIで監視されるプロパティ）
    @Published var currentState: TimerState = .stopped
    @Published var remainingTime: TimeInterval = 0
    @Published var selectedHours: Int = 0
    @Published var selectedMinutes: Int = 5
    @Published var selectedSeconds: Int = 0
    
    // MARK: - Private Properties
    private var timer: Timer?
    private var totalTime: TimeInterval = 0
    
    // MARK: - Computed Properties
    var progress: Double {
        guard totalTime > 0 else { return 0 }
        return 1.0 - (remainingTime / totalTime)
    }
    
    var formattedTime: String {
        let hours = Int(remainingTime) / 3600
        let minutes = (Int(remainingTime) % 3600) / 60
        let seconds = Int(remainingTime) % 60
        
        if hours > 0 {
            return String(format: "%02d:%02d:%02d", hours, minutes, seconds)
        } else {
            return String(format: "%02d:%02d", minutes, seconds)
        }
    }
    
    // MARK: - Timer Control Methods
    func startTimer() {
        guard currentState != .running else { return }
        
        if currentState == .stopped {
            // 新しいタイマーを開始
            let totalSeconds = TimeInterval(selectedHours * 3600 + selectedMinutes * 60 + selectedSeconds)
            guard totalSeconds > 0 else { return }
            
            totalTime = totalSeconds
            remainingTime = totalSeconds
        }
        
        currentState = .running
        
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
            self.updateTimer()
        }
    }
    
    func pauseTimer() {
        currentState = .paused
        timer?.invalidate()
        timer = nil
    }
    
    func stopTimer() {
        currentState = .stopped
        timer?.invalidate()
        timer = nil
        remainingTime = 0
        totalTime = 0
    }
    
    func resetTimer() {
        timer?.invalidate()
        timer = nil
        currentState = .stopped
        remainingTime = 0
        totalTime = 0
    }
    
    // MARK: - Private Methods
    private func updateTimer() {
        DispatchQueue.main.async {
            if self.remainingTime > 0 {
                self.remainingTime -= 1
            } else {
                // タイマー終了
                self.timerFinished()
            }
        }
    }
    
    private func timerFinished() {
        currentState = .finished
        timer?.invalidate()
        timer = nil
        
        // ここで音を鳴らしたり、通知を表示したりする
        // 次のステップで実装します
    }
    
    // MARK: - Deinitializer
    deinit {
        timer?.invalidate()
    }
}`}
    />
  </article>
</section>

<div class="space"></div>

<!-- コードの詳細解説 -->
<section>
  <h3>コードの詳細解説</h3>

  <div class="grid">
    <div class="s12 m6">
      <article class="round border padding">
        <h6><i class="primary-text">published</i> @Publishedプロパティ</h6>
        <div class="code-container small">
          <CodeBlock
            code={`@Published var currentState: TimerState = .stopped
@Published var remainingTime: TimeInterval = 0`}
          />
        </div>
        <p class="small-text">
          これらのプロパティが変更されると、自動的にUIが更新されます。
        </p>
      </article>
    </div>

    <div class="s12 m6">
      <article class="round border padding">
        <h6><i class="secondary-text">timer</i> Timerクラス</h6>
        <div class="code-container small">
          <CodeBlock
            code={`timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
    self.updateTimer()
}`}
          />
        </div>
        <p class="small-text">
          1秒ごとに繰り返し実行されるタイマーを作成します。
        </p>
      </article>
    </div>

    <div class="s12 m6">
      <article class="round border padding">
        <h6><i class="tertiary-text">calculate</i> 計算プロパティ</h6>
        <div class="code-container small">
          <CodeBlock
            code={`var progress: Double {
    guard totalTime > 0 else { return 0 }
    return 1.0 - (remainingTime / totalTime)
}`}
          />
        </div>
        <p class="small-text">
          進捗を0.0〜1.0の値で計算し、プログレスバーで使用します。
        </p>
      </article>
    </div>

    <div class="s12 m6">
      <article class="round border padding">
        <h6><i class="primary-text">schedule</i> DispatchQueue</h6>
        <div class="code-container small">
          <CodeBlock
            code={`DispatchQueue.main.async {
    if self.remainingTime > 0 {
        self.remainingTime -= 1
    }
}`}
          />
        </div>
        <p class="small-text">メインスレッドでUI更新を実行します。</p>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- ViewでのViewModel使用方法 -->
<section>
  <h3>ViewでのViewModel使用方法</h3>

  <article class="round border padding">
    <h6><i class="primary-text">integration</i> ContentView.swiftでの使用例</h6>
    <p>次のステップで詳しく実装しますが、基本的な使用方法を確認しましょう：</p>

    <div class="space"></div>

    <CodeBlock
      code={`struct ContentView: View {
    @StateObject private var viewModel = TimerViewModel()

    var body: some View {
        VStack {
            Text(viewModel.formattedTime)
                .font(.largeTitle)

            TimePicker(
                hours: $viewModel.selectedHours,
                minutes: $viewModel.selectedMinutes,
                seconds: $viewModel.selectedSeconds
            )

            HStack {
                Button("開始") {
                    viewModel.startTimer()
                }

                Button("停止") {
                    viewModel.stopTimer()
                }
            }
        }
    }
}`}
    />
  </article>
</section>

<div class="space"></div>

<!-- デバッグとテスト -->
<section>
  <h3>デバッグとテスト方法</h3>

  <article class="round border padding">
    <h6><i class="primary-text">bug_report</i> ViewModelのテスト</h6>
    <p>ViewModelが正しく動作するかPlaygroundでテストしてみましょう：</p>

    <div class="space"></div>

    <div class="code-container">
      <CodeBlock
        code={`// Playgroundでのテストコード
import SwiftUI
import PlaygroundSupport

let viewModel = TimerViewModel()

// 初期状態の確認
print("初期状態: \(viewModel.currentState)")
print("残り時間: \(viewModel.remainingTime)")

// 時間設定
viewModel.selectedMinutes = 1
viewModel.selectedSeconds = 30

// タイマー開始
viewModel.startTimer()
print("タイマー開始後: \(viewModel.currentState)")

// 2秒後の状態確認
DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
    print("2秒後の残り時間: \(viewModel.formattedTime)")
}`}
      />
      <button
        id="copy-btn-4"
        class="button small primary"
        onclick={() =>
          copyToClipboard(
            `// Playgroundでのテストコード
import SwiftUI
import PlaygroundSupport

let viewModel = TimerViewModel()

// 初期状態の確認
print("初期状態: \\(viewModel.currentState)")
print("残り時間: \\(viewModel.remainingTime)")

// 時間設定
viewModel.selectedMinutes = 1
viewModel.selectedSeconds = 30

// タイマー開始
viewModel.startTimer()
print("タイマー開始後: \\(viewModel.currentState)")

// 2秒後の状態確認
DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
    print("2秒後の残り時間: \\(viewModel.formattedTime)")
}`,
            "copy-btn-4"
          )}
      >
        <i>content_copy</i>
        <span>コピー</span>
      </button>
    </div>
  </article>
</section>

<div class="space"></div>

<!-- よくあるエラーと解決方法 -->
<section>
  <h3>よくあるエラーと解決方法</h3>

  <div class="grid">
    <div class="s12 m6">
      <article class="round border padding error-container">
        <h6><i class="error-text">warning</i> コンパイルエラー</h6>
        <div class="code-container small">
          <CodeBlock
            code={`Type 'TimerViewModel' does not conform to protocol 'ObservableObject'`}
          />
        </div>
        <p class="small-text">
          <strong>原因:</strong> import SwiftUIが不足している
        </p>
        <p class="small-text">
          <strong>解決:</strong> ファイルの先頭に「import SwiftUI」を追加
        </p>
      </article>
    </div>

    <div class="s12 m6">
      <article class="round border padding error-container">
        <h6><i class="error-text">warning</i> タイマーが止まらない</h6>
        <div class="code-container small">
          <CodeBlock code={`Timer continues running`} />
        </div>
        <p class="small-text">
          <strong>原因:</strong> timer?.invalidate()の呼び忘れ
        </p>
        <p class="small-text">
          <strong>解決:</strong> 各メソッドでtimerをinvalidateする
        </p>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- ナビゲーション -->
<section>
  <div class="grid">
    <div class="s6">
      <a
        href="{base}/projects/timer/step3"
        class="button transparent primary-text"
      >
        <i>arrow_back</i>
        <span>Step 3に戻る</span>
      </a>
    </div>
    <div class="s6 right-align">
      <a href="{base}/projects/timer/step5" class="button primary">
        <span>Step 5へ進む</span>
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

  .code-container {
    position: relative;
    margin: 1rem 0;
  }

  .code-container.small {
    margin: 0.5rem 0;
  }


  .code-container button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }

  .error-container {
    border-left: 4px solid var(--error);
  }

  ol,
  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.25rem 0;
  }
</style>
