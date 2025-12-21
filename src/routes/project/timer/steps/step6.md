### 1. ContentViewの更新

まずは、`ContentView` が `TimerViewModel` を使うように変更します。

```swift
// @State var timerState... を削除し、代わりに以下を追加
@StateObject var viewModel = TimerViewModel()
```

- アプリの状態管理を `TimerViewModel` に任せるため、`@StateObject` を定義します。
- ローカルで管理していた `timerState` は不要になるので削除します。

```swift
// if timerState == .idle { を書き換え
if viewModel.timerState == .idle {
```

- 画面の切り替え判定も `viewModel` の状態を見るように変更します。

```swift
// Button("開始") { ... } を書き換え
Button("開始") {
    viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
}
```

- "開始"ボタンで `viewModel.startTimer` を呼び出します。

```swift
// Button("キャンセル") { ... } を書き換え
Button("キャンセル") {
    viewModel.stopTimer()
    hours = 0; minutes = 0; seconds = 0
}
```

- "キャンセル"ボタンで `viewModel.stopTimer` を呼び出します。

```swift
// Button("キャンセル") { ... } の下に追加
Button("一時停止") {
    viewModel.pauseTimer()
}
```

- 新しく"一時停止"ボタンを追加し、`viewModel.pauseTimer` を呼び出します。

---

## コード全体 — ContentView

<img src="/images/timer/t51.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
// ContentView.swift
import SwiftUI

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
        VStack(spacing: 24) {
            Text("タイマーアプリ")
                .font(.largeTitle)
                .padding()

            // 時間選択は待機時のみ表示
            if viewModel.timerState == .idle {
                TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
            } else {
                Text("タイマーが実行中です")
                    .font(.title)
            }

            HStack(spacing: 16) {
                Button("開始") {
                    viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
                }
                .padding()
                .background(Color.green)
                .foregroundColor(.white)
                .cornerRadius(10)

                Button("キャンセル") {
                    viewModel.stopTimer()
                    hours = 0; minutes = 0; seconds = 0
                }
                .padding()
                .background(Color.gray)
                .foregroundColor(.white)
                .cornerRadius(10)

                Button("一時停止") {
                    viewModel.pauseTimer()
                }
                .padding()
                .background(Color.orange)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
        }
        .padding()
    }
}

#Preview {
    ContentView()
}

```
