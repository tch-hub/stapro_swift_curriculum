---
title: ステップ7: アラームとアラート機能の追加(TimerViewModel, ContentView)
summary: AVFoundationを用いてタイマー終了時に音を鳴らし、Alertでユーザーに通知する機能を追加します。
---

### 1. 音声ファイルの準備

まず、アラーム音として鳴らすための音声ファイルを用意しましょう。
<a href="/source/Alarm.mp3" download="Alarm.mp3" class="text-blue-500 hover:underline">
音声ファイル (Alarm.mp3)
</a>
をダウンロードして、Xcodeのアプリ制作ナビゲータ内にある `Timer` フォルダに配置してください。

### 2. 必要な「道具」の準備(TimerViewModel.swift)

音を扱ったり、アラートを表示したりするための変数を追加します。

import Combineの下に追加

```swift
import AVFoundation
```

- `AVFoundation`: iPhoneで音を鳴らすための「専門ツールセット」のようなものです。これをインポートすることで、音楽再生の機能が使えるようになります。

`var timerState` などの変数を定義している場所の下に追加

```swift
var isShowingAlert = false
var audioPlayer: AVAudioPlayer?
```

- `isShowingAlert`: アラートを表示するかどうかを決める「スイッチ」です。最初は `false` (オフ) ですが、タイマーが終了したら `true` (オン) にします。
- `audioPlayer`: 音楽を再生するための「プレイヤー」です。最初はまだ何もセットされていないので `?` (空っぽかもしれない) がついています。

### 3. 音を鳴らす機能 (メソッド) を作る(TimerViewModel.swift)

実際に音を再生する `playSound` という命令（メソッド）を作ります。

func restartTimer() {}の下に追加

```swift
func playSound() {
    // 1. アプリの中から "Alarm.mp3" というファイルを探します
    guard let url = Bundle.main.url(forResource: "Alarm", withExtension: "mp3") else { return }

    do {
        // 2. プレイヤーにファイルの場所を教えて、準備させます
        audioPlayer = try AVAudioPlayer(contentsOf: url)
        // 3. 再生します！
        audioPlayer?.play()
    } catch {
        // もし何らかの理由で再生できなかったら、ここにきます
        print("音声ファイルが再生できませんでした")
    }
}
```

- `guard let url = ...`: 「もしファイルが見つからなかったら、そこで中止！」という安全装置です。アプリがクラッシュするのを防ぎます。
- `do { ... } catch { ... }`: 「音の再生を試してみるよ (`do`)。でももし失敗したら、エラーを報告してね (`catch`)」という仕組みです。

### 4. カウントダウン終了時に音を鳴らす(TimerViewModel.swift)

タイマーが0になったとき、先ほど作った「スイッチ」と「音」を作動させるように書き換えます。

func countDown() {} の中身を編集

```swift
func countDown() {
    timer?.invalidate()
    
    let newTimer = Timer(timeInterval: 1, repeats: true) { [weak self] timer in
        guard let self else { return }

        if self.remainingTime > 0 {
            // まだ時間が残っているなら、1秒減らす
            self.remainingTime -= 1
        } else {
            // 時間切れ！ (0になったとき)
            timer.invalidate()          // タイマーを止める
            self.timerState = .idle     // 状態を「待機中」に戻す
            self.isShowingAlert = true  // アラート表示スイッチをON！
            self.playSound()            // 音を鳴らす！
        }
    }
    
    RunLoop.main.add(newTimer, forMode: .common)
    self.timer = newTimer
}
```

### 5. 画面にアラートを表示する(ContentView.swift)

最後に、`ContentView`（画面側）でスイッチがONになったときにアラートを表示する設定を追加します。

`.animation(.default, value: viewModel.timerState)` の下（`VStack`の最後）に記述

```swift
.alert("時間です", isPresented: $viewModel.isShowingAlert) {
    Button("完了") {
        viewModel.isShowingAlert = false
        viewModel.stopTimer()
    }
}
```

