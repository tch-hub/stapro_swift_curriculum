---
title: ステップ3: 時間選択ビューの実装(TimePicker, TimeSelectionView)
summary: Pickerを使ったTimePickerと、それを組み合わせたTimeSelectionViewを作成し、時間入力UIを実装します。
---

## 1. TimePicker

### 1. swiftUIの基本構造

```swift title="TimePicker.swift"
import SwiftUI

struct TimePicker: View {
    var body: some View {
    }
}

```

### 2. 変数の定義

`struct TimePicker: View {}`内に追加

```swift title="TimePicker.swift"
let title: String
let range: ClosedRange<Int>
@Binding var selection: Int
```

- `title` でタイマーの時間の単位を設定できるようにします。
- `range` でタイマーの分や秒などの数字の選択範囲を設定できるようにします。
- `selection` は`@Binding`を使って同期できるようにします。

### 3. UIの作成

`var body: some View {}`内に追加

```swift title="TimePicker.swift"
Picker(title, selection: $selection) {
}
.pickerStyle(.wheel)
```

- `selection` には `$selection` を渡しており、Pickerで選択した値が親ビューへ即時に伝わります。
- 第一引数に `title`（例えば「時間」「分」「秒」）を渡すことで、Picker のラベルとして表示されます。

`Picker() {}`内に追加

```swift title="TimePicker.swift"
ForEach(range, id: \.self) { value in
}
```

- `ForEach(range, id: \.self)` は `range` で指定された値の一覧をループさせて生成します。

`ForEach() {}`内に追加

```swift title="TimePicker.swift"
Text("\(value) \(title)").tag(value)
```

- `Text("\(value) \(title)")` で表示テキストを構成し、`.tag(value)` によってその行が選択されたときに `selection` に対応する値が設定されます。

## コード全体

<img src="/images/timer/t31.png" alt="TimePicker" class="mobile-screenshot" />

```swift title="TimePicker.swift"
import SwiftUI

struct TimePicker: View {
    let title: String
    let range: ClosedRange<Int>
    @Binding var selection: Int

    var body: some View {
        Picker(title, selection: $selection) {
            ForEach(range, id: \.self) { value in
                Text("\(value) \(title)").tag(value)
            }
        }
        .pickerStyle(.wheel)
    }
}

// 必要に応じてプレビューコードを追加
#Preview {
    @Previewable @State var previewSelection = 0
    
    HStack {
        TimePicker(title: "時間", range: 0...23, selection: $previewSelection)
    }
}

```

---

## 2. TimeSelectionView

`TimePicker`を使って時間選択画面を作ります。

### 1. swiftUIの基本構造

```
import SwiftUI

struct TimeSelectionView: View {
    var body: some View {
    }
}
```

### 2. 変数の定義

struct TimeSelectionView: View {}内に追加

```swift
@Binding var hours: Int
@Binding var minutes: Int
@Binding var seconds: Int
```

- `hours`, `minutes`, `seconds` はそれぞれ `@Binding` として定義され、親ビュー（例: `ContentView`）の `@State` と双方向に同期します。Pickerで値を変更すると親の値も即座に更新され、親側の状態に応じて表示/非表示などの振る舞いを制御できます。
- `@Binding` を使うことで、`TimeSelectionView` は状態管理を持たず、親に状態を委ねたシンプルな再利用コンポーネントになります。

### 3. UIの作成

var body: some View {}内に追加

```swift
HStack(spacing: 0) {
    TimePicker(title: "時間", range: 0...23, selection: $hours)
        .frame(maxWidth: .infinity)
    TimePicker(title: "分", range: 0...59, selection: $minutes)
        .frame(maxWidth: .infinity)
    TimePicker(title: "秒", range: 0...59, selection: $seconds)
        .frame(maxWidth: .infinity)
}
```

- `HStack(spacing: 0)` によって3つの `TimePicker` を横に並べています。
- 各 `TimePicker` に `.frame(maxWidth: .infinity)` を指定することで、Picker同士の隙間をなくして画面を均等に3分割したレイアウトになります。
- `selection: $hours` のように `$` を付けて渡すことで、`TimePicker` の `@Binding` と紐づき、ユーザー操作が親側の状態に反映されます。

## コード全体

<img src="/images/timer/t32.png" alt="Xcode の設定画面" class="mobile-screenshot" />

```swift title="TimeSelectionView.swift"
import SwiftUI

struct TimeSelectionView: View {
    @Binding var hours: Int
    @Binding var minutes: Int
    @Binding var seconds: Int

    var body: some View {
        HStack(spacing: 0) {
            TimePicker(title: "時間", range: 0...23, selection: $hours)
                .frame(maxWidth: .infinity)
            TimePicker(title: "分", range: 0...59, selection: $minutes)
                .frame(maxWidth: .infinity)
            
            TimePicker(title: "秒", range: 0...59, selection: $seconds)
                .frame(maxWidth: .infinity)
        }
    }
}

// 必要に応じてプレビューコードを追加
#Preview {
    @Previewable @State var hours = 0
    @Previewable @State var minutes = 0
    @Previewable @State var seconds = 0

    TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
}

```

---

## 3. コンポーネントの組み合わせ(ContentView.swift)

### 1. 状態に応じた計算プロパティ

`struct ContentView: View {}` 内に追加

`timerState` や現在の設定時間に応じて、ボタンのラベルや有効/無効の状態を自動で計算するプロパティを定義します。

