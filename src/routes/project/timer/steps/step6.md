### 1. ContentViewの更新

```swift
// @State var timerState: TimerState = .idleの上に追加
@StateObject var viewModel = TimerViewModel()
```

- `@StateObject` で ViewModel インスタンスを作成し、View がその変更を監視できるようにします。

```swift
// Button("開始") {timerState = .running}を書き換え
Button("開始") {
    viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
}
```

- "開始"ボタンが押されたときに、ViewModel の `startTimer` メソッドを呼び出すように変更します。

```swift
// Button("キャンセル") {}の下に追加
Button("一時停止") {
    viewModel.pauseTimer()
}
```

- 新しく"一時停止"ボタンを追加し、ViewModel の `pauseTimer` メソッドを呼び出します。


---

## コード全体 — ContentView
<img src="/images/timer/t51.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />


```swift 
// ContentView.swift
import SwiftUI

struct ContentView: View {
    @StateObject var viewModel = TimerViewModel()
    @State var timerState: TimerState = .idle
    @State var hours = 0
    @State var minutes = 0
    @State var seconds = 0

    var body: some View {
        VStack(spacing: 24) {
            Text("タイマーアプリ")
                .font(.largeTitle)
                .padding()

            // 時間選択は待機時のみ表示
            if timerState == .idle {
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
                    timerState = .idle
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