- `.alert(...)`: `isShowingAlert` が `true` になった瞬間、自動的にポップアップを表示します。
- `Button("完了")`: ユーザーがこのボタンを押すと、後片付け（スイッチOFF、音停止）をして元の画面に戻ります。

---

## コード全体

```swift title="TimerViewModel.swift"
import Foundation
import AVFoundation

@Observable
class TimerViewModel {
    var remainingTime = 0
    var timerState: TimerState = .idle
    var isShowingAlert = false

    private var timer: Timer?
    private(set) var totalTime: Int = 0
    var audioPlayer: AVAudioPlayer?

    func countDown() {
        timer?.invalidate()
        
        let newTimer = Timer(timeInterval: 1, repeats: true) { [weak self] timer in
            guard let self else { return }

            if self.remainingTime > 0 {
                self.remainingTime -= 1
            } else {
                timer.invalidate()
                self.timerState = .idle
                self.isShowingAlert = true
                self.playSound()
            }
        }
        
        RunLoop.main.add(newTimer, forMode: .common)
        self.timer = newTimer
    }

    func startTimer(hours: Int, minutes: Int, seconds: Int) {
        remainingTime = hours * 3600 + minutes * 60 + seconds
        totalTime = remainingTime
        timerState = .running
        countDown()
    }

    func stopTimer() {
        timerState = .idle
        timer?.invalidate()
        audioPlayer?.stop()
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
        guard let url = Bundle.main.url(forResource: "Alarm", withExtension: "mp3") else { return }
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: url)
            audioPlayer?.play()
        } catch {
            print("音声ファイルが再生できませんでした")
        }
    }
}
```

<img src="/images/timer/t71.png" alt="Xcode の設定画面" class="mobile-screenshot" />

```swift title="ContentView.swift"
import SwiftUI

enum TimerState {
    case idle
    case running
    case paused
}

struct ContentView: View {
    @State private var viewModel = TimerViewModel()
    @State private var hours = 0
    @State private var minutes = 0
    @State private var seconds = 0

    private var isTimerUnset: Bool {
        viewModel.timerState == .idle && hours == 0 && minutes == 0 && seconds == 0
    }

    private var primaryButtonLabel: String {
        switch viewModel.timerState {
        case .running: return "一時停止"
        case .paused:  return "再開"
        case .idle:    return "開始"
        }
    }

    var body: some View {
        VStack(spacing: 24) {
            Text("タイマーアプリ")
                .font(.largeTitle)
                .padding()

            if viewModel.timerState == .idle {
                TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
            } else {
                TimerDisplayView(remainingTime: viewModel.remainingTime, totalTime: viewModel.totalTime)
            }

            HStack(spacing: 16) {
                Button(primaryButtonLabel) {
                    withAnimation {
                        switch viewModel.timerState {
                        case .idle:
                            viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
                        case .running:
                            viewModel.pauseTimer()
                        case .paused:
                            viewModel.restartTimer()
                        }
                    }
                }
                .tint(viewModel.timerState == .running ? .yellow : .green)
                .disabled(isTimerUnset)

                Button("キャンセル") {
                    withAnimation {
                        viewModel.stopTimer()
                        (hours, minutes, seconds) = (0, 0, 0)
                    }
                }
                .tint(.gray)
                .disabled(isTimerUnset)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
        }
        .padding()
        .animation(.default, value: viewModel.timerState)
        .alert("時間です", isPresented: $viewModel.isShowingAlert) {
            Button("完了") {
                viewModel.isShowingAlert = false
                viewModel.stopTimer()
            }
        }
    }
}

#Preview {
    ContentView()
}
```

## 練習問題

![完成イメージ](/images/timer/p7.png)

### 確認アラートを実装しよう

このステップで学んだ「アラート（`.alert`）」機能を使って、カウンターの数値をリセットする前に「本当にリセットしますか？」という確認ダイアログを表示するUIを作成してみましょう。

#### 1. ViewModel（CounterViewModel）の作成

- `@Observable` マクロを付けた `CounterViewModel` クラスを作成します。
- 以下の変数を定義してください。
  - `count`: 数値（初期値 10など）
  - `isShowingAlert`: アラートを表示するかどうかを管理するスイッチ
