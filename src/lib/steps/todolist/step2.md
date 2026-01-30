# ステップ2: タスク行コンポーネントを作る

ここでは、1つのタスク行を表示するための `ToDoListItem` を作成します。
タップで完了/未完了を切り替えられるようにします。

### 1. swiftUIの基本構造

```swift
import SwiftUI

struct ToDoListItem: View {
    var body: some View {
    }
}
```

### 2. 変数の定義

struct ToDoListItem: View {} 内に追加

```swift
let title: String
let isCompleted: Bool
let onToggle: () -> Void
```

- `title` はタスク名です。
- `isCompleted` は完了状態を表します。
- `onToggle` はタップ時に呼び出す処理です。

### 3. UIの作成

var body: some View {} 内に追加

```swift
Button(action: onToggle) {
    HStack(spacing: 12) {
        Image(systemName: isCompleted
              ? "checkmark.circle.fill"
              : "circle")
            .foregroundColor(isCompleted ? .gray : .accentColor)

        Text(title)
            .strikethrough(isCompleted)
            .foregroundColor(isCompleted ? .gray : .primary)

        Spacer()
    }
    .padding(.vertical, 8)
}
.buttonStyle(.plain)
```

- `Button` でタップ可能にします。
- `Image(systemName: ...)` で完了アイコンを切り替えます。
- `strikethrough` で完了時に打ち消し線を表示します。
- `Spacer()` で右側に余白を作ります。

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
import SwiftUI

struct ToDoListItem: View {
    let title: String
    let isCompleted: Bool
    let onToggle: () -> Void

    var body: some View {
        Button(action: onToggle) {
            HStack(spacing: 12) {
                Image(systemName: isCompleted
                      ? "checkmark.circle.fill"
                      : "circle")
                    .foregroundColor(isCompleted ? .gray : .accentColor)

                Text(title)
                    .strikethrough(isCompleted)
                    .foregroundColor(isCompleted ? .gray : .primary)

                Spacer()
            }
            .padding(.vertical, 8)
        }
        .buttonStyle(.plain)
    }
}


#Preview {
    struct PreviewWrapper: View {
        @State private var completed = false

        var body: some View {
            List {
                ToDoListItem(
                    title: "タップで状態切り替え",
                    isCompleted: completed
                ) {
                    completed.toggle()
                }
            }
            .listStyle(.plain)
        }
    }

    return PreviewWrapper()
}
```
