---
title: ステップ4: タイマー表示ビューの実装(TimerDisplayView)
summary: ZStackと円形プログレスバー(trim/stroke)を使用して、残時間を視覚的に表示するTimerDisplayViewを作成します。
---

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
        .animation(.linear(duration: 1.0), value: completionPercentage)
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
  - `.animation(...)`: 値が変化したときに滑らかにアニメーションさせます。ここでは1.0秒間、一定の速度（linear）でアニメーションするように指定しています。

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
                .animation(.linear(duration: 1.0), value: completionPercentage)
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

## 練習問題

![完成イメージ](/images/timer/p4.png)

### 横型のプログレスバーを実装しよう

これまでは円形のプログレスバーを作成してきましたが、今度は横に伸びるバー（カプセル型）のプログレスバーを作成してみましょう。

#### 1. 前準備

- `remainingTime`（残り時間：10秒）と `totalTime`（合計時間：10秒）を定義します。
- `remainingTime` は `@State` 変数として定義しましょう。

#### 2. 進捗率の計算

- `totalTime` に対する `remainingTime` の割合を `completionPercentage`（Double型）として計算するコードを作成してください。

#### 3. UIの実装

- `ZStack` を使用して、背景となるグレーのバーと、その上に重ねるオレンジ色のバーを作成します。
- 今回は `Circle` ではなく `Capsule` を使用してください。
- バーが左端から伸びるように、`ZStack(alignment: .leading)` を設定しましょう。
- 全体の幅は `300` とし、オレンジ色のバーの幅は `300 * completionPercentage` となるように計算します。

#### 4. アニメーションの実装

- `.onAppear` モディファイアを使用して、画面が表示された瞬間に `remainingTime` を `0` に変更します。
- オレンジ色のバーに `.animation` を適用し、合計時間（`totalTime`）をかけてゆっくりとバーが減っていく様子をアニメーションさせましょう。

> [!TIP]
>
> - **カプセル型を描画する**: `Circle()`（円）の代わりに `Capsule()` と書くことで、横長の角丸バーを描画できます。
> - **ZStackの左寄せ**: `ZStack(alignment: .leading)` と指定すると、重なっている要素がすべて「左端揃え」になります。これでバーが左端から自然に伸びるようになります。
> - **画面表示時の処理 (`.onAppear`)**: 今回は「親の画面から秒数を受け取る」仕組みではなく、1つの画面（`ContentView`）だけで完結してアニメーションの動きを自動テストするために、画面が表示された瞬間に実行される `.onAppear` を使って変数を変更しています。
> - **アニメーションの速度**: `.animation(.linear(duration: Double(totalTime)), value: completionPercentage)` のように `duration` を指定すると、アニメーションにかかる時間（秒）を細かくコントロールできます。

### 解答例

```swift title="ContentView.swift"
import SwiftUI

struct ContentView: View {
    @State private var remainingTime: Int = 10
    let totalTime: Int = 10

    var completionPercentage: Double {
        return (totalTime > 0) ? (Double(remainingTime) / Double(totalTime)) : 1
    }

    var body: some View {
        ZStack(alignment: .leading) {
            Capsule()
                .frame(width: 300, height: 20)
                .foregroundColor(Color.gray.opacity(0.3))
            Capsule()
                .frame(width: 300 * CGFloat(completionPercentage), height: 20)
                .foregroundColor(.orange)
                .animation(.linear(duration: Double(totalTime)), value: completionPercentage)
        }
        .onAppear {
            remainingTime = 0
        }
    }
}

#Preview {
    ContentView()
}
```

### おまけ：別のアニメーション実装方法

今回の練習問題の解答例では `暗黙的アニメーション（.animation モディファイア）` と `.onAppear` を組み合わせて実装しましたが、動きや見た目は全く同じまま、別の書き方で実装することもできます。

#### パターン1: `.task` を使う（`onAppear` の代替）

`.onAppear` の代わりに、iOS 15 から導入された **`.task`** モディファイアを使用する方法です。
画面の要素が構築された直後に、非同期で処理を実行します。アニメーションを確実に発動させるために、開始前にごくわずかな時間（タスクのスリープ）を挟むのがコツです。

```swift
        // ZStack の閉じかっこの後を .onAppear から .task に変更
        .task {
            // 画面描画の完了を少しだけ（0.05秒）待つ
            try? await Task.sleep(nanoseconds: 50_000_000)
            remainingTime = 0
        }
```

#### パターン2: `withAnimation` を使う（明示的アニメーション）

カプセル（Capsule）側に `.animation` モディファイアをつけるのではなく、**「変数の値が変わる瞬間」にアニメーションを指定**する方法です。
どちらを用いても動作は同じですが、実務ではアニメーションを適用する対象をコントロールしやすいこの `withAnimation` の書き方もよく使われます。

```swift
        ZStack(alignment: .leading) {
            Capsule()
                .frame(width: 300, height: 20)
                .foregroundColor(Color.gray.opacity(0.3))
            Capsule()
                .frame(width: 300 * CGFloat(completionPercentage), height: 20)
                .foregroundColor(.orange)
                // ※ ここにあった .animation(...) は削除する
        }
        .onAppear {
            // 値を変更する処理自体を withAnimation で囲む
            withAnimation(.linear(duration: Double(totalTime))) {
                remainingTime = 0
            }
        }
```
