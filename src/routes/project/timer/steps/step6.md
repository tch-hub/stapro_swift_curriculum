# ステップ6: タイマーロジックの追加

このステップでは、タイマーを1秒ごとに進めるロジック（countDown）を追加します。
まず各要素ごとに要点と小さなコード例を示し、最後に完成形の実装をまとめて掲載します。

### 1. countDownメソッドの追加

- タイマーをスケジュールして、残り時間を1秒ずつ減らすメソッドを用意します。
- 残り時間が 0 になったらタイマーを停止し、状態をリセットします。

コード例（メソッドの呼び出しイメージ）:

```swift
// Timer を作成して 1 秒ごとに処理を呼ぶイメージ
func countDown() {
    // 実装は末尾にあるフルコードを参照
}
```

---

### 2. Timerの構文理解

- scheduledTimer の基本は `withTimeInterval`（間隔）と `repeats`（繰り返し）を指定します。
- クロージャ内で残り時間の更新や終了処理を行います。

コード例（Timer の生成）:

```swift
timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
    // ここに 1 秒ごとの処理
}
```

---

### 3. クロージャとは

- クロージャは「値として渡せる処理」で、非同期やコールバック処理で頻繁に使います。

コード例（クロージャの内部処理）:

```swift
{ timer in
    if remainingTime > 0 {
        remainingTime -= 1
    } else {
        timer.invalidate()
        timerState = .idle
    }
}
```

---

### 4. タイマーの管理

- 新しいタイマーを作る前に既存のタイマーを停止して重複実行を防ぎます。
- 安全に停止するには `timer?.invalidate()` を使います。

コード例（安全な開始／停止）:

```swift
// 既存の timer を停止してから新規作成
timer?.invalidate()
timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in /* ... */ }

// 停止
timer?.invalidate()
timer = nil
```

---

### 5. テストステップ

1. 10秒など短時間を設定して動作を確認します。
2. 「開始」ボタンで countDown が正しく動くかをチェック。
3. 「一時停止」「再開」「キャンセル」操作で状態変化が正しく反映されるか確認します。

テスト補助コード（短時間で動作確認する例）:

```swift
// 10秒の簡易テスト
viewModel.startTimer(hours: 0, minutes: 0, seconds: 10)
// ボタンを押して countDown が 10 から 0 まで減るか確認
```

---

### 完成コード — countDown の実装例

下記は `TimerViewModel` 内に入れる `countDown()` の実装例です。既存の timer を無効化してからスケジュールし、残り時間の更新はメインスレッドで行うのが安全です。

```swift
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
                // ここでアラートや通知を出すこともできる
            }
        }
    }
}
```
