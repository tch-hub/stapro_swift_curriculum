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
// 表示するデータの一覧
let items: [T]
// スワイプ削除時の処理（削除機能が不要な場合は nil）
let onDelete: ((IndexSet) -> Void)?
// 各行の表示内容を作るためのクロージャ（ViewBuilder属性付き）
@ViewBuilder let rowContent: (T) -> RowContent
```

`items` はジェネリクス `T` 型の配列で、リストに表示するデータを保持します。  
`onDelete` はオプション型で定義されており、削除機能が必要な場合のみ関数を渡せるようにしています。  
`rowContent` は各行のビューを生成するためのクロージャで、`@ViewBuilder` をつけることで SwiftUI の View を柔軟に記述できるようにしています。

### 3. UIの作成

var body: some View {} 内に追加

```swift
// 標準的なリスト表示を作成
List {
    // 削除機能が有効（onDelete が存在する）かどうかで分岐
    if let onDelete = onDelete {
        // データごとの行を作成
        ForEach(items.indices, id: \.self) { index in
            // 行の中身を表示
            let item = items[index]
            rowContent(item)
                // 先頭の上線は表示しない
                .listRowSeparator(.hidden, edges: .top)
                // 最後の下線は表示しない（境目だけ表示）
                .listRowSeparator(index == items.count - 1 ? .hidden : .visible, edges: .bottom)
        }
        // スワイプ削除アクションを設定
        .onDelete(perform: onDelete)
    } else {
        // 削除機能がない場合
        ForEach(items.indices, id: \.self) { index in
            let item = items[index]
            rowContent(item)
                .listRowSeparator(.hidden, edges: .top)
                .listRowSeparator(index == items.count - 1 ? .hidden : .visible, edges: .bottom)
        }
    }
}
// リストの見た目をプレーンなスタイルに設定
.listStyle(.plain)
```

`onDelete` が渡されている場合は `.onDelete(perform: onDelete)` を適用してスワイプ削除を有効にし、渡されていない場合は単にリスト表示のみを行います。

`List` コンポーネントを使用してデータを一覧表示します。`onDelete` が渡されている場合は `.onDelete(perform: onDelete)` を適用してスワイプ削除を有効にし、渡されていない場合は単にリスト表示のみを行います。各行の表示内容は `rowContent(item)` を呼び出すことで生成し、先頭の上線と最後の下線は隠して、行と行の境目だけに線が表示されるようにしています。

---

## コード全体

<img src="/images/todolist/CustomList.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
import SwiftUI

struct CustomList<T: Identifiable, RowContent: View>: View {
    let items: [T]
    let onDelete: ((IndexSet) -> Void)?
    @ViewBuilder let rowContent: (T) -> RowContent

    var body: some View {
        List {
            if let onDelete = onDelete {
                ForEach(items.indices, id: \.self) { index in
                    let item = items[index]
                    rowContent(item)
                        .listRowSeparator(.hidden, edges: .top)
                        .listRowSeparator(index == items.count - 1 ? .hidden : .visible, edges: .bottom)
                }
                .onDelete(perform: onDelete)
            } else {
                ForEach(items.indices, id: \.self) { index in
                    let item = items[index]
                    rowContent(item)
                        .listRowSeparator(.hidden, edges: .top)
                        .listRowSeparator(index == items.count - 1 ? .hidden : .visible, edges: .bottom)
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
