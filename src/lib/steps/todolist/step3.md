# ステップ19: List コンポーネントの実装

<script>
    import {base} from '$app/paths';
</script>

## List.swift の作成

```swift
import SwiftUI

struct CustomList<T: Identifiable, Content: View>: View {
    let items: [T]
    let onDelete: (T) -> Void
    @ViewBuilder let rowContent: (T) -> Content

    var body: some View {
        List {
            ForEach(items) { item in
                rowContent(item)
                    // .listRowInsets(EdgeInsets())  <-- 【削除】これを消します
                    .listRowSeparator(.hidden)    // 区切り線を消す設定は残してOK
            }
            .onDelete(perform: delete)
        }
        .listStyle(.plain)
        .scrollContentBackground(.hidden)
        .background(Color(.systemGray6))
    }

    private func delete(indexSet: IndexSet) {
        for index in indexSet {
            let item = items[index]
            onDelete(item)
        }
    }
}
#Preview {
    // プレビュー内でデータを管理するためのラッパーView
    struct PreviewWrapper: View {
        // ダミーデータの定義
        struct MockData: Identifiable {
            let id = UUID()
            var name: String
            var isCompleted: Bool
        }
        
        // 配列を @State で管理する（これで画面が更新されるようになる）
        @State private var items = [
            MockData(name: "スワイプで", isCompleted: false),
            MockData(name: "アイテムを削除", isCompleted: true),
            MockData(name: "タップで状態切り替え", isCompleted: false)
        ]
        
        var body: some View {
            CustomList(items: items, onDelete: { item in
                // 削除処理：IDが一致するものを探して削除
                if let index = items.firstIndex(where: { $0.id == item.id }) {
                    items.remove(at: index)
                    print("\(item.name) を削除しました")
                }
            }) { item in
                ToDoListItem(
                    title: item.name,
                    isCompleted: item.isCompleted,
                    onToggle: {
                        // トグル処理：IDが一致するものを探して反転させる
                        if let index = items.firstIndex(where: { $0.id == item.id }) {
                            items[index].isCompleted.toggle()
                            print("チェック変更: \(item.name) -> \(items[index].isCompleted)")
                        }
                    }
                )
            }
        }
    }
    
    return PreviewWrapper()
}
```
