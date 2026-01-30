# ステップ3: どのリストにも使える CustomList

タスクやタブなど、いろいろなデータを表示できる汎用リストを作ります。

### 1. swiftUIの基本構造

```swift
import SwiftUI

struct CustomList<T: Identifiable, RowContent: View>: View {
    var body: some View {
    }
}
```

### 2. 変数の定義

struct CustomList: View {} 内に追加

```swift
let items: [T]
let onDelete: ((IndexSet) -> Void)?
@ViewBuilder let rowContent: (T) -> RowContent
```

- `items` は表示する配列です。
- `onDelete` がある時はスワイプ削除を有効にします。
- `rowContent` で各行の見た目を外から渡します。

### 3. UIの作成

var body: some View {} 内に追加

```swift
List {
    if let onDelete = onDelete {
        ForEach(items) { item in
            rowContent(item)
                .listRowSeparator(.visible)
        }
        .onDelete(perform: onDelete)
    } else {
        ForEach(items) { item in
            rowContent(item)
                .listRowSeparator(.visible)
        }
    }
}
.listStyle(.plain)
```

- `List` で標準のリスト表示を作ります。
- `onDelete` がある場合だけスワイプ削除を追加します。
- どの行も `rowContent(item)` で描画します。

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
import SwiftUI

struct CustomList<T: Identifiable, RowContent: View>: View {
    let items: [T]
    let onDelete: ((IndexSet) -> Void)?
    @ViewBuilder let rowContent: (T) -> RowContent

    var body: some View {
        List {
            if let onDelete = onDelete {
                ForEach(items) { item in
                    rowContent(item)
                        .listRowSeparator(.visible)
                }
                .onDelete(perform: onDelete)
            } else {
                ForEach(items) { item in
                    rowContent(item)
                        .listRowSeparator(.visible)
                }
            }
        }
        .listStyle(.plain)
    }
}


#Preview {
    struct PreviewWrapper: View {
        struct MockItem: Identifiable {
            let id = UUID()
            var title: String
            var isCompleted: Bool
        }

        @State private var items: [MockItem] = [
            .init(title: "タップで完了", isCompleted: false),
            .init(title: "スワイプで削除", isCompleted: true)
        ]

        var body: some View {
            CustomList(items: items, onDelete: { indexSet in
                items.remove(atOffsets: indexSet)
            }) { item in
                ToDoListItem(
                    title: item.title,
                    isCompleted: item.isCompleted
                ) {
                    if let index = items.firstIndex(where: { $0.id == item.id }) {
                        items[index].isCompleted.toggle()
                    }
                }
            }
        }
    }

    return PreviewWrapper()
}
```
