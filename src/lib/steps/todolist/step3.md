# ステップ19: List コンポーネントの実装

<script>
    import {base} from '$app/paths';
</script>

## List.swift の作成

```swift
import SwiftUI

struct CustomList<T: Identifiable, RowContent: View>: View {
    let items: [T]
    let onDelete: (IndexSet) -> Void
    @ViewBuilder let rowContent: (T) -> RowContent

    var body: some View {
        List {
            ForEach(items) { item in
                rowContent(item)
            }
            .onDelete(perform: onDelete)
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
