### 1. ContentViewの更新

まずは、`ContentView` が `TimerViewModel` を使うように変更します。

@State var timerState... を削除し、代わりに以下を追加

```swift
@StateObject var viewModel = TimerViewModel()
```

- アプリの状態管理を `TimerViewModel` に任せるため、`@StateObject` を定義します。
- ローカルで管理していた `timerState` は不要になるので削除します。

if timerState == .idle { を書き換え

```swift
if viewModel.timerState == .idle {
```

- 画面の切り替え判定も `viewModel` の状態を見るように変更します。

else { ... } ブロックの中身を書き換え

```swift
} else {
    TimerDisplayView(remainingTime: viewModel.remainingTime, totalTime: viewModel.totalTime)
}
```

- ステップ4で作成した `TimerDisplayView` を使用して、残り時間を表示するようにします。

Button("開始") { ... } を書き換え

```swift
Button("開始") {
    viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
}
```

- "開始"ボタンで `viewModel.startTimer` を呼び出します。

Button("キャンセル") { ... } を書き換え

```swift
Button("キャンセル") {
    viewModel.stopTimer()
    hours = 0; minutes = 0; seconds = 0
}
```

- "キャンセル"ボタンで `viewModel.stopTimer` を呼び出します。

Button("キャンセル") { ... } の下に追加

```swift
Button("一時停止") {
    viewModel.pauseTimer()
}
```

- 新しく"一時停止"ボタンを追加し、`viewModel.pauseTimer` を呼び出します。

---

## コード全体 — ContentView

<img src="/images/timer/t61.png" alt="Xcode の設定画面" class="mobile-screenshot" />

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
                TimerDisplayView(remainingTime: viewModel.remainingTime, totalTime: viewModel.totalTime)
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

