# ステップ7: アラーム機能の実装

<script>
    import {base} from '$app/paths';
</script>

## 1. アラーム機能

カウントダウン終了時にアラート表示と音声再生を行う機能を追加します。

### 1. 必要なプロパティの追加

```swift
import AVFoundation

@Published var isShowingAlert = false
var audioPlayer: AVAudioPlayer?
```

- `@Published var isShowingAlert = false` でアラート表示フラグを管理します。
- `var audioPlayer: AVAudioPlayer?` で音声再生用のプレイヤーを保持します。

### 2. 音声ファイルの準備

```swift
guard let url = Bundle.main.url(forResource: "Alarm", withExtension: "mp3") else {
    return
}
```

- Xcode のプロジェクトに音声ファイル（例：`Alarm.mp3`）を追加します。
- ターゲットに含めることを確認してください。
- `Bundle.main.url(forResource:withExtension:)` でアプリ内リソースから音声を取得します。

### 3. 音声再生メソッド

```swift
func playSound() {
    guard let url = Bundle.main.url(forResource: "Alarm", withExtension: "mp3") else { return }
    do {
        audioPlayer = try AVAudioPlayer(contentsOf: url)
        audioPlayer?.play()
    } catch {
        print("音声ファイルが再生できませんでした")
    }
}
```

- `AVAudioPlayer` を初期化して音声を再生します。
- エラーハンドリングで失敗時もアプリが止まらないようにします。

### 4. countDownメソッドの修正

```swift
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
                self.isShowingAlert = true  // 追加
                self.playSound()            // 追加
            }
        }
    }
}
```

- タイマー終了時に `isShowingAlert = true` を設定します。
- `playSound()` で音声を再生します。

### 5. ContentViewでのアラート表示

```swift
.alert("時間です", isPresented: $viewModel.isShowingAlert) {
    Button("完了") {
        viewModel.isShowingAlert = false
        viewModel.timerState = .idle
        viewModel.audioPlayer?.stop()
    }
}
```

- `.alert()` でアラートダイアログを表示します。
- ボタンを押すと状態をリセットし、音声を停止します。

---

## コード全体

以下は アラーム機能を含む `TimerViewModel` の実装です。

```swift title="TimerViewModel.swift"
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

```
