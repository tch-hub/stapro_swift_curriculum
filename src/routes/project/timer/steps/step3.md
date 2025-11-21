# ステップ3: 時間選択ビューの実装


### 1. TimePickerコンポーネントを作る

時間を選ぶための再利用可能なPickerを`TimePicker.swift`に定義する。

```swift
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

- `title` でラベル表示、`range` で選択肢の範囲を定義。
- `@Binding` を使って親ビューの `@State` と値を同期させる。
- `pickerStyle(.wheel)` で iOS 標準のホイール表示に。

### 2. Pickerの使い方

- `selection` にバインディングを渡し、値の変化を受け取る。
- `ForEach(Array(range), id: \.self)` で範囲内の値を繰り返す。
- `Text("\(value) \(title)")` で各行の表示を作る。

```swift
Picker(selection: $selection, label: Text(title)) {
    ForEach(Array(range), id: \.self) { value in
        Text("\(value) \(title)").tag(value)
    }
}
.pickerStyle(.wheel)
```

### 3. TimeSelectionViewの作成

3つの `TimePicker` を横並びにしたカスタムビュー。`TimeSelectionView.swift` に記述。

```swift
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

- `HStack` で `TimePicker` を横並び。
- 親ビュー側(`ContentView`)で `@State var hours = 0` などを定義し、`$hours` のようにバインディングを渡す。

### 4. ContentViewの更新例

```swift
if timerState == .idle {
    TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
} else {
    Text("タイマーが実行中です")
        .font(.largeTitle)
}
```

- `timerState` に応じて `TimeSelectionView` を表示するか、別のビューを表示するかを切り替える。
- `@State` で保持した時間を `TimeSelectionView` へ渡し、Pickerの値を更新する。
