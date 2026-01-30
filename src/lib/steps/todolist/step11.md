# ステップ11: タスク操作のサービスを作る

タスクの追加・更新・削除をまとめた `ToDoTaskService` を作ります。

### 1. 追加

```swift
// メインスレッドで実行することを保証
@MainActor
static func addTask(_ task: ToDoTask, to modelContext: ModelContext) {
    // データベースに追加
    modelContext.insert(task)
    // 変更を保存
    try? modelContext.save()
}
```

`modelContext.insert` を使うことで、新しいタスクデータをデータベースへの保存対象として登録します。  
その直後に `save()` を呼び出して、変更を確定（永続化）させています。

### 2. 更新

```swift
@MainActor
static func updateTask(_ task: ToDoTask, modelContext: ModelContext) {
    // データの内容は変更済みなので、保存処理だけを行う
    try? modelContext.save()
}
```

SwiftData では、取得したモデルのプロパティを書き換えると自動的に変更が検知されます。  
そのため、明示的な更新メソッドは不要ですが、変更を確実にディスクに書き込むために `save()` を呼び出しています。

### 3. 削除

```swift
@MainActor
static func deleteTask(_ task: ToDoTask, from modelContext: ModelContext) {
    // データを削除対象にする
    modelContext.delete(task)
    // 変更を保存
    try? modelContext.save()
}
```

`modelContext.delete` に削除したいタスクオブジェクトを渡すことで、データベースから削除します。

### 4. 完了切り替え

```swift
// 完了/未完了の状態を反転させる
    task.isCompleted.toggle()
    // 変更を保存
    try? modelContext.save()
}
```

`toggle()` メソッドを使って `isCompleted` の `true` / `false` を切り替え、その結果を保存します。

```swift
tic func toggleTaskCompletion(_ task: ToDoTask, modelContext: ModelContext) {
    task.isCompleted.toggle()
    try? modelContext.save()
}// 指定された tabId を持つタスクだけを検索する条件を作成
    let descriptor = FetchDescriptor<ToDoTask>(predicate: #Predicate { $0.tabId == tabId })
    // 条件に合うタスクを取得
    if let tasks = try? modelContext.fetch(descriptor) {
        // 取得したタスクを1つずつ削除
        tasks.forEach { modelContext.delete($0) }
        // 変更をまとめて保存
        try? modelContext.save()
    }
}
```

特定のタブに含まれるタスクを一括削除する機能です。`#Predicate` を使って「`tabId` が一致するタスク」という検索条件を作り、該当するデータを全て取得してから削除しています。

```swift
inActor
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
