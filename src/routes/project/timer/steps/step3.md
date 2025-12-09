# ステップ3: 時間選択ビューの実装

## 1. TimePickerコンポーネント

時間を選ぶための再利用可能なPicker(`TimePicker.swift`)をつくります。

### 1. 変数の定義

```
var title: String
var range: ClosedRange<Int>
@Binding var selection: Int
```

- `title` でタイマーの時間の単位を設定できるようにします。
- `range` でタイマーの分や秒などの数字の選択範囲を設定できるようにします。
- `selection` は`@Binding`を使って同期できるようにします。

### 2. UIの作成

```
var body: some View {
    Picker(selection: $selection, label: Text(title)) {
    }
    .pickerStyle(.wheel) //pickerSのスタイルをwheelにする
}
```

- `selection` には `@Binding` の `$selection` を渡しており、Pickerで選択した値が親ビューへ即時に伝わります。これにより `ContentView` 側の `@State` 変数が更新され、選択された時間が同期されます。
- `label: Text(title)` によって Picker のラベルに `title`（例えば「時間」「分」「秒」）を表示でき、同じ `TimePicker` コンポーネントを異なる単位で再利用できます。

```
ForEach(Array(range), id: \.self) { value in
}
```
- `ForEach(Array(range), id: \.self)` は `range` で指定された値の一覧を行として生成します。`range` を変えるだけで選択肢の範囲を簡単に変更できます。
```
Text("\(value) \(title)").tag(value)
```
- `Text("\(value) \(title)")` で表示テキストを構成し、`.tag(value)` によってその行が選択されたときに `selection` に対応する値が設定されます。


---

## 2. TimeSelectionView

`TimePicker`を使って時間選択画面(`TimeSelectionView.swift`)を作ります。

### 1. 変数の定義

```swift
@Binding var hours: Int
@Binding var minutes: Int
@Binding var seconds: Int
```

- `hours`, `minutes`, `seconds` はそれぞれ `@Binding` として定義され、親ビュー（例: `ContentView`）の `@State` と双方向に同期します。Pickerで値を変更すると親の値も即座に更新され、親側の状態に応じて表示/非表示などの振る舞いを制御できます。
- `@Binding` を使うことで、`TimeSelectionView` は状態管理を持たず、親に状態を委ねたシンプルな再利用コンポーネントになります。

### 2. UIの作成

```swift
var body: some View {
    HStack {
        TimePicker(title: "時間", range: 0...23, selection: $hours)
        TimePicker(title: "分", range: 0...59, selection: $minutes)
        TimePicker(title: "秒", range: 0...59, selection: $seconds)
    }
}
```

- `HStack` によって3つの `TimePicker` を横に並べています。各Pickerにはそれぞれ適切な `range` と `selection` の `@Binding` を渡し、選択値が親ビューへ即時に反映されるようにしています。
- `selection: $hours` のように `$` を付けて渡すことで、`TimePicker` の `@Binding` と紐づき、ユーザー操作が同じメモリ上の状態に反映されます。

---

## コード全体

```swift
// TimePicker.swift
import SwiftUI

struct TimePicker: View {
    var title: String
    var range: ClosedRange<Int>
    @Binding var selection: Int

    var body: some View {
        Picker(selection: $selection, label: Text(title)) {
            ForEach(Array(range), id: \.self) { value in
                Text("\(value) \(title)").tag(value)
            }
        }
        .pickerStyle(.wheel)
    }
}
```

```swift
// TimeSelectionView.swift
import SwiftUI

struct TimeSelectionView: View {
    @Binding var hours: Int
    @Binding var minutes: Int
    @Binding var seconds: Int

    var body: some View {
        HStack {
            TimePicker(title: "時間", range: 0...23, selection: $hours)
            TimePicker(title: "分", range: 0...59, selection: $minutes)
            TimePicker(title: "秒", range: 0...59, selection: $seconds)
        }
    }
}
```

```swift
// ContentView.swift
import SwiftUI

struct ContentView: View {
    @State var timerState: TimerState = .idle
    @State var hours = 0
    @State var minutes = 0
    @State var seconds = 0

    var body: some View {
        VStack(spacing: 24) {
            Text("タイマーアプリ")
                .font(.largeTitle)
                .padding()

            // 時間選択は待機時のみ表示
            if timerState == .idle {
                TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
            } else {
                Text("タイマーが実行中です")
                    .font(.title)
            }

            HStack(spacing: 16) {
                Button("開始") {
                    // ここでは簡単に状態を切り替え
                    timerState = .running
                }
                .padding()
                .background(Color.green)
                .foregroundColor(.white)
                .cornerRadius(10)

                Button("キャンセル") {
                    timerState = .idle
                    hours = 0; minutes = 0; seconds = 0
                }
                .padding()
                .background(Color.gray)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
```