- `count` を `0` に戻す `resetCount()` メソッドを実装します。

#### 2. UI（ContentView）の構築

- `VStack` を使い、現在の数値（`count`）と「リセット」ボタンを配置します。
- リセットボタンがタップされたとき、`isShowingAlert` を `true` に変更するようにしましょう。

#### 3. アラートの実装

- `.alert` モディファイアを使用して、`isShowingAlert` が `true` になったときにポップアップを表示します。
- アラートのタイトルを「本当にリセットしますか？」とし、以下の2つのボタンを配置してください。
  - 「キャンセル」ボタン： `role: .cancel` を指定します。
  - 「リセット」ボタン： `role: .destructive` を指定し、押されたときに `resetCount()` を実行します。
- `message` 部分に「これまでのカウントは消去されます。」という説明も追加してみましょう。

### ヒント
```swift title="ContentView.swift"
import SwiftUI
import Combine

// 1. ViewModelでアラート状態を管理する
@Observable
class CounterViewModel {
    // ヒント: iOS 17以降は、特別なマークをつけなくても変数は自動で監視されます
    var count = 10
    // ヒント: アラートを表示するかどうかを判定する「スイッチ」の役割をする変数
    var isShowingAlert = false

    func resetCount() {
        // ヒント: カウントの値を「0」に戻そう
        /* ここに処理を書く */
    }
}

struct ContentView: View {
    // ヒント: ViewModelをインスタンス化して保持するためのキーワード（@...）を使おう
    /* ここにキーワードを書く */ private var viewModel = CounterViewModel()

    var body: some View {
        VStack(spacing: 40) {
            // ヒント: viewModelの持っている「count」を表示しよう
            Text("カウンター: \( /* ここに変数を書く */ )")
                .font(.largeTitle)

            Button("数値をリセットする") {
                // ヒント: ボタンが押されたら、viewModelの「アラートを表示するスイッチ（isShowingAlert）」をON（true）にしよう
                /* ここに処理を書く */
            }
            .buttonStyle(.borderedProminent)
            .tint(.orange)
            .controlSize(.large)
        }
        .padding()
        // 2. ViewModelのフラグに連動してアラートを表示
        // ヒント: isPresentedには、viewModelのisShowingAlertを渡すが、
        // 単なる値ではなく「状態の参照」を渡すため、先頭に「$」をつける必要がある
        .alert("本当にリセットしますか？", isPresented: /* ここに「$」から始まる変数を書く */ ) {
            Button("キャンセル", role: .cancel) { }
            Button("リセット", role: .destructive) {
                // ヒント: 本当にリセットして良いと確認できたので、viewModelの「リセットするメソッド」を呼び出そう
                /* ここに処理を書く */
            }
        } message: {
            Text("これまでのカウントは消去されます。")
        }
    }
}

#Preview {
    ContentView()
}

```

### 解答例

```swift title="ContentView.swift"
import SwiftUI
import Combine

// 1. ViewModelでアラート状態を管理する
@Observable
class CounterViewModel {
    var count = 10
    var isShowingAlert = false

    func resetCount() {
        count = 0
    }
}

struct ContentView: View {
    @State private var viewModel = CounterViewModel()

    var body: some View {
        VStack(spacing: 40) {
            Text("カウンター: \(viewModel.count)")
                .font(.largeTitle)

            Button("数値をリセットする") {
                // アラートを表示するスイッチをON
                viewModel.isShowingAlert = true
            }
            .buttonStyle(.borderedProminent)
            .tint(.orange)
            .controlSize(.large)
        }
        .padding()
        // 2. ViewModelのフラグに連動してアラートを表示
        .alert("本当にリセットしますか？", isPresented: $viewModel.isShowingAlert) {
            Button("キャンセル", role: .cancel) { }
            Button("リセット", role: .destructive) {
                viewModel.resetCount()
            }
        } message: {
            Text("これまでのカウントは消去されます。")
        }
    }
}

#Preview {
    ContentView()
}
```
