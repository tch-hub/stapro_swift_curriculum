# ステップ5: ViewModelの作成

## 1. TimerViewModel

タイマーの振る舞い（時間管理・開始/停止/一時停止）を扱う `TimerViewModel` を作ります。

### 1. 変数の定義

```swift
@Published var remainingTime = 0
@Published var timerState: TimerState = .idle
var timer: Timer?
var totalTime: Int = 0
```

- `@Published` で標記したプロパティが変わると、View が自動的に再描画されます。
- `remainingTime` はタイマーの残り時間を、`timerState` はタイマーの状態（待機・実行・一時停止）を保持します。
- `timer` は Timer インスタンスを管理し、`totalTime` は最初の合計時間を保持します。

### 2. ObservableObjectの役割

```swift
class TimerViewModel: ObservableObject {
    @Published var remainingTime = 0
    @Published var timerState: TimerState = .idle
}
```

- `ObservableObject` を継承することで、View がこの ViewModel インスタンスを監視できるようになります。
- `@Published` が付いたプロパティが変わると、View に通知され自動的に再描画されます。

### 3. メソッドの定義

```swift
func startTimer(hours: Int, minutes: Int, seconds: Int) {
    remainingTime = hours * 3600 + minutes * 60 + seconds
    totalTime = remainingTime
    timerState = .running
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
}
```

- `startTimer()` は選択された時間をセットして実行状態に変更します。
- `stopTimer()` はタイマーを無効化して待機状態に戻します。
- `pauseTimer()` はタイマーを一時停止します。
- `restartTimer()` は一時停止状態から再開します。

### 4. ContentViewでの利用

```swift
@StateObject var viewModel = TimerViewModel()

Button("開始") {
    viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
}

Button("一時停止") {
    viewModel.pauseTimer()
}
```

- `@StateObject` で ViewModel インスタンスを作成し、View がその変更を監視できるようにします。
- ボタンが押されると ViewModel のメソッドが呼び出され、状態が更新されます。

---

## コード全体

以下は TimerViewModel の全体ソースコードです（コピーしてそのまま使えます）。

```swift title="TimerViewModel.swift"
import SwiftUI
import Combine

class TimerViewModel: ObservableObject {
    @Published var remainingTime = 0
    @Published var timerState: TimerState = .idle

    var timer: Timer?
    var totalTime: Int = 0

    func startTimer(hours: Int, minutes: Int, seconds: Int) {
        remainingTime = hours * 3600 + minutes * 60 + seconds
        totalTime = remainingTime
        timerState = .running
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
    }
}
```
