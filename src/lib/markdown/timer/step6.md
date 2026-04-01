---
title: ステップ6: ViewModelのUIへの反映(ContentView)
summary: ContentViewにViewModel(@StateObject)を組み込み、各ボタンのアクションをViewModelのメソッドに接続します。
---

### 1. ViewModelと計算プロパティの導入

まずは、`ContentView` が `TimerViewModel` を持てるようにし、UIの状態をわかりやすくする計算プロパティを追加します。

```swift
@State private var viewModel = TimerViewModel()
```

- アプリの状態管理を `TimerViewModel` に任せるため、`@State` を使ってインスタンス化します（iOS 17の `@Observable` を使う際は `@StateObject` ではなく `@State` と書きます）。
- `ContentView` が持っていた古い `timerState` は不要なので削除し、今後の状態はすべて `viewModel.timerState` を参照します。

続けて、以下のように計算プロパティを追加します。

```swift
private var isTimerUnset: Bool {
    viewModel.timerState == .idle && hours == 0 && minutes == 0 && seconds == 0
}

private var primaryButtonLabel: String {
    switch viewModel.timerState {
    case .running: return "一時停止"
    case .paused:  return "再開"
    case .idle:    return "開始"
    }
}
```

- `isTimerUnset`: タイマーが未設定かどうかを判定し、ボタンを無効化（`.disabled`）するために使います。
- `primaryButtonLabel`: `viewModel.timerState` の状態に応じて、メインボタンのテキストを動的に切り替えます。

### 2. 画面の表示切り替え

時間選択画面とタイマー表示画面の切り替え判定も `viewModel` の状態を見るように変更します。

```swift
if viewModel.timerState == .idle {
    TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
} else {
    TimerDisplayView(remainingTime: viewModel.remainingTime, totalTime: viewModel.totalTime)
}
```

- 待機中（`.idle`）の場合は時間選択画面を、それ以外（実行中・一時停止中）の場合はステップ4で作成した `TimerDisplayView` を表示します。

### 3. ボタンアクションの実装

メインボタン１つで「開始・一時停止・再開」の役割を持たせるため、`switch` 文を使って処理を分けます。

```swift
Button(primaryButtonLabel) {
    withAnimation {
        switch viewModel.timerState {
        case .idle:
            viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
        case .running:
            viewModel.pauseTimer()
        case .paused:
            viewModel.restartTimer()
        }
    }
}
.tint(viewModel.timerState == .running ? .yellow : .green)
.disabled(isTimerUnset)
```

- `switch viewModel.timerState` を使い、状態に応じて適切な機能（開始、一時停止、再開）を呼び出しています。
- `withAnimation` をつけることで、状態の切り替わり時にスムーズなアニメーションが適用されます。

キャンセルボタンの処理も `ViewModel` に合わせます。

```swift
Button("キャンセル") {
    withAnimation {
        viewModel.stopTimer()
        (hours, minutes, seconds) = (0, 0, 0)
    }
}
.tint(.gray)
.disabled(isTimerUnset)
```

- "キャンセル"ボタンが押されたら `viewModel.stopTimer()` を呼び出し、設定時間もすべて `0` にリセットします。

---

## コード全体 — ContentView

<img src="/images/timer/t61.png" alt="Xcode の設定画面" class="mobile-screenshot" />

```swift title="ContentView.swift"
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

    private var primaryButtonLabel: String {
        switch viewModel.timerState {
        case .running: return "一時停止"
        case .paused:  return "再開"
        case .idle:    return "開始"
        }
    }

    var body: some View {
        VStack(spacing: 24) {
            Text("タイマーアプリ")
                .font(.largeTitle)
                .padding()

            if viewModel.timerState == .idle {
                TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
            } else {
                TimerDisplayView(remainingTime: viewModel.remainingTime, totalTime: viewModel.totalTime)
            }

            HStack(spacing: 16) {
                Button(primaryButtonLabel) {
                    withAnimation {
                        switch viewModel.timerState {
                        case .idle:
                            viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
                        case .running:
                            viewModel.pauseTimer()
                        case .paused:
                            viewModel.restartTimer()
                        }
                    }
                }
                .tint(viewModel.timerState == .running ? .yellow : .green)
                .disabled(isTimerUnset)

                Button("キャンセル") {
                    withAnimation {
                        viewModel.stopTimer()
                        (hours, minutes, seconds) = (0, 0, 0)
                    }
                }
                .tint(.gray)
                .disabled(isTimerUnset)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
        }
        .padding()
        .animation(.default, value: viewModel.timerState)
    }
}

#Preview {
    ContentView()
}


```

## 練習問題

![完成イメージ](/images/timer/p6.png)

### 強化できるカウンターを実装しよう

このステップで学んだ `@Observable` を使って、ViewModelが持つデータを画面（UI）に紐づけ、値を増やしたり、増える量を強化（アップグレード）したりできるカウンター画面を作成しましょう。

#### 1. ViewModel（CounterViewModel）の作成

- `@Observable` マクロを付けた `CounterViewModel` クラスを作成します。
- 以下の変数を定義してください（それぞれ初期値を設定します）。
  - `count`: 現在の数値（初期値 0）
  - `step`: 1回で増える量（初期値 1）
  - `cost`: アップグレードに必要なコスト（初期値 10）
- 以下のメソッドを実装します。
  - `increment()`: `count` を `step` の分だけ増やします。
  - `upgrade()`: `count` が `cost` 以上あれば、`count` から `cost` を引き、`step` を増やし、次の `cost` を上げます。

#### 2. UI（ContentView）の実装

- `@State` を使用して `CounterViewModel` をインスタンス化し、画面と紐づけます。
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
@Observable
class CounterViewModel {
    // ヒント: iOS 17以降の書き方では、変数に特別なマークをつけなくても監視対象になります
    var count = 0
    var step = 1
    var cost = 10

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
    // ヒント: ViewModelをインスタンス化して保持するためのキーワード（@...）を使おう
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
@Observable
class CounterViewModel {
    var count = 0
    var step = 1
    var cost = 10

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
    @State private var viewModel = CounterViewModel()

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
