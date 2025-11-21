# ステップ5: ViewModelの作成

このステップではタイマーの振る舞い（時間管理・開始/停止/一時停止）を扱う `TimerViewModel` を実装します。
以下で役割とポイントを説明し、最後にクラス全体のコードをまとめて掲載します。

### 1. TimerViewModelの骨組み

- ViewModel はタイマー状態や残り時間、Timer インスタンスを保持します。
- View 側は ViewModel の公開プロパティを監視し、自動的に UI を更新できます。

コード例（プロパティとメソッドの宣言例、冒頭のみ）:

```swift
import Combine

class TimerViewModel: ObservableObject {
    @Published var remainingTime = 0
    @Published var timerState: TimerState = .idle

    // Timer 管理用
    var timer: Timer?
    var totalTime: Int = 0

    func startTimer(hours: Int, minutes: Int, seconds: Int) {
        // 実装は下の完全なコードを参照
    }
}
```

---

### 2. ObservableObjectと@Publishedの関係

- `ObservableObject` を継承したクラスの中で `@Published` を使うと、プロパティ変更が View に通知されます。

コード例（@Published が View に反映する仕組みのイメージ）:

```swift
class TimerViewModel: ObservableObject {
    @Published var remainingTime = 0 // 変更時に View が再描画される
}

// View 側
@StateObject var viewModel = TimerViewModel()
Text("残り: \(viewModel.remainingTime)")
```

---

### 3. ContentViewからViewModelを使う

- `@StateObject` で ViewModel を作成し、ボタンや UI の操作から ViewModel のメソッドを呼び出します。

コード例（ContentView での利用例）:

```swift
@StateObject var viewModel = TimerViewModel()

Button("開始") {
    viewModel.startTimer(hours: 0, minutes: 5, seconds: 0)
}

Button("停止") {
    viewModel.stopTimer()
}
```

---

### 4. MVVMの役割

- Model: データ（時間や設定）を表す。
- View: UI 表示とユーザー操作（SwiftUI の View）。
- ViewModel: View と Model の橋渡し。UI に依存しないロジック（タイマーの進行や状態遷移）をまとめる。

コード例（役割のスニペット）:

```swift
// Model: 単純なデータ構造
struct TimerData { var totalSeconds: Int }

// ViewModel: TimerData を扱う
class TimerViewModel: ObservableObject {
    @Published var model: TimerData
    init(total: Int) { model = TimerData(totalSeconds: total) }
}

// View: ViewModel を監視して表示
@StateObject var viewModel = TimerViewModel(total: 60)
Text("合計: \(viewModel.model.totalSeconds) 秒")
```

---

### コード全体 — TimerViewModel

以下は TimerViewModel の全体ソースコードです（コピーしてそのまま使えます）。

```swift
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
        // 後でcountDownを呼び出す
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
        // 後でcountDownを呼び出す
    }
}
```
