---
title: ステップ5: ViewModelとタイマーロジックの実装(TimerViewModel)
summary: TimerViewModelを作成し、Timerクラスを使用したカウントダウン処理や、開始・停止・一時停止などのコアロジックを実装します。
---

## タイマーの「頭脳」を作る (TimerViewModel)

ここでは、タイマーの動き（スタート、ストップ、時間の計算など）を管理する「頭脳」部分を作ります。
SwiftUIでは、この頭脳部分を `ViewModel` (ビューモデル) と呼びます。

```swift
import SwiftUI
import Combine

class TimerViewModel: ObservableObject {
}
```

- `ObservableObject`: 「監視できるオブジェクト」という意味です。このクラスで作られたデータが変わると、画面 (View) に「データが変わったよ！画面を更新して！」と自動で知らせてくれます。
- `Combine`: データの変更を監視したり通知したりするための、便利な道具箱です。

### 1. 変数の定義

タイマーに必要な情報を保存する変数を定義します。

class TimerViewModel: ObservableObject {}内に追加

```swift
@Published var remainingTime = 0
@Published var timerState: TimerState = .idle
var timer: Timer?
var totalTime: Int = 0
```

- `@Published`: 「この変数が変わったら画面を更新する」というマークです。
  - `remainingTime`: 残り時間（秒）。これが減るたびに画面の数字が変わります。
  - `timerState`: 現在の状態（待機中、カウントダウン中、一時停止中）。これによってボタンの表示などを切り替えます。
- `var timer`: 1秒ごとに時間を減らすための「時計役」です。
- `var totalTime`: 最初にセットした時間を覚えておくための変数です。

### 2. メソッド（機能）の作成

タイマーを操作するための命令を作っていきます。

#### countDown (時間のカウント)

1秒ごとに残り時間を減らし、0になったら止める機能です。

var totalTime: Int = 0の下に追加

```swift
func countDown() {
    // 古いタイマーがあれば捨てて、新しいタイマーをセットします
    timer?.invalidate()

    // 1秒ごとに {} の中身を実行するタイマーを作ります
    timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] timer in
        guard let self = self else { return }

        if self.remainingTime > 0 {
            // 時間が残っていれば1秒減らす
            self.remainingTime -= 1
        } else {
            // 時間切れになったら
            timer.invalidate()      // タイマーを止める
            self.timerState = .idle // 状態を「待機中」に戻す
            // ここに後でアラーム音などを追加します
        }
    }
}
```

#### startTimer (スタート)

時間をセットして、カウントダウンを開始します。

func countDown() {}の下に追加

```swift
func startTimer(hours: Int, minutes: Int, seconds: Int) {
    // 選択された時間をすべて「秒」に変換して計算します
    remainingTime = hours * 3600 + minutes * 60 + seconds
    totalTime = remainingTime

    // 状態を「実行中」にします
    timerState = .running

    // カウントダウン開始！
    countDown()
}
```

#### stopTimer (キャンセル)

タイマーを完全に停止して、最初に戻します。

func startTimer() {}の下に追加

```swift
func stopTimer() {
    timerState = .idle // 状態を「待機中」に
    timer?.invalidate() // タイマーを破棄
}
```

#### pauseTimer (一時停止)

時間はそのままにして、カウントダウンだけ止めます。

func stopTimer() {}の下に追加

```swift
func pauseTimer() {
    timerState = .paused // 状態を「一時停止」に
    timer?.invalidate()  // タイマーを一時的に止める
}
```

#### restartTimer (再開)

止まっていたタイマーを再び動かします。

func pauseTimer() {}の下に追加

```swift
func restartTimer() {
    timerState = .running // 状態を「実行中」に
    countDown()           // カウントダウン再開
}
```

---

## コード全体 — TimerViewModel

ここまでの状態では画面の変化はないので次のステップに進んでください。

