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

Xcodeで新規プロジェクト（App）を作成し、このステップで学んだカスタムビュー（引数付きのビュー）を利用して、タイトル（String）と色（Color）を受け取ってデザインされたボタンを返す `CustomButton` ビューを定義し、それをContentViewで複数並べてみましょう。

1. **カスタムビューの作成**
   `CustomButton` という名前の新しい構造体（View）を作成し、プロパティとして `title: String` 、 `color: Color`、 `action: () -> Void` を持つようにしてください。
2. **カスタムビューのUI定義**
   内部で標準の `Button` を使い、受け取った `title` と `color` を使ってボタンの見た目（テキスト、背景色、角丸など）を定義してください。
3. **ContentViewでの利用**
   `ContentView` の `VStack` の中に、先ほど作った `CustomButton` を3つ（赤・青・緑など）並べて配置し、それぞれの色とテキストを指定してください。

### 解答例

以下のようにファイルを分けて（もしくは同じファイル内で）実装します。

```swift title="CustomButton.swift"
import SwiftUI

struct CustomButton: View {
    let title: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.headline)
                .frame(maxWidth: .infinity)
        }
        .padding()
        .background(color)
        .foregroundColor(.white)
        .cornerRadius(12)
    }
}
```

```swift title="ContentView.swift"
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("カスタムコンポーネント")
                .font(.title)

            CustomButton(title: "赤いボタン", color: .red) {
                print("赤が押されました")
            }
            
            CustomButton(title: "青いボタン", color: .blue) {
                print("青が押されました")
            }
            
            CustomButton(title: "緑のボタン", color: .green) {
                print("緑が押されました")
            }
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
```
