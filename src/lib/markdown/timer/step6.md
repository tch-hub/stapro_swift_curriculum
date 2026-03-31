---
title: ステップ6: ViewModelのUIへの反映(ContentView)
summary: ContentViewにViewModel(@StateObject)を組み込み、各ボタンのアクションをViewModelのメソッドに接続します。
---

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

## 練習問題

![完成イメージ](/images/timer/p6.png)

### 強化できるカウンターを実装しよう

このステップで学んだ `@StateObject` を使って、ViewModelが持つデータを画面（UI）に紐づけ、値を増やしたり、増える量を強化（アップグレード）したりできるカウンター画面を作成しましょう。

#### 1. ViewModel（CounterViewModel）の作成

- `ObservableObject` に準拠した `CounterViewModel` クラスを作成します。
- 以下の変数を `@Published` で定義してください。
  - `count`: 現在の数値（初期値 0）
  - `step`: 1回で増える量（初期値 1）
  - `cost`: アップグレードに必要なコスト（初期値 10）
- 以下のメソッドを実装します。
  - `increment()`: `count` を `step` の分だけ増やします。
  - `upgrade()`: `count` が `cost` 以上あれば、`count` から `cost` を引き、`step` を増やし、次の `cost` を上げます。

#### 2. UI（ContentView）の実装

- `@StateObject` を使用して `CounterViewModel` をインスタンス化し、画面と紐づけます。
- 現在の数値（`count`）を表示するテキストを配置します。
- 以下の2つのボタンを作成しましょう。
  1. 「増やす」ボタン：現在の `step` の値を表示し、`increment()` を呼び出します。
  2. 「アップグレード」ボタン：現在の `cost` を表示し、`upgrade()` を呼び出します。
- アップグレードボタンは、`count` が `cost` 未満のときには押せないよう、`.disabled()` モディファイアで制御してみましょう。

### ヒント
```swift title="ContentView.swift"
import SwiftUI
import Combine

// 1. ロジック部分
class CounterViewModel: ObservableObject {
    // ヒント: 画面の表示を自動更新させるために必要なキーワード（@...）をつけて変数を定義しよう
    /* ここにキーワードを書く */ var count = 0
    /* ここにキーワードを書く */ var step = 0
    /* ここにキーワードを書く */ var cost = 0

    func increment() {
        // ヒント: ボタンが押されたら、現在の「count」に「step」の値を足し合わせる
        /* ここにロジックを書く */
    }

    func upgrade() {
        // ヒント: もし「count」が「cost」以上だったら、以下の3つを実行する
        // 1. countからcostを引く（支払う）
        // 2. stepを1増やす（強化）
        // 3. costを10増やす（次回の値上がり）
        /* ここに if文 を使ったロジックを書く */
    }
}

// 2. UI部分
struct ContentView: View {
    // ヒント: ViewModelをインスタンス化して監視するためのキーワード（@...）を使おう
    /* ここにキーワードを書く */ private var viewModel = CounterViewModel()

    var body: some View {
        VStack(spacing: 30) {
            VStack {
                // ヒント: viewModelが持っている「count」の値を表示しよう
                Text("現在の値: \( /* ここに変数を書く */ )")
                    .font(.title)
            }

            // ヒント: viewModelが持っている「step」の値を表示しよう
            Button("＋\( /* ここに変数を書く */ ) 増やす ") {
                // ヒント: viewModelの「増やす」メソッドを呼び出そう
                /* ここに処理を書く */
            }
            .buttonStyle(.borderedProminent)

            // ヒント: viewModelが持っている「cost」の値を表示しよう
            Button("アップグレード (コスト: \( /* ここに変数を書く */ ))") {
                // ヒント: viewModelの「アップグレード」メソッドを呼び出そう
                /* ここに処理を書く */
            }
            .buttonStyle(.bordered)
            // ヒント: もし「count」が「cost」より少なかったら、ボタンを押せないようにしよう
            .disabled( /* ここに条件式を書く */ )
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
import Combine

// 1. ロジック部分
class CounterViewModel: ObservableObject {
    @Published var count = 0
    @Published var step = 1
    @Published var cost = 10

    func increment() {
        count += step
    }

    func upgrade() {
        if count >= cost {
            count -= cost
            step += 1
            cost += 10
        }
    }
}

// 2. UI部分
struct ContentView: View {
    @StateObject private var viewModel = CounterViewModel()

    var body: some View {
        VStack(spacing: 30) {
            VStack {
                Text("現在の値: \(viewModel.count)")
                    .font(.title)
            }

            Button("＋\(viewModel.step) 増やす ") {
                viewModel.increment()
            }
            .buttonStyle(.borderedProminent)

            Button("アップグレード (コスト: \(viewModel.cost))") {
                viewModel.upgrade()
            }
            .buttonStyle(.bordered)
            // コストが足りない場合は無効化
            .disabled(viewModel.count < viewModel.cost)
        }
    }
}

#Preview {
    ContentView()
}

```
