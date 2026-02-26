---
title: ステップ2: 基本的なUIの構築(ContentView.swift)
summary: ContentViewでVStack/HStackを使ったレイアウトを作成し、TimerStateと@Stateによる状態管理を導入します。
---

## swiftUIの基本構造

```
import SwiftUI

struct ContentView: View {
    var body: some View {
    }
}

#Preview {
    ContentView()
}

```

このコードは、SwiftUIで画面(View)を定義するための最小構成です。
アプリの画面はすべて、このような View の組み合わせで作られています。

### 1. TimerState enum

import SwiftUIの次の行に追加

```swift
enum TimerState {
    case idle
    case running
    case paused
}
```

まず、タイマーの状態を管理する変数を定義します。

- `idle`: 待機中
- `running`: 実行中
- `paused`: 一時停止

### 2. @State

struct ContentView: View {}内に追加

```swift
@State var timerState: TimerState = .idle
@State var hours = 0
@State var minutes = 0
@State var seconds = 0
```

- `@State` は View が保持する状態を表し、値が変わると自動で再描画されます。
- タイマーの残り時間や現在の状態（`TimerState`）、時間設定に使います。

### 3. 基本レイアウト — VStack と HStack

var body: some View {}内に追加

```swift
VStack(spacing: 24) {
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

- `VStack` は縦方向にビューを並べます。
- `HStack` は横方向にビューを並べます。
- `spacing` や `alignment` を調整して見た目を整えます。

### コード全体 — ContentView

画面左上のピンマークを押してPreviewを固定表示しておきましょう！

<img src="/images/timer/t21.png" alt="Xcode の設定画面" class="mobile-screenshot" />

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
        VStack(spacing: 24) {
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

## 練習問題

<img src="/images/timer/practice-step2.png" alt="練習問題の完成イメージ" />

1.  **テキストの変更**
    `Text("タイマーアプリ")` の部分を、あなたの好きな名前に変更してみましょう（例：「マイタイマー」、「勉強用タイマー」など）。

2.  **ボタンの色の変更**
    「開始」ボタンの背景色（現在は `Color.green`）を青（`Color.blue`）に、「キャンセル」ボタンの背景色（現在は `Color.gray`）を赤（`Color.red`）に変更してみましょう。

3.  **新しいボタンの追加**
    HStack の中に、もう一つ「一時停止」というボタンを追加してみましょう。色はオレンジ（`Color.orange`）に設定してみてください。

### 解答例

ContentViewの `body` の中身を以下のように変更します。

```swift
    var body: some View {
        VStack(spacing: 24) {
            // 1. テキストの変更
            Text("マイタイマー")
                .font(.largeTitle)
                .padding()
            HStack {
                // 2. ボタンの色の変更 (green -> blue)
                Button("開始") {
                }
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(10)

                // 3. 新しいボタンの追加
                Button("一時停止") {
                }
                .padding()
                .background(Color.orange)
                .foregroundColor(.white)
                .cornerRadius(10)

                // 2. ボタンの色の変更 (gray -> red)
                Button("キャンセル") {
                }
                .padding()
                .background(Color.red)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
        }
        .padding()
    }


```
