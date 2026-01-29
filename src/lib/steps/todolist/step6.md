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
    // プレビュー用のダミーデータ型（まだデータベースは使いません）
    struct MockData: Identifiable {
        let id = UUID()
        let name: String
        let isCompleted: Bool
    }
    
    // ダミーデータ
    let mockItems = [
        MockData(name: "牛乳を買う", isCompleted: false),
        MockData(name: "部屋の掃除", isCompleted: true),
        MockData(name: "Swiftの勉強", isCompleted: false)
    ]
    
    return List(items: mockItems, onDelete: { item in
        print("\(item.name) を削除しました")
    }) { item in
        // ここで Step 2 で作った部品を使う！
        ToDoListItem(
            title: item.name,
            isCompleted: item.isCompleted,
            onToggle: { print("チェック: \(item.name)") }
        )
    }
}
```
