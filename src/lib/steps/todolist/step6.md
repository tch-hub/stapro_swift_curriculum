# ステップ6: ToDoTabServiceの実装

<script>
    import {base} from '$app/paths';
</script>

## ToDoTabService.swift の作成

`Services/`フォルダに`ToDoTabService.swift`を作成し、以下のコードを記述します：

```swift
import Foundation
import SwiftData

class ToDoTabService {
    @MainActor
    static func addTab(_ tab: ToDoTab, to modelContext: ModelContext) {
        modelContext.insert(tab)
        try? modelContext.save()
    }

    @MainActor
    static func updateTab(_ tab: ToDoTab, modelContext: ModelContext) {
        try? modelContext.save()
    }

    @MainActor
    static func deleteTab(_ tab: ToDoTab, from modelContext: ModelContext) {
        // タブに属するタスクをすべて削除
        ToDoTaskService.deleteAllTasks(for: tab.id, from: modelContext)
        // タブを削除
        modelContext.delete(tab)
        try? modelContext.save()
    }

    @MainActor
    static func getAllTabs(from modelContext: ModelContext) -> [ToDoTab] {
        let descriptor = FetchDescriptor<ToDoTab>()
        return (try? modelContext.fetch(descriptor)) ?? []
    }
}
```

## 各メソッドの説明

| メソッド     | 説明                                     |
| ------------ | ---------------------------------------- |
| `addTab`     | 新しいタブを追加します                   |
| `updateTab`  | タブを更新します                         |
| `deleteTab`  | タブを削除します（関連するタスクも削除） |
| `getAllTabs` | すべてのタブを取得します                 |

## deleteTab の重要な処理

タブを削除する際には、そのタブに属するすべてのタスクも削除する必要があります。そのため、`ToDoTaskService.deleteAllTasks`を呼び出して、関連するタスクも削除しています。

## 次のステップへ

次は、ビュー（画面）の基本構造を作成します。ナビゲーションと初期画面を実装します。
