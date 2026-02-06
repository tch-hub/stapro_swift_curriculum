# ステップ10: タスク操作のサービスを作る(ToDoTaskService.swift)

## 1. クラスの基本構造

`Services/ToDoTaskService.swift` を開き、タスクの追加・更新・削除などのロジックをまとめるクラスを作成します。

```swift
import Foundation
import SwiftData

class ToDoTaskService {
    // ここに各メソッドを追加していきます
}
```

## 2. タスクの追加と更新

タスクの作成（insert）と更新（save）を行うメソッドを追加します。
`class ToDoTaskService {` の中に記述してください。

```swift
    // タスクを追加する
    @MainActor
    static func addTask(_ task: ToDoTask, to modelContext: ModelContext) {
        modelContext.insert(task)
        // 変更を保存
        try? modelContext.save()
    }

    // タスクを更新する（変更を確定する）
    @MainActor
    static func updateTask(_ task: ToDoTask, modelContext: ModelContext) {
        try? modelContext.save()
    }
```

- `@MainActor`: データベース操作をメインスレッドで行うことを保証し、安全にUI更新などを行えるようにします。
- `modelContext.insert(task)`: 新しいデータをデータベースの保存対象として登録します。
- `modelContext.save()`: 変更を確定して保存します。

## 3. タスクの削除

タスクの削除機能を追加します。
個別の削除と、タブごとの一括削除を用意します。

```swift
    // タスクを削除する
    @MainActor
    static func deleteTask(_ task: ToDoTask, from modelContext: ModelContext) {
        modelContext.delete(task)
        try? modelContext.save()
    }

    // 特定のタブ内のタスクをすべて削除する（タブ削除時などに使用）
    @MainActor
    static func deleteAllTasks(for tabId: UUID, from modelContext: ModelContext) {
        // 条件（tabIdが一致）に合うタスクを探す設定
        let descriptor = FetchDescriptor<ToDoTask>(predicate: #Predicate { $0.tabId == tabId })

        // 取得して削除
        if let tasks = try? modelContext.fetch(descriptor) {
            tasks.forEach { modelContext.delete($0) }
            try? modelContext.save()
        }
    }
```

## 4. 完了状態の切り替え

タスクの完了/未完了を切り替えるメソッドを追加します。

```swift
    // 完了状態を切り替える
    @MainActor
    static func toggleTaskCompletion(_ task: ToDoTask, modelContext: ModelContext) {
        task.isCompleted.toggle()
        try? modelContext.save()
    }
```

---

## コード全体

### Services/ToDoTaskService.swift

```swift
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
