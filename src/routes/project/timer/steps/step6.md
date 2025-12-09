# ステップ6: タイマーロジックの追加

<script>
    import {base} from '$app/paths';
</script>

## 1. countDownメソッド

タイマーを1秒ごとに進めるロジック（`countDown`）を `TimerViewModel` に追加します。

### 1. Timerの基本構文

```swift
timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
    // ここに1秒ごとの処理
}
```

- `withTimeInterval: 1` で1秒ごとに処理を実行します。
- `repeats: true` で繰り返し実行するように設定します。
- クロージャ内に1秒ごとに実行する処理を記述します。

### 2. 残り時間の更新

```swift
{ [weak self] timer in
    guard let self = self else { return }

    if self.remainingTime > 0 {
        self.remainingTime -= 1
    } else {
        timer.invalidate()
        self.timerState = .idle
    }
}
```

- `[weak self]` でメモリリークを防ぎます。
- `guard let self = self else { return }` で自身が存在することを確認します。
- 残り時間が 0 より大きければ1秒減らし、0になればタイマーを停止します。

### 3. メインスレッドでのUI更新

```swift
DispatchQueue.main.async {
    if self.remainingTime > 0 {
        self.remainingTime -= 1
    } else {
        timer.invalidate()
        self.timerState = .idle
    }
}
```

- UI 更新は必ずメインスレッドで行う必要があります。
- `DispatchQueue.main.async` でメインスレッドに処理を切り替えます。

### 4. タイマーの安全な管理

```swift
// 既存タイマーを停止してから新規作成
timer?.invalidate()
timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
    // 処理
}
```

- 新しいタイマーを作る前に既存のタイマーを停止します。
- 二重実行を防ぐため `timer?.invalidate()` で安全に停止します。

---

## コード全体

以下は `TimerViewModel` に追加する `countDown()` メソッドの実装です。

```swift title="TimerViewModel.swift（countDownメソッドの追加）"
func countDown() {
    // 既存タイマーを停止
    timer?.invalidate()

    timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] timer in
        guard let self = self else { return }

        // UI 更新はメインスレッドで
        DispatchQueue.main.async {
            if self.remainingTime > 0 {
                self.remainingTime -= 1
            } else {
                timer.invalidate()
                self.timerState = .idle
            }
        }
    }
}
```

`startTimer()` と `restartTimer()` から `countDown()` を呼び出すように修正します。

```swift
func startTimer(hours: Int, minutes: Int, seconds: Int) {
    remainingTime = hours * 3600 + minutes * 60 + seconds
    totalTime = remainingTime
    timerState = .running
    countDown()  // 追加
}

func restartTimer() {
    timerState = .running
    countDown()  // 追加
}
```
