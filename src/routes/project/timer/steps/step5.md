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
