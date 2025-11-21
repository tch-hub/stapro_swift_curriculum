# ステップ7: アラーム機能の実装

このステップでは、カウントダウン終了時にアラート表示と音声再生を行う仕組みを追加します。
先に要点と短いコード例を示し、最後に `TimerViewModel` 全体の実装をまとめて掲載します。

### 1. AVFoundationとアラームの準備

- AVFoundation を使って音声を再生します。ViewModel 側で `AVAudioPlayer` を保持し、終了時に再生します。
- アラート表示のための `@Published var isShowingAlert` を用意して View と連携します。

コード例（AVAudioPlayer と isShowingAlert の最小例）:

```swift
import AVFoundation

class TimerViewModel: ObservableObject {
    @Published var isShowingAlert = false
    var audioPlayer: AVAudioPlayer?

    func playSound() {
        // Bundle から音声をロードして再生する処理
    }
}
```

---

### 2. 音声ファイルの追加

- 音声ファイル (例: Alarm.mp3) を Xcode のプロジェクトに追加し、ターゲットに含めます。
- アプリ内リソースとして Bundle に置けば `Bundle.main.url(forResource:withExtension:)` で取得できます。

コード例（Bundle から URL を取得する例）:

```swift
guard let url = Bundle.main.url(forResource: "Alarm", withExtension: "mp3") else {
    // ファイルが見つからない場合の処理
    return
}
```

---

### 3. Alertで終了を通知

- カウントダウンが終わったら `isShowingAlert = true` をセットして View 側でアラートを表示します。
- アラートのボタンで音声停止や状態リセットを行います。

コード例（View の .alert）:

```swift
.alert("時間です", isPresented: $viewModel.isShowingAlert) {
    Button("完了") {
        viewModel.isShowingAlert = false
        viewModel.timerState = .idle
        viewModel.audioPlayer?.stop()
    }
}
```

---

### 4. Alertの基本構文

- `.alert("タイトル", isPresented: $isPresented)` の形でモーダルが出せます。
- ボタンの中で `isPresented` や他の状態を更新して閉じます。

コード例（最小構文）:

```swift
Text("完了")
    .alert("通知", isPresented: $isShowing) {
        Button("OK") { isShowing = false }
    }
```

---

### 5. テスト

1. 5秒など短時間のタイマーで終了処理を確認してください。
2. 終了時に `isShowingAlert` が true に変わり、アラートと音声が正しく動くかを確認します。

テスト補助コード（短時間確認の例）:

```swift
viewModel.startTimer(hours: 0, minutes: 0, seconds: 5)
// カウントダウン終了でアラートと再生が発生するかをチェック
```

---

### コード全体 — TimerViewModel のアラーム対応

以下は ViewModel にアラーム再生とアラート用フラグを追加した全体実装です。既存の countDown と playSound を合わせて動作する例です。

```swift
import SwiftUI
import Combine
import AVFoundation

class TimerViewModel: ObservableObject {
    @Published var remainingTime = 0
    @Published var timerState: TimerState = .idle
    @Published var isShowingAlert = false

    var timer: Timer?
    var totalTime: Int = 0
    var audioPlayer: AVAudioPlayer?

    func startTimer(hours: Int, minutes: Int, seconds: Int) {
        remainingTime = hours * 3600 + minutes * 60 + seconds
        totalTime = remainingTime
        timerState = .running
        countDown()
    }

    func countDown() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] timer in
            guard let self = self else { return }
            DispatchQueue.main.async {
                if self.remainingTime > 0 {
                    self.remainingTime -= 1
                } else {
                    timer.invalidate()
                    self.timerState = .idle
                    self.isShowingAlert = true
                    self.playSound()
                }
            }
        }
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
}
```