```swift title="TimerViewModel.swift"
import SwiftUI
import Combine

class TimerViewModel: ObservableObject {
    // 画面更新が必要な変数
    @Published var remainingTime = 0
    @Published var timerState: TimerState = .idle

    // 内部で使う変数
    var timer: Timer?
    var totalTime: Int = 0

    // カウントダウンの処理
    func countDown() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] timer in
            guard let self = self else { return }

            if self.remainingTime > 0 {
                self.remainingTime -= 1
            } else {
                timer.invalidate()
                self.timerState = .idle
            }
        }
    }

    // タイマー開始
    func startTimer(hours: Int, minutes: Int, seconds: Int) {
        remainingTime = hours * 3600 + minutes * 60 + seconds
        totalTime = remainingTime
        timerState = .running
        countDown()
    }

    // タイマー停止（キャンセル）
    func stopTimer() {
        timerState = .idle
        timer?.invalidate()
    }

    // 一時停止
    func pauseTimer() {
        timerState = .paused
        timer?.invalidate()
    }

    // 再開
    func restartTimer() {
        timerState = .running
        countDown()
    }
}
```

---

このステップでは「裏側の処理(ビジネスロジック)」を作りました。画面には何も変化が現れませんが、次のステップ以降でこのViewModelを使ってタイマーの動作を実装していきます。

## 練習問題
![完成イメージ](/images/timer/p5.png)

### ストップウォッチを実装しよう

学んだカウントダウンタイマーのロジック（`ObservableObject` と `Timer`）を応用して、1秒ずつカウントアップする「ストップウォッチ」を作成してみましょう。

#### 1. ロジック部分（StopwatchViewModel）の作成
- `ObservableObject` プロトコルに準拠した `StopwatchViewModel` クラスを作成します。
- 以下の変数を定義しましょう。
  - `elapsedTime`: 経過時間（秒）。`@Published` を付けます。
  - `isRunning`: 実行中かどうか。`@Published` を付けます。
- 以下のメソッドを実装します。
  - `start()`: 1秒ごとに `elapsedTime` を `+1` するタイマーを開始します（二重起動に注意しましょう）。
  - `stop()`: タイマーを停止し、`isRunning` を `false` にします。
  - `reset()`: タイマーを停止し、`elapsedTime` を `0` に戻します。

#### 2. UI部分（ContentView）の実装
- `@StateObject` を使用して `StopwatchViewModel` をインスタンス化し、状態を監視できるようにします。
- `Text` を配置し、`viewModel.elapsedTime` を秒単位で表示します。
- `HStack` を使い、「スタート」「ストップ」「リセット」の3つのボタンを配置しましょう。
- `.disabled()` モディファイアを使用して、実行中は「スタート」ボタンを、停止中は「ストップ」ボタンを押せないように制御してみましょう。


### 解答例

```swift title="ContentView.swift"
import SwiftUI
import Combine

// 1. ロジック部分（ViewModel）
class StopwatchViewModel: ObservableObject {
    @Published var elapsedTime = 0
    @Published var isRunning = false

    var timer: Timer?

    func start() {
        // すでに動いている場合は何もしない（二重起動防止）
        guard !isRunning else { return }

        isRunning = true
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            self.elapsedTime += 1
        }
    }

    func stop() {
        isRunning = false
        timer?.invalidate()
        timer = nil
    }

    func reset() {
        stop()
        elapsedTime = 0
    }
}

// 2. UI部分（View）
struct ContentView: View {
    // さきほど作ったクラスをインスタンス化して状態を監視する
    @StateObject private var viewModel = StopwatchViewModel()

    var body: some View {
        VStack(spacing: 40) {
            // 値が変わると自動的に画面が更新される
            Text("\(viewModel.elapsedTime) 秒")
                .font(.system(size: 50, weight: .bold))

            HStack(spacing: 20) {
                Button("スタート") {
                    viewModel.start()
                }
                .disabled(viewModel.isRunning) // 動いている時は押せないようにする

                Button("ストップ") {
                    viewModel.stop()
                }
                .disabled(!viewModel.isRunning) // 止まっている時は押せないようにする

                Button("リセット") {
                    viewModel.reset()
                }
            }
            .buttonStyle(.borderedProminent)
        }
    }
}

#Preview {
    ContentView()
}
```
