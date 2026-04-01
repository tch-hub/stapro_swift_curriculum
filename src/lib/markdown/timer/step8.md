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

`struct ColorButton: View {...}`内に追加
```swift
let text: String
let color: Color
let action: () -> Void
```

- `let text: String` はボタンに表示するテキストを受け取るプロパティです。
- `let color: Color` はボタンやテキストに使う色を受け取るプロパティです。呼び出し側で色を切り替えることで見た目を変えられます。
- `let action: () -> Void` はボタンが押されたときに実行するクロージャ（処理）を受け取ります。

`var body: some View {...}`内に追加
```swift
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

`Button(action: action) {...}`内に追加
```swift
Text(text)
    .foregroundStyle(color)
    .font(.subheadline)
```

- `Text(text)` は渡された `text` を表示するビューです。
- `.foregroundStyle(color)` によってテキストの色を `color` に応じた見た目にします。
- `.font(.subheadline)` は表示フォントサイズをサブ見出し程度に調整し、ボタン内テキストのバランスを整えます。

ColorButton使用イメージ
<img src="/images/timer/t81.png" alt="ColorButtonの使用イメージ" class="mobile-screenshot" />

---

## 2. ContentViewの編集

`ColorButton` を使い、タイマーの状態に応じてボタンを切り替えます。

### 1. タイトルの削除

`VStack(spacing: 24) {}`を編集
以下を削除します
```swift
Text("タイマーアプリ")
    .font(.largeTitle)
    .padding()
```

`VStack(spacing: 24)`を`VStack`に変更します

### 2. 操作ボタンエリア

`HStack(spacing: 16) {...}`を編集

```swift
HStack(spacing: 130) {
    ColorButton(text: "キャンセル", color: .gray, action: {
        withAnimation {
            viewModel.stopTimer()
            (hours, minutes, seconds) = (0, 0, 0)
        }
    })
    .opacity(isTimerUnset ? 0.3 : 1)
    .disabled(isTimerUnset)

    switch viewModel.timerState {
    case .idle:
        ColorButton(text: "開始", color: .green, action: {
            withAnimation {
                viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
            }
        })
    case .running:
        ColorButton(text: "一時停止", color: .orange, action: {
            withAnimation {
                viewModel.pauseTimer()
            }
        })
    case .paused:
        ColorButton(text: "再開", color: .green, action: {
            withAnimation {
                viewModel.restartTimer()
            }
        })
    }
}
```

- 時間選択中のキャンセルボタンは少し薄く（`.opacity(0.3)`）して無効化（`.disabled`）します。
- メインボタンは `switch` を使って、状態ごとに色・テキスト・機能が設定された `ColorButton` に切り替えます。

---

## コード全体

<img src="/images/timer/t81.png" alt="ColorButtonの使用イメージ" class="mobile-screenshot" />

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
    @State private var viewModel = TimerViewModel()
    @State private var hours = 0
    @State private var minutes = 0
    @State private var seconds = 0

    private var isTimerUnset: Bool {
        viewModel.timerState == .idle && hours == 0 && minutes == 0 && seconds == 0
    }

    var body: some View {
        VStack {
            if viewModel.timerState == .idle {
                TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
            } else {
                TimerDisplayView(remainingTime: viewModel.remainingTime, totalTime: viewModel.totalTime)
            }

            HStack(spacing: 130) {
                ColorButton(text: "キャンセル", color: .gray, action: {
                    withAnimation {
                        viewModel.stopTimer()
                        (hours, minutes, seconds) = (0, 0, 0)
                    }
                })
                .opacity(isTimerUnset ? 0.3 : 1)
                .disabled(isTimerUnset)

                switch viewModel.timerState {
                case .idle:
                    ColorButton(text: "開始", color: .green, action: {
                        withAnimation {
                            viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
                        }
                    })
                case .running:
                    ColorButton(text: "一時停止", color: .orange, action: {
                        withAnimation {
                            viewModel.pauseTimer()
                        }
                    })
                case .paused:
                    ColorButton(text: "再開", color: .green, action: {
                        withAnimation {
                            viewModel.restartTimer()
                        }
                    })
                }
            }
        }
        .padding()
        .animation(.default, value: viewModel.timerState)
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
- ボタン自体の見た目は `.buttonStyle(.borderedProminent)` 等を使って使いやすく整えてみましょう。

### ヒント

```swift title="ContentView.swift"
import SwiftUI

