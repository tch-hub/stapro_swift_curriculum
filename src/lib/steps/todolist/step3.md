# ステップ3: リストコンポーネントを作る(CustomList.swift)

### ステップ3終了時の完成イメージ

<img src="/images/todolist/CustomList.png" alt="CustomListの完成イメージ" class="mobile-screenshot-top" />

## 1. 土台の作成

まず、`Components/CustomList.swift` の中身を以下のように書き換えて土台を作ります。

```swift
import SwiftUI

struct CustomList<T: Identifiable, RowContent: View>: View {
    let items: [T]
    // リストのアイテムを保持する配列
    let onDelete: ((IndexSet) -> Void)?
    // リストのアイテムを削除するときの処理(step20で使います)
    @ViewBuilder let rowContent: (T) -> RowContent
    // リストのアイテムを表示するための関数

    var body: some View {
        List {
            // ここにリストの中身を実装します
        }
        .listStyle(.plain)
    }
}
```

- `<T: Identifiable, RowContent: View>`: `T` はリストで表示するアイテム、`RowContent` は各行の見た目の型を指定します。どんなデータでも同じ書き方で表示できるようにするための仕組みです。
- `@ViewBuilder`: 複数のリストのアイテムをまとめて書けるようにするための指定の方法です。

## 2. リストの中身を実装

`List` の中身を実装します。

> このコードはSwift コンパイラや Xcode のプレビュータブがエラーにならないようにするためだけに用意しています。

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

- この `if let onDelete = onDelete` の分岐は、削除の処理が渡されている場合だけ `onDelete` を呼び出せるようにするためです。`onDelete` が nil のままでも `List` と `ForEach` は表示されるので、タップだけで使う場合や次のステップまで削除機能を後回しにするケースでもエラーになりません。
- `ForEach(items)` の中では `rowContent(item)` で任意の行を描画し、削除に対応できる場合は `.onDelete(perform: onDelete)` を追加してスワイプで削除できるようにしています。

## 3. リストの区切り線を調整

デフォルトの区切り線を消して、スッキリした見た目にします。`rowContent(item)` の直後に以下のモディファイアを追加してください（`if` 側と `else` 側の両方の `rowContent(item)` に適用します）。

<img src="/images/todolist/3-3.png" alt="ToDoListItemの完成イメージ" class="mobile-screenshot" />

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
- `#Preview`: このブロック内に書いたコードがXcodeのプレビュー画面に表示されます。

  ※ このコードは、実際のアプリ本体には必須ではありませんが、プレビュー上で動作や状態変化を確認するためのテスト用ラッパーとして書かれています。  
  ※ サンプルのタスクデータを用意し、リスト表示が正しく動くかを、実行せずに確認できるようにしています。


---

## コード全体

```swift title="Components/CustomList.swift"
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
