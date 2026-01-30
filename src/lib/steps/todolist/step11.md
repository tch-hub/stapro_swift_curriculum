# ステップ11: タスク操作のサービスを作る

タスクの追加・更新・削除をまとめた `ToDoTaskService` を作ります。

### 1. 追加

```swift
@MainActor
static func addTask(_ task: ToDoTask, to modelContext: ModelContext) {
    modelContext.insert(task)
    try? modelContext.save()
}
```

### 2. 更新

```swift
@MainActor
static func updateTask(_ task: ToDoTask, modelContext: ModelContext) {
    try? modelContext.save()
}
```

### 3. 削除

```swift
@MainActor
static func deleteTask(_ task: ToDoTask, from modelContext: ModelContext) {
    modelContext.delete(task)
    try? modelContext.save()
}
```

### 4. 完了切り替え

```swift
@MainActor
static func toggleTaskCompletion(_ task: ToDoTask, modelContext: ModelContext) {
    task.isCompleted.toggle()
    try? modelContext.save()
}
```

### 5. タブごとの全削除

```swift
@MainActor
static func deleteAllTasks(for tabId: UUID, from modelContext: ModelContext) {
    let descriptor = FetchDescriptor<ToDoTask>(predicate: #Predicate { $0.tabId == tabId })
    if let tasks = try? modelContext.fetch(descriptor) {
        tasks.forEach { modelContext.delete($0) }
        try? modelContext.save()
    }
}
```

---

## コード全体

```swift
// ToDoTaskService.swift
import Foundation
import SwiftData

class ToDoTaskService {
    @MainActor
    static func addTask(_ task: ToDoTask, to modelContext: ModelContext) {
        modelContext.insert(task)
        try? modelContext.save()
    }

    @MainActor
    static func updateTask(_ task: ToDoTask, modelContext: ModelContext) {
        try? modelContext.save()
    }

    @MainActor
    static func deleteTask(_ task: ToDoTask, from modelContext: ModelContext) {
        modelContext.delete(task)
        try? modelContext.save()
    }

    @MainActor
    static func toggleTaskCompletion(_ task: ToDoTask, modelContext: ModelContext) {
        task.isCompleted.toggle()
        try? modelContext.save()
    }

    @MainActor
    static func deleteAllTasks(for tabId: UUID, from modelContext: ModelContext) {
        let descriptor = FetchDescriptor<ToDoTask>(predicate: #Predicate { $0.tabId == tabId })
        if let tasks = try? modelContext.fetch(descriptor) {
            tasks.forEach { modelContext.delete($0) }
            try? modelContext.save()
        }
    }
}
```
