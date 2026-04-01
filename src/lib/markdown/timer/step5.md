---
title: ステップ5: ViewModelとタイマーロジックの実装(TimerViewModel)
summary: TimerViewModelを作成し、Timerクラスを使用したカウントダウン処理や、開始・停止・一時停止などのコアロジックを実装します。
---

## タイマーの「頭脳」を作る (TimerViewModel)

ここでは、タイマーの動き（スタート、ストップ、時間の計算など）を管理する「頭脳」部分を作ります。
SwiftUIでは、この頭脳部分を `ViewModel` (ビューモデル) と呼びます。

```swift
import Foundation

@Observable
class TimerViewModel {
}
```

- `@Observable`: iOS 17以降で使える、データの変更を監視するためのマーク（マクロ）です。このクラスで作られた変数の値が変わると、画面 (View) に「データが変わったよ！画面を更新して！」と自動で知らせてくれます。これまでの `@State` と似たような感覚で扱えます。

### 1. 変数の定義

タイマーに必要な情報を保存する変数を定義します。

`@Observable class TimerViewModel {}` 内に追加

```swift
var remainingTime = 0
var timerState: TimerState = .idle

private var timer: Timer?
private(set) var totalTime: Int = 0
```

- `remainingTime`: 残り時間（秒）。これが減るたびに画面の数字が変わります。
- `timerState`: 現在の状態（待機中、カウントダウン中、一時停止中）。これによってボタンの表示などを切り替えます。
- `private var timer`: `private` をつけると「このクラスの内側からしか使えない変数」になり、外部からの予期せぬタイマーの書き換えを防ぎます。
- `private(set) var totalTime`: `private(set)` は「読み取りはどこからでもできるが、変更はこのクラス内でしかできない」という、さらに安全な設定です。

### 2. メソッド（機能）の作成

タイマーを操作するための命令を作っていきます。

#### countDown (時間のカウント)

1秒ごとに残り時間を減らし、0になったら止める機能です。

var totalTime: Int = 0の下に追加

```swift
func countDown() {
    timer?.invalidate()
    
    let newTimer = Timer(timeInterval: 1, repeats: true) { [weak self] timer in
        guard let self else { return }

        if self.remainingTime > 0 {
            self.remainingTime -= 1
        } else {
            timer.invalidate()
            self.timerState = .idle
        }
    }
    
    RunLoop.main.add(newTimer, forMode: .common)
    self.timer = newTimer
}
```

- `timer?.invalidate()`: 古いタイマーが動いていれば止めて捨てます（二重起動の防止）。
- `guard let self else { return }`: 自分がメモリから消えていた場合は処理を安全に中断します（Swiftの最新の簡潔な書き方です）。
- `RunLoop.main.add(newTimer, forMode: .common)`: ピッカー（ドラムロール）など、他の画面操作をしている最中でもタイマーが止まらないようにするための「おまじない」です。

#### startTimer (スタート)

時間をセットして、カウントダウンを開始します。

func countDown() {}の下に追加

```swift
func startTimer(hours: Int, minutes: Int, seconds: Int) {
    remainingTime = hours * 3600 + minutes * 60 + seconds
    totalTime = remainingTime
    timerState = .running
    countDown()
}
```

#### stopTimer (キャンセル)

タイマーを完全に停止して、最初に戻します。

func startTimer() {}の下に追加

```swift
func stopTimer() {
    timerState = .idle
    timer?.invalidate()
}
```

#### pauseTimer (一時停止)

時間はそのままにして、カウントダウンだけ止めます。

func stopTimer() {}の下に追加

```swift
func pauseTimer() {
    timerState = .paused
    timer?.invalidate()
}
```

#### restartTimer (再開)

止まっていたタイマーを再び動かします。

func pauseTimer() {}の下に追加

```swift
func restartTimer() {
    timerState = .running
    countDown()
}
```

---

## コード全体 — TimerViewModel

ここまでの状態では画面の変化はないので次のステップに進んでください。

