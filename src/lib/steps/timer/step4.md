## swiftUIの基本構造

```
import SwiftUI

struct TimerDisplayView: View {
    var body: some View {
    }
}
#Preview {
    TimerDisplayView(remainingTime: 10 * 60, totalTime: 60 * 60)
}

```

このコードは、タイマーの残り時間を円形プログレスバーとテキストで表示するための View です。
`ContentView` から切り離して、表示専用の部品として作成します。

### 1. 変数の定義

struct TimerDisplayView: View {}内に追加

```swift
var remainingTime: Int
var totalTime: Int
var completionPercentage: Double {
    return (totalTime > 0) ? (Double(remainingTime) / Double(totalTime)) : 1
}
```

親ビュー（ContentView）からデータを受け取るための変数を定義します。

- `remainingTime` : 親から受け取る、現在の残り時間（秒）。
- `totalTime` : 親から受け取る、設定された合計時間（秒）。
- `completionPercentage` : 円形バーの進捗（0.0〜1.0）を計算する計算プロパティです。ゼロ除算を防ぐため、`totalTime` が 0 より大きいかチェックしています。

### 2. UIの作成

var body: some View {}内に追加

```swift
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
```

円形のプログレスバーと時間を重ねて表示します。

- `ZStack`: 奥行き方向に View を重ねます。ここでは `Circle`（円）の上に `Text`（時間）を乗せています。
- `Circle()`: 円を描画します。
  - `.trim(...)`: 円の一部だけを描画します。`completionPercentage` に応じて円の長さが変わります。
  - `.stroke(...)`: 塗りつぶしではなく、線として描画します。
  - `.rotationEffect(...)`: デフォルトでは右（0度）から始まるため、上（270度）から始まるように回転させます。
  - `.animation(...)`: 値が変化したときに滑らかにアニメーションさせます。

### 3. 時刻文字列の整形

var body: some View {}の下に追加

```swift
func formatTime(seconds: Int) -> String {
    let hours = seconds / 3600
    let minutes = (seconds % 3600) / 60
    let seconds = seconds % 60
    return String(format: "%02d:%02d:%02d", hours, minutes, seconds)
}
```

秒数（Int）を "時:分:秒" の形式（String）に変換する関数です。

- `%02d` は「2桁の整数で、足りない場合は0埋めする」という意味です（例: 5 → "05"）。

---

## コード全体 — TimerDisplayView

<img src="/images/timer/t42.png" alt="Xcode の設定画面" class="mobile-screenshot" />

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

