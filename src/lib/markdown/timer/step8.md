---
title: ステップ8: カスタムボタンによるUIの仕上げ(ColorButton, ContentView)
summary: ColorButtonコンポーネントを作成してボタンのデザインを統一し、状態に応じたボタンの出し分けを実装してアプリを完成させます。
---

## 1. ColorButtonコンポーネント

ボタンコンポーネント（`ColorButton.swift`）を編集します。

```swift
import SwiftUI

struct ColorButton: View {
    var body: some View {
    }
}
```

- `import SwiftUI` は SwiftUI フレームワークを読み込み、宣言した `View` を使えるようにします。
- `struct ColorButton: View` で `ColorButton` コンポーネント（ビュー）を定義します。
- `var body: some View` はビューの見た目を返す場所です。ここに UI の構成を記述します。

struct ColorButton: View {}内に追加

```swift
let text: String
let color: Color
let action: () -> Void
```

- `let text: String` はボタンに表示するテキストを受け取るプロパティです。
- `let color: Color` はボタンやテキストに使う色を受け取るプロパティです。呼び出し側で色を切り替えることで見た目を変えられます。
- `let action: () -> Void` はボタンが押されたときに実行するクロージャ（処理）を受け取ります。

var body: some View {}内に追加

```
Button(action: action) {
}
.frame(width: 90, height: 90)
.background(color.opacity(0.2))
.clipShape(Circle())
```

- `Button(action: action) { ... }` は押下時に `action` を実行する標準的な SwiftUI のボタンです。中括弧内にボタンのラベル（見た目）を定義します。
- `.frame(width: 90, height: 90)` でボタンのサイズを固定しています。円形にするために幅と高さを揃えています。
- `.background(color.opacity(0.2))` はボタンの背景色を設定します。`opacity(0.2)` で淡い背景にしています。
- `.clipShape(Circle())` で背景を円形に切り抜き、丸いボタンに見せています。

Button(action: action) {}内に追加

```
Text(text)
    .foregroundStyle(color)
    .font(.subheadline)
```

- `Text(text)` は渡された `text` を表示するビューです。
- `.foregroundStyle(color)` によってテキストの色を `color` に応じた見た目にします。
- `.font(.subheadline)` は表示フォントサイズをサブ見出し程度に調整し、ボタン内テキストのバランスを整えます。

ColorButton使用イメージ
<img src="/images/timer/download.jpg" alt="ColorButtonの使用イメージ" class="mobile-screenshot" />

---

## 2. ContentViewの編集

`ColorButton` を使い、タイマーの状態に応じてボタンを切り替えます。

### 1. タイトルの削除

VStack(spacing: 24) {}を編集
以下を削除します

```swift
Text("タイマーアプリ")
    .font(.largeTitle)
    .padding()
```

`VStack(spacing: 24)`を`VStack`に変更します

### 2. 操作ボタンエリア

HStack() {}を編集

```swift
HStack(spacing: 130) {
    ColorButton(text: "キャンセル", color: .black, action: viewModel.stopTimer)
        .opacity(viewModel.timerState == .idle ? 0.3 : 1)
        .disabled(viewModel.timerState == .idle)

    switch viewModel.timerState {
    case .idle:
        ColorButton(text: "開始", color: .green, action: {
            viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
        })
    case .running:
        ColorButton(text: "一時停止", color: .orange, action: viewModel.pauseTimer)
    case .paused:
        ColorButton(text: "再開", color: .green, action: viewModel.restartTimer)
    }
}
```

- キャンセルボタンは待機状態で無効化します（`.disabled()`）。
- `switch` で状態に応じてボタンを切り替えます。

---

## コード全体

<img src="/images/timer/download.jpg" alt="Xcode の設定画面" class="mobile-screenshot" />

```swift title="ColorButton.swift"
// ColorButton.swift
import SwiftUI

struct ColorButton: View {
    let text: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(text)
                .foregroundStyle(color)
                .font(.subheadline)
        }
        .frame(width: 90, height: 90)
        .background(color.opacity(0.2))
        .clipShape(Circle())
    }
}
```

<img src="/images/timer/t82.png" alt="Xcode の設定画面" class="mobile-screenshot" />

