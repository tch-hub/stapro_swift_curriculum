# ステップ4: タイマー表示ビューの実装

まずは TimerDisplayView が何をするのかを説明し、最後にファイル（ビュー）全体のコードをまとめて掲載します。

### 1. このビューの役割

- タイマーの残り時間を大きく表示し、円形の進捗インジケーターで視覚化します。
- `remainingTime`（残り秒）と `totalTime`（合計秒）を受け取り、進捗割合を計算して描画します。

コード例（プロパティ受け取りの基本）:

```swift
// 受け取りプロパティとして remainingTime / totalTime を定義
struct TimerDisplayView: View {
    var remainingTime: Int
    var totalTime: Int

    var body: some View {
        // 実装は下でまとめて掲載しています
        EmptyView()
    }
}
```

### 2. UIの構成（ポイント）

- ZStack: 円形進捗と時間表示テキストを重ねるために使用します。
- Circle の trim / rotationEffect: 円弧を切り出して上（12時）方向から開始するように回転します。
- StrokeStyle: 線幅や線端の丸み（lineCap）を調整します。
- animation(.linear, value:): completionPercentage の変化を滑らかに見せます。

コード例（ZStack と Circle の基本）:

```swift
ZStack {
    // 円形プログレス（一部のみを描画）
    Circle()
        .trim(from: 0.0, to: CGFloat(completionPercentage))
        .stroke(style: StrokeStyle(lineWidth: 10, lineCap: .round))
        .rotationEffect(Angle(degrees: 270)) // 12時方向から開始

    // 中央に残り時間を表示
    Text(formatTime(seconds: remainingTime))
        .font(.system(size: 70))
}
```

### 3. 進捗（completionPercentage）の計算

- totalTime が 0 より大きければ残り時間 / 合計時間で割合（0..1）を計算します。
- 合計時間が 0 の場合は 1（満杯）を返すようにして安全にしています。

コード例（completionPercentage の定義）:

```swift
var completionPercentage: Double {
    // 0..1 の範囲で進捗を返す
    return (totalTime > 0) ? (Double(remainingTime) / Double(totalTime)) : 1
}
```

### 4. 時刻文字列の整形

- 秒数を HH:MM:SS の形式に変換するヘルパー関数を用意しています。

コード例（秒数を HH:MM:SS に変換する関数）:

```swift
func formatTime(seconds: Int) -> String {
    let hours = seconds / 3600
    let minutes = (seconds % 3600) / 60
    let seconds = seconds % 60
    return String(format: "%02d:%02d:%02d", hours, minutes, seconds)
}
```

### 5. ContentView での使い方（例）

コンテンツビュー側では、タイマーの状態に応じて時間選択ビューか表示ビューを切り替えます。例:

```swift
if timerState == .idle {
    TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
} else {
    TimerDisplayView(remainingTime: remainingTime, totalTime: totalTime)
}
```

---

### コード全体 — TimerDisplayView

以下はこのビューの全体ソースコードです（コピーしてそのまま使えます）。

```swift
import SwiftUI

struct TimerDisplayView: View {
    var remainingTime: Int
    var totalTime: Int

    var completionPercentage: Double {
        return (totalTime > 0) ? (Double(remainingTime) / Double(totalTime)) : 1
    }

    var body: some View {
        ZStack {
            Circle()
                .trim(from: 0.0, to: CGFloat(completionPercentage))
                .stroke(style: StrokeStyle(lineWidth: 10, lineCap: .round))
                .foregroundColor(.orange)
                .rotationEffect(Angle(degrees: 270))
                .animation(.linear, value: completionPercentage)
                .padding(10)

            Text(formatTime(seconds: remainingTime))
                .font(.system(size: 70))
        }
    }

    func formatTime(seconds: Int) -> String {
        let hours = seconds / 3600
        let minutes = (seconds % 3600) / 60
        let seconds = seconds % 60
        return String(format: "%02d:%02d:%02d", hours, minutes, seconds)
    }
}

#Preview {
    TimerDisplayView(remainingTime: 10 * 60, totalTime: 60 * 60)
}
```
