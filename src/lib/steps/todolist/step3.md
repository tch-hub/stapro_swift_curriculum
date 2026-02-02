# ステップ3: どのリストにも使えるCustomList(CustomList.swift)

## 1. 基本構造の作成

`Components/CustomList.swift` を以下のように書き換えて、汎用的に使える構造体（ジェネリクス）の土台を作ります。

```swift
import SwiftUI

struct CustomList<T: Identifiable, RowContent: View>: View {
    // データを保持する配列
    let items: [T]
    // スワイプ削除時のアクション（必要な場合のみ）
    let onDelete: ((IndexSet) -> Void)?
    // 各行の見た目を作るためのクロージャ
    @ViewBuilder let rowContent: (T) -> RowContent

    var body: some View {
        List {
            // ここにリストの中身を実装します
        }
        .listStyle(.plain)
    }
}
```

- `<T: Identifiable, RowContent: View>`: `T` は表示するデータ（IDを持っている必要がある）、`RowContent` は行の見た目（View）を表すジェネリクスです。これにより、どんなデータ型でもリスト表示できるようになります。
- `@ViewBuilder`: クロージャ内で複数のViewを返せるようにするための属性です。

## 2. リストの中身を実装

`List` の中身を実装します。削除機能が有効な場合とそうでない場合で処理を分けます。

```swift
List {
    // 削除機能が有効（onDelete が存在する）かどうかで分岐
    if let onDelete = onDelete {
        ForEach(items) { item in
            rowContent(item)
        }
        .onDelete(perform: onDelete)
    } else {
        // 削除機能がない場合
        ForEach(items) { item in
            rowContent(item)
        }
    }
}
.listStyle(.plain)
```

## 3. リストの区切り線を調整

デフォルトの区切り線を消して、スッキリした見た目にします。`rowContent(item)` の直後に以下のモディファイアを追加してください（`if` 側と `else` 側の両方の `rowContent(item)` に適用します）。

```swift
rowContent(item)
    .listRowSeparator(.hidden)
    .listRowInsets(EdgeInsets()) // 余白をリセット
```

## 4. プレビューの作成

汎用リストが正しく動作するか確認するためのプレビューを作成します。ファイルの末尾に追加してください。

```swift
#Preview {
    struct PreviewWrapper: View {
        // テスト用のデータ型
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
                // ステップ2で作ったコンポーネントを使用
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

---

## コード全体

<img src="/images/todolist/CustomList.png" alt="CustomListの完成イメージ" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

### Components/CustomList.swift

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
                        .listRowSeparator(.hidden)
                        .listRowInsets(EdgeInsets())
                }
                .onDelete(perform: onDelete)
            } else {
                ForEach(items) { item in
                    rowContent(item)
                        .listRowSeparator(.hidden)
                        .listRowInsets(EdgeInsets())
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