```swift title="ContentView.swift"
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
        VStack {
            if viewModel.timerState == .idle {
                TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
            } else {
                TimerDisplayView(remainingTime: viewModel.remainingTime, totalTime: viewModel.totalTime)
            }

            HStack(spacing: 130) {
                ColorButton(text: "キャンセル", color: .black, action: viewModel.stopTimer)
                    .opacity(viewModel.timerState == .idle ? 0.3 : 1)
                    .disabled(viewModel.timerState == .idle)

                switch viewModel.timerState {
                case .idle:
                    ColorButton(text: "開始", color: .green, action: {
                        viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
                    })
                case .running:
                    ColorButton(text: "一時停止", color: .orange, action: viewModel.pauseTimer)
                case .paused:
                    ColorButton(text: "再開", color: .green, action: viewModel.restartTimer)
                }
            }
        }
        .alert("時間です", isPresented: $viewModel.isShowingAlert) {
            Button("完了") {
                viewModel.isShowingAlert = false
                viewModel.stopTimer()
            }
        }
    }
}

```

## 練習問題
![完成イメージ](/images/timer/p8.png)

### 図形テーマ切り替えアプリを作成しよう

カリキュラムでは「カスタムボタン」を作りましたが、ここではもう一歩進んで、**「表示エリア（図形とタイトル）」**をカスタムビューとして切り出してみましょう。引数を受け取って見た目を変更できる柔軟なUIを作成します。

#### 1. 状態の定義
- `ContentView` に、画面の表示内容を保持するための `@State` 変数を3つ用意しましょう。
  - `titleText` (文字列): 初期のタイトル（例: `"スター"`）
  - `shapeText` (文字列): 初期の図形（例: `"★"`）
  - `themeColor` (Color): 初期のテーマカラー（例: `.orange`）

#### 2. 表示エリア（ShapeView）のカスタムビューを作成
- 画面中央の図形とタイトルテキストを表示する部分を、別の構造体 `ShapeView` として切り出します。
- 以下のプロパティを外部から受け取れるようにしましょう。
  - `shape` (文字列): 表示する図形（文字）
  - `title` (文字列): タイトルテキスト
- `VStack` で縦に並べ、白色（`.white`）で表示するように設定します。

#### 3. レイアウトの構築
- `ContentView` の `ZStack` を使用して、指定したテーマカラー（`themeColor`）が画面全体に広がるようにします（`.ignoresSafeArea()` ）。
- 中央に作成した `ShapeView` を呼び出し、引数に `@State` 変数を渡して表示します。

#### 4. ボタンの処理（アクション）
- `ShapeView` の下に `HStack` で3つのボタン（星、丸、四角）を並べましょう。
- ボタンが押されたときに、`titleText`、`shapeText`、`themeColor` の値をそれぞれ対応する文字と色に変更する処理（クロージャ）を実装します。
- ボタン自体の見た目は `.padding()` と `.background(Color.white)` 等を使ってシンプルに装飾しましょう。

### 解答例
```swift title="ContentView.swift"
import SwiftUI

struct ContentView: View {
    // 1. 状態を保持する変数
    @State private var titleText = "スター"
    @State private var shapeText = "★"
    @State private var themeColor: Color = .orange

    var body: some View {
        ZStack {
            // テーマカラーを画面全体に適用
            themeColor.ignoresSafeArea()

            VStack(spacing: 50) {
                // 2 & 3. カスタムビュー（ShapeView）の呼び出し
                ShapeView(shape: shapeText, title: titleText)

                // 4. 標準のButtonを並べて状態を更新する
                HStack(spacing: 20) {
                    Button(action: {
                        titleText = "スター"
                        shapeText = "★"
                        themeColor = .orange
                    }) {
                        Text("星")
                            .font(.title3).bold()
                            .frame(width: 80, height: 80)
                            .background(Color.white)
                            .foregroundColor(.orange)
                            .cornerRadius(15)
                    }

                    Button(action: {
                        titleText = "サークル"
                        shapeText = "●"
                        themeColor = .pink
                    }) {
                        Text("丸")
                            .font(.title3).bold()
                            .frame(width: 80, height: 80)
                            .background(Color.white)
                            .foregroundColor(.pink)
                            .cornerRadius(15)
                    }

                    Button(action: {
                        titleText = "スクエア"
                        shapeText = "■"
                        themeColor = .blue
                    }) {
                        Text("四角")
                            .font(.title3).bold()
                            .frame(width: 80, height: 80)
                            .background(Color.white)
                            .foregroundColor(.blue)
                            .cornerRadius(15)
                    }
                }
            }
            .padding()
        }
    }
}

// 表示エリアのカスタムビュー
struct ShapeView: View {
    // 外部から受け取るデータの定義
    let shape: String
    let title: String

    var body: some View {
        VStack(spacing: 20) {
            Text(shape)
                .font(.system(size: 80))
            Text(title)
                .font(.largeTitle)
                .bold()
        }
        .foregroundColor(.white)
    }
}

#Preview {
    ContentView()
}
```
