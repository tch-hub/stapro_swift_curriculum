# ステップ4: タイマー表示ビューの実装

<script>
    import {base} from '$app/paths';
</script>

## 1. TimerDisplayView

タイマーの残り時間を大きく表示し、円形の進捗インジケーターで視覚化するビュー(`TimerDisplayView.swift`)を作ります。

### 1. 変数の定義

```swift
var remainingTime: Int
var totalTime: Int
```

- `remainingTime` は現在の残り時間（秒）を受け取ります。
- `totalTime` は最初に設定した合計時間（秒）を受け取ります。

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

### 3. 時刻文字列の整形

```swift
func formatTime(seconds: Int) -> String {
    let hours = seconds / 3600
    let minutes = (seconds % 3600) / 60
    let seconds = seconds % 60
    return String(format: "%02d:%02d:%02d", hours, minutes, seconds)
}
```

- 秒数を HH:MM:SS の形式に変換するヘルパー関数です。
- タイマーの残り時間を見やすい形式で表示します。

### 4. UIの作成

```swift
var body: some View {
    ZStack {
        // 円形プログレス（一部のみを描画）
        Circle()
            .trim(from: 0.0, to: CGFloat(completionPercentage))
            .stroke(style: StrokeStyle(lineWidth: 10, lineCap: .round))
            .foregroundColor(.orange)
            .rotationEffect(Angle(degrees: 270))
            .animation(.linear, value: completionPercentage)
            .padding(10)

        // 中央に残り時間を表示
        Text(formatTime(seconds: remainingTime))
            .font(.system(size: 70))
    }
}
```

- `ZStack` で円形進捗と時間表示テキストを重ねます。
- `Circle().trim(from: 0.0, to: CGFloat(completionPercentage))` で、進捗に応じて円弧の一部を描画します。
- `.rotationEffect(Angle(degrees: 270))` で円弧を上（12時）方向から開始するように回転します。
- `.animation(.linear, value: completionPercentage)` で、進捗の変化を滑らかにアニメーションさせます。
- `StrokeStyle(lineWidth: 10, lineCap: .round)` で線幅と線端の丸みを調整します。

---

## コード全体

以下はこのビューの全体ソースコードです（コピーしてそのまま使えます）。

```swift title="TimerDisplayView.swift"
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
