# ステップ19: List コンポーネントの実装

<script>
    import {base} from '$app/paths';
</script>

## List.swift の作成

```swift
import SwiftUI

/// どんなデータ(T)でも一覧表示できる再利用可能なリスト
struct List<T: Identifiable, Content: View>: View {
    let items: [T]                 // 表示するデータの配列
    let onDelete: (T) -> Void      // 削除操作が行われた時の処理
    @ViewBuilder let rowContent: (T) -> Content // 各行の見た目（ここを作るのは親の責任）

    var body: some View {
        List {
            ForEach(items) { item in
                rowContent(item) // 親から渡された「見た目」を表示する
                    .listRowInsets(EdgeInsets()) // デフォルトの余白を削除して端まで広げる
                    .listRowSeparator(.hidden)   // デフォルトの区切り線を消す
            }
            .onDelete(perform: delete) // スワイプ削除機能
        }
        .listStyle(.plain) // シンプルなスタイル
        .scrollContentBackground(.hidden) // 背景を透明にする
        .background(Color(.systemGray6))  // 背景色（薄いグレー）
    }

    /// IndexSet（何番目）からデータ（T）を特定して削除処理を呼ぶ
    private func delete(indexSet: IndexSet) {
        for index in indexSet {
            let item = items[index]
            onDelete(item)
        }
    }
}

// プレビュー：さっき作った ToDoListItem を入れて表示してみる
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