// ヒント: 文字列(String)の生値(rawValue)を持たせ、さらにForEachで全ケースをループできるように
// 2つのプロトコル（String と CaseIterable）を適用しよう
enum ShapeOption: /* ここにプロトコルを2つカンマ区切りで書く */ {
    case star = "星"
    case circle = "丸"
    case square = "四角"
    
    var symbol: String {
        // ヒント: 自分自身（現在選択されているcase）によって条件分岐させるキーワードを書こう
        switch /* ここにキーワードを書く */ {
        case .star: return "★"
        case .circle: return "●"
        case .square: return "■"
        }
    }
    
    var color: Color {
        switch self {
        case .star: return .orange
        case .circle: return .pink
        case .square: return .blue
        }
    }
}

struct ContentView: View {
    // ヒント: 今回はViewModelを使わず、この画面(View)の中だけで状態を管理する。
    // 単純な値の変化を監視して画面を更新するためのプロパティラッパー（@...）を使おう
    /* ここにキーワードを書く */ private var selectedShape: ShapeOption = .star

    var body: some View {
        ZStack {
            selectedShape.color.ignoresSafeArea()
            VStack(spacing: 50) {
                // ヒント: 選択された図形(selectedShape)の「記号(symbol)」と「文字列の生値(rawValue)」を渡そう
                ShapeView(shape: selectedShape./* ここに変数を書く */, title: selectedShape./* ここに変数を書く */)

                HStack {
                    // ヒント: ShapeOptionに定義されたすべてのcaseを配列として取得するためのプロパティを書こう
                    ForEach(ShapeOption./* ここにプロパティを書く */, id: \.self) { option in
                        // ヒント: ボタンのテキストには、ループで回ってきたoptionの「文字列の生値(rawValue)」を表示させよう
                        Button(option./* ここに変数を書く */) {
                            // ヒント: ボタンが押されたら、現在の選択状態(selectedShape)を、この「option」で上書きしよう
                            /* ここに処理を書く */
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(option.color.opacity(0.8))
                    }
                }
            }
        }
    }
}

struct ShapeView: View {
    let shape: String
    let title: String

    var body: some View {
        VStack {
            Text(shape)
            Text(title)
        }
    }
}

#Preview {
    ContentView()
}
```

### 解答例
```swift title="ContentView.swift"
import SwiftUI

enum ShapeOption: String, CaseIterable {
    case star = "星"
    case circle = "丸"
    case square = "四角"
    
    var symbol: String {
        switch self {
        case .star: return "★"
        case .circle: return "●"
        case .square: return "■"
        }
    }
    
    var color: Color {
        switch self {
        case .star: return .orange
        case .circle: return .pink
        case .square: return .blue
        }
    }
}

struct ContentView: View {
    @State private var selectedShape: ShapeOption = .star

    var body: some View {
        ZStack {
            selectedShape.color.ignoresSafeArea()

            VStack(spacing: 50) {
                ShapeView(shape: selectedShape.symbol, title: selectedShape.rawValue)

                HStack(spacing: 20) {
                    ForEach(ShapeOption.allCases, id: \.self) { option in
                        Button(action: {
                            withAnimation {
                                selectedShape = option
                            }
                        }) {
                            Text(option.rawValue)
                                .font(.title3).bold()
                                .frame(width: 80, height: 80)
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(option.color.opacity(0.8))
                        .clipShape(Circle())
                        .shadow(radius: 5)
                    }
                }
            }
            .padding()
        }
        .animation(.default, value: selectedShape)
    }
}

struct ShapeView: View {
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
