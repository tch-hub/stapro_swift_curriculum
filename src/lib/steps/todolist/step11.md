# ステップ11: タブ操作のサービスを作る(ToDoTabService.swift)

タブの追加・更新・削除をまとめた `ToDoTabService` を作ります。
ステップ1で作成した `Services/ToDoTabService.swift` を編集します。

### 1. 追加

```swift
// メインスレッドで実行することを保証
@MainActor
static func addTab(_ tab: ToDoTab, to modelContext: ModelContext) {
    // データベースに追加
    modelContext.insert(tab)
    // 変更を保存
    try? modelContext.save()
}
```

`modelContext.insert` を使って新しいタブをデータベースの管理下に置き、`save()` で保存します。

### 2. 更新

```swift
@MainActor
static func updateTab(_ tab: ToDoTab, modelContext: ModelContext) {
    // データの内容は変更済みなので、保存処理だけを行う
    try? modelContext.save()
}
```

タスクの更新と同様、オブジェクトのプロパティを変更した後に `save()` を呼び出して変更を確定させます。

### 3. 削除（関連タスクも削除）

```swift
@MainActor
static func deleteTab(_ tab: ToDoTab, from modelContext: ModelContext) {
    // まず、そのタブに含まれる全てのタスクを削除
    ToDoTaskService.deleteAllTasks(for: tab.id, from: modelContext)
    // その後でタブ自体を削除
    modelContext.delete(tab)
    // 変更を保存
    try? modelContext.save()
}
```

タブを削除する際、その中にあるタスクが残ってしまう（ゴミデータになる）のを防ぐため、先に `ToDoTaskService.deleteAllTasks` を呼び出して関連するタスクを全て削除してから、タブ本体を削除します。

### 4. 取得

```swift
@MainActor
static func getAllTabs(from modelContext: ModelContext) -> [ToDoTab] {
    // 全てのタブを取得するための検索条件（条件なし＝全件）
    let descriptor = FetchDescriptor<ToDoTab>()
    // 検索を実行し、失敗した場合は空の配列を返す
    return (try? modelContext.fetch(descriptor)) ?? []
}
```

データベースに保存されている全てのタブを取得します。  
`FetchDescriptor` に条件（predicate）を指定していないため、登録されている全データが取得されます。

---

## コード全体

```swift
// ToDoTabService.swift
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