```swift title="TimerViewModel.swift"
import Foundation

@Observable
class TimerViewModel {
    var remainingTime = 0
    var timerState: TimerState = .idle

    private var timer: Timer?
    private(set) var totalTime: Int = 0

    func countDown() {
        timer?.invalidate()
        
        let newTimer = Timer(timeInterval: 1, repeats: true) { [weak self] timer in
            guard let self else { return }

            if self.remainingTime > 0 {
                self.remainingTime -= 1
            } else {
                timer.invalidate()
                self.timerState = .idle
            }
        }
        
        RunLoop.main.add(newTimer, forMode: .common)
        self.timer = newTimer
    }

    func startTimer(hours: Int, minutes: Int, seconds: Int) {
        remainingTime = hours * 3600 + minutes * 60 + seconds
        totalTime = remainingTime
        timerState = .running
        countDown()
    }

    func stopTimer() {
        timerState = .idle
        timer?.invalidate()
    }

    func pauseTimer() {
        timerState = .paused
        timer?.invalidate()
    }

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

学んだカウントダウンタイマーのロジック（`@Observable` と `Timer`）を応用して、1秒ずつカウントアップする「ストップウォッチ」を作成してみましょう。

#### 1. ロジック部分（StopwatchViewModel）の作成

- `@Observable` マクロを付けた `StopwatchViewModel` クラスを作成します。
- 以下の変数を定義しましょう。
  - `elapsedTime`: 経過時間（秒）。初期値は0。
  - `isRunning`: 実行中かどうか。初期値はfalse。
- 以下のメソッドを実装します。
  - `start()`: 1秒ごとに `elapsedTime` を `+1` するタイマーを開始します（二重起動に注意しましょう）。また、`RunLoop` の設定も忘れないようにしましょう。
  - `stop()`: タイマーを停止し、`isRunning` を `false` にします。
  - `reset()`: タイマーを停止し、`elapsedTime` を `0` に戻します。

#### 2. UI部分（ContentView）の実装

- `@State` を使用して `StopwatchViewModel` をインスタンス化し、状態を保持できるようにします。
- `Text` を配置し、`viewModel.elapsedTime` を秒単位で表示します。
- `HStack` を使い、「スタート」「ストップ」「リセット」の3つのボタンを配置しましょう。
- `.disabled()` モディファイアを使用して、実行中は「スタート」ボタンを、停止中は「ストップ」ボタンを押せないように制御してみましょう。

### ヒント

```swift title="ContentView.swift"
import SwiftUI
import Foundation

// 1. ロジック部分（ViewModel）
@Observable
class StopwatchViewModel {
    var elapsedTime = 0
    var isRunning = false

    var timer: Timer?

    func start() {
    }

    func stop() {
    }

    func reset() {
    }
}

// 2. UI部分（View）
struct ContentView: View {
    // さきほど作ったクラスをインスタンス化して状態を保持する
    @State private var viewModel = StopwatchViewModel()

    var body: some View {
        VStack(spacing: 40) {
            // 値が変わると自動的に画面が更新される
            Text("\(viewModel.elapsedTime) 秒")
                .font(.system(size: 50, weight: .bold))

            HStack(spacing: 20) {
                Button("スタート") {
                    viewModel.start()
                }
                .disabled(viewModel.isRunning)

                Button("ストップ") {
                    viewModel.stop()
                }
                .disabled(!viewModel.isRunning)

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


### 解答例

```swift title="ContentView.swift"
import SwiftUI
import Foundation

// 1. ロジック部分（ViewModel）
@Observable
class StopwatchViewModel {
    var elapsedTime = 0
    var isRunning = false

    var timer: Timer?

    func start() {
        // すでに動いている場合は何もしない（二重起動防止）
        guard !isRunning else { return }

        isRunning = true
        let newTimer = Timer(timeInterval: 1, repeats: true) { [weak self] _ in
            guard let self else { return }
            self.elapsedTime += 1
        }
        RunLoop.main.add(newTimer, forMode: .common)
        self.timer = newTimer
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
    // さきほど作ったクラスをインスタンス化して状態を保持する
    @State private var viewModel = StopwatchViewModel()

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
