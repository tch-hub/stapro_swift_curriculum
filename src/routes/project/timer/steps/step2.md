# ステップ2: ViewModelの基礎

### 1. TimerState enum

まず、タイマーの状態を管理する変数を定義します。

- `idle`: 待機中
- `running`: 実行中
- `paused`: 一時停止

```swift
import SwiftUI

enum TimerState {
    case idle
    case running
    case paused
}
```

### 2. @State

- `@State` は View が保持する状態を表し、値が変わると自動で再描画されます。
- タイマーの残り時間や現在の状態（`TimerState`）、時間設定に使います。

```swift
@State var timerState: TimerState = .idle
@State var hours = 0
@State var minutes = 0
@State var seconds = 0
```

### 3. 基本レイアウト — VStack と HStack

- `VStack` は縦方向にビューを並べます。
- `HStack` は横方向にビューを並べます。
- `spacing` や `alignment` を調整して見た目を整えます。

```swift
VStack {
    Text("タイマーアプリ")
        .font(.largeTitle)
        .padding()

    HStack(spacing: 16) {
        Button("開始") { }
            .padding()
            .background(Color.green)
            .foregroundColor(.white)
            .cornerRadius(10)

        Button("キャンセル") { }
            .padding()
            .background(Color.gray)
            .foregroundColor(.white)
            .cornerRadius(10)
    }
}
```

### コード全体 — ContentView

以下はこのビューの全体ソースコードです。タイマーのロジックは別ステップで追加します。

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift title="ContentView.swift"
import SwiftUI

enum TimerState {
    case idle
    case running
    case paused
}

struct ContentView: View {
    @State var timerState: TimerState = .idle
    @State var hours = 0
    @State var minutes = 0
    @State var seconds = 0

    var body: some View {
        VStack {
            Text("タイマーアプリ")
                .font(.largeTitle)
                .padding()
            HStack {
                Button("開始") {
                    // タイマーを開始する処理（後で実装）
                }
                .padding()
                .background(Color.green)
                .foregroundColor(.white)
                .cornerRadius(10)

                Button("キャンセル") {
                    // キャンセル処理
                }
                .padding()
                .background(Color.gray)
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