```swift title="ContentView.swift"
private var isTimerUnset: Bool {
    timerState == .idle && hours == 0 && minutes == 0 && seconds == 0
}

private var primaryButtonLabel: String {
    switch timerState {
    case .running: "一時停止"
    case .paused:  "再開"
    case .idle:    "開始"
    }
}
```

- `isTimerUnset` は、タイマーが未設定（待機中でかつ時間がすべて0）かどうかを判定します。
- `primaryButtonLabel` は、現在の状態に応じてボタンのテキストを返します。これにより、ひとつの `Button` で複数の役割を担うことができます。

### 2. 時間選択画面

Text("タイマーアプリ")  
 .font(.largeTitle)  
 .padding()  
の1行下に追加

```swift
if timerState == .idle {
    TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
} else {
    Text(timerState == .running ? "タイマーが実行中です" : "一時停止中")
        .font(.title)
}
```

- `timerState` が `.idle`（待機中）かどうかで表示を切り替えています。
- 待機中であれば `TimeSelectionView` を表示し、ユーザーが時間を設定できるようにします。
- それ以外（実行中・一時停止中）の場合は、`Text` で現在の状況を表示します。

### 3. 開始・一時停止ボタン

```swift
Button(primaryButtonLabel) {
    withAnimation {
        timerState = timerState == .running ? .paused : .running
    }
}
.tint(timerState == .running ? .yellow : .green)
.disabled(isTimerUnset)
```

- `primaryButtonLabel` (計算プロパティ) を使って、ボタンのテキストを「開始」「一時停止」「再開」と切り替えています。
- `withAnimation {}` で囲むことで、状態が切り替わる際の見え方をスムーズにしています。
- `.tint` で、実行中は黄色、それ以外は緑色にボタンの色を変更します。
- `.disabled(isTimerUnset)` を指定することで、時間が `0` のときはボタンを押せないように制御（バリデーション）しています。

### 4. キャンセルボタン

```swift
Button("キャンセル") {
    withAnimation {
        timerState = .idle
        (hours, minutes, seconds) = (0, 0, 0)
    }
}
.tint(.gray)
.disabled(isTimerUnset)
```

- キャンセルしたときも `withAnimation` でスムーズに待機画面に戻します。
- `(hours, minutes, seconds) = (0, 0, 0)` という書き方（タプル代入）で、複数の変数を一括で `0` にリセットしています。
- 開始ボタンと同様に、タイマーが未設定の状態では無効化されます。

---

## コード全体

<img src="/images/timer/t31.png" alt="Xcode の設定画面" class="mobile-screenshot" />

```swift title="ContentView.swift"
import SwiftUI

enum TimerState {
    case idle
    case running
    case paused
}
struct ContentView: View {
    @State private var timerState: TimerState = .idle
    @State private var hours = 0
    @State private var minutes = 0
    @State private var seconds = 0

    private var isTimerUnset: Bool {
        timerState == .idle && hours == 0 && minutes == 0 && seconds == 0
    }

    private var primaryButtonLabel: String {
        switch timerState {
        case .running: "一時停止"
        case .paused:  "再開"
        case .idle:    "開始"
        }
    }

    var body: some View {
        VStack(spacing: 24) {
            Text("タイマーアプリ")
                .font(.largeTitle)
                .padding()

            if timerState == .idle {
                TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
            } else {
                Text(timerState == .running ? "タイマーが実行中です" : "一時停止中")
                    .font(.title)
            }

            HStack(spacing: 16) {
                Button(primaryButtonLabel) {
                    withAnimation {
                        timerState = timerState == .running ? .paused : .running
                    }
                }
                .tint(timerState == .running ? .yellow : .green)
                .disabled(isTimerUnset)

                Button("キャンセル") {
                    withAnimation {
                        timerState = .idle
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
    }
}

#Preview {
    ContentView()
}
```

## 練習問題

![完成イメージ](/images/timer/p3.png)

### 年を選択できるUIを作成しよう

このステップで学んだ「Picker」を活用して、西暦（年）をドラムロールで選べるUIを作成してみましょう。

#### 1. ContentView での状態定義

- 現在の年（`selectedYear`）を保持するための `@State` 変数を定義します。
- 初期値は 2000 などにしておきましょう。

#### 2. レイアウトの構築

- `VStack` の中に、`Picker` を配置します。
- 範囲は 1980年〜2030年 とし、`.pickerStyle(.wheel)` を指定してください。
- ドラムロールの高さが見やすくなるよう、`.frame(height: 200)` で調整しましょう。

#### 3. 選択結果の表示

- 画面の下部に、現在選択されている値を表示するテキストを配置します。
- 「選択中: 2024年」のように、変数の値を反映させて表示してください。

### ヒント

```swift title="ContentView.swift"
import SwiftUI

struct ContentView: View {
    @State private var selectedYear = 2000

    var body: some View {
        VStack(spacing: 40) {

            Text("選択中: \(selectedYear)年")
        }
        .padding()
    }
}

#Preview {
    ContentView()
}

```

### 解答例

```swift title="ContentView.swift"
import SwiftUI

struct ContentView: View {
    @State private var selectedYear = 2000

    var body: some View {
        VStack(spacing: 40) {
            Picker("年", selection: $selectedYear) {
                ForEach(1980...2030, id: \.self) { Text("\($0)年") }
            }
            .pickerStyle(.wheel)
            .frame(height: 200)

            Text("選択中: \(selectedYear)年")
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
```
