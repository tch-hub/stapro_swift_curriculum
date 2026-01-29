# ステップ5: ToDoTaskServiceの実装

<script>
    import {base} from '$app/paths';
</script>

## サービスクラスとは

データの追加、更新、削除などの操作をまとめるクラスです。ビューから直接データベースにアクセスするのではなく、サービスを通して操作することで、コードを整理します。

## ToDoTaskService.swift の作成

`Services/`フォルダに`ToDoTaskService.swift`を作成し、以下のコードを記述します：

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

## 各メソッドの説明

| メソッド               | 説明                             |
| ---------------------- | -------------------------------- |
| `addTask`              | 新しいタスクを追加します         |
| `updateTask`           | タスクを更新します               |
| `deleteTask`           | タスクを削除します               |
| `toggleTaskCompletion` | タスクの完了状態を切り替えます   |
| `deleteAllTasks`       | 特定のタブの全タスクを削除します |

## @MainActor について

SwiftUIでUI更新を行う際には、メインスレッドで実行する必要があります。`@MainActor`はメインスレッドで実行することを指定します。

## 次のステップへ

次は、タブを操作するためのサービス`ToDoTabService`を作成します。
