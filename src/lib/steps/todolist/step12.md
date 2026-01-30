# ステップ12: タブ操作のサービスを作る

タブの追加・更新・削除をまとめた `ToDoTabService` を作ります。

### 1. 追加

```swift
@MainActor
static func addTab(_ tab: ToDoTab, to modelContext: ModelContext) {
    modelContext.insert(tab)
    try? modelContext.save()
}
```

### 2. 更新

```swift
@MainActor
static func updateTab(_ tab: ToDoTab, modelContext: ModelContext) {
    try? modelContext.save()
}
```

### 3. 削除（関連タスクも削除）

```swift
@MainActor
static func deleteTab(_ tab: ToDoTab, from modelContext: ModelContext) {
    ToDoTaskService.deleteAllTasks(for: tab.id, from: modelContext)
    modelContext.delete(tab)
    try? modelContext.save()
}
```

### 4. 取得

```swift
@MainActor
static func getAllTabs(from modelContext: ModelContext) -> [ToDoTab] {
    let descriptor = FetchDescriptor<ToDoTab>()
    return (try? modelContext.fetch(descriptor)) ?? []
}
```

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
