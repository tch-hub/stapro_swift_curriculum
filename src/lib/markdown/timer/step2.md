---
title: ステップ2: 基本的なUIの構築(ContentView.swift)
summary: ContentViewでVStack/HStackを使ったレイアウトを作成し、TimerStateと@Stateによる状態管理を導入します。
---

## swiftUIの基本構造

```swift title="ContentView.swift"
import SwiftUI

struct ContentView: View {
    /* ここに変数を書く */
    var body: some View {
        /* ここにUIを書く */
    }
}

#Preview {
    ContentView()
}

```

このコードは、SwiftUIで画面(View)を定義するための最小構成です。
アプリの画面はすべて、このような View の組み合わせで作られています。

### 1. TimerState enum

`import SwiftUI`の次の行に追加

```swift title="ContentView.swift"
enum TimerState {
    case idle
    case running
    case paused
}
```

まず、タイマーの状態を管理する変数を定義します。

| ステータス | 詳細 |
| :--- | :--- |
| `idle` | 待機中 |
| `running` | 実行中 |
| `paused` | 一時停止 |

### 2. @State

`struct ContentView: View {}`内に追加

```swift title="ContentView.swift"
@State private var timerState: TimerState = .idle
@State private var hours = 0
@State private var minutes = 0
@State private var seconds = 0
```

- `@State` は View が保持する状態を表し、値が変わると自動で再描画されます。
- タイマーの残り時間や現在の状態（`TimerState`）、時間設定に使います。

### 3. 基本レイアウト — VStack と HStack

`var body: some View {}`内に追加

```swift title="ContentView.swift"
VStack(spacing: 24) {
    Text("タイマーアプリ")
        .font(.largeTitle)
        .padding()

    HStack(spacing: 16) {
        Button("開始") { }
            .tint(.green)

        Button("キャンセル") { }
            .tint(.gray)
    }
    .buttonStyle(.borderedProminent)
    .controlSize(.large)
}
```

- `VStack` は縦方向にビューを並べます。
- `HStack` は横方向にビューを並べます。
- `spacing` を調整して見た目を整えます。
- `.buttonStyle(.borderedProminent)` や `.tint()` を使って、モダンなボタンの見た目を設定します。

---

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
    @State private var timerState: TimerState = .idle
    @State private var hours = 0
    @State private var minutes = 0
    @State private var seconds = 0

    var body: some View {
        VStack(spacing: 24) {
            Text("タイマーアプリ")
                .font(.largeTitle)
                .padding()
            
            HStack(spacing: 16) {
                Button("開始") {
                    // タイマーを開始する処理
                }
                .tint(.green)

                Button("キャンセル") {
                    // キャンセル処理
                }
                .tint(.gray)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
```

## 練習問題

![完成イメージ](/images/timer/p2.png)

### お気に入りボタンを実装しよう

`@State` と `Button` を組み合わせて、クリックするたびに見た目が変わるボタンを作成してみましょう。

#### 1. 状態の定義

- `isFavorite` という名前の `@State` 変数（Bool型）を定義し、初期値を `false` に設定します。

#### 2. ボタンの実装

- `Button` を作成し、中身のテキストを `isFavorite` の値に応じて切り替えます。
  - `true` の場合： "★"
  - `false` の場合： "☆"
- ボタンが押されたとき（アクション）に、`isFavorite` の値を反転（`.toggle()`）させるようにしましょう。

#### 3. 見た目の調整

- テキストのフォントサイズを大きく調整します。
- ボタンの背景色を `isFavorite` の値に応じて切り替えます。
  - `true` の場合： 赤色（`.red`）
  - `false` の場合： グレー（`.gray`）
- ボタンの形を円形（`.clipShape(Circle())`）に切り抜き、幅と高さを `240` に設定してみましょう。

### ヒント

```swift title="ContentView.swift"
import SwiftUI

struct ContentView: View {

    var body: some View {
        Button("☆") {
        }
        .font(.system(size: 120))
        .frame(width: 240, height: 240)
        .foregroundColor(.white)
        .background(Color.gray)
        .clipShape(Circle())
    }
}

#Preview {
    ContentView()
}
```

### 解答例

```swift title="ContentView.swift"
import SwiftUI

struct ContentView: View {
    @State var isFavorite = false

    var body: some View {
        Button(isFavorite ? "★" : "☆") {
            isFavorite.toggle()
        }
        .font(.system(size: 120))
        .frame(width: 240, height: 240)
        .foregroundColor(.white)
        .background(isFavorite ? Color.red : Color.gray)
        .clipShape(Circle())
    }
}

#Preview {
    ContentView()
}
```
