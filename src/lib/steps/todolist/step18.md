# ステップ12: タスク完了機能の実装

<script>
    import {base} from '$app/paths';
</script>

## HomeView.swift の修正

タスク行をタップして完了状態を切り替える機能を追加します：

```swift
CustomList(items: tasks, onDelete: handleDeleteTask) { task in
    ToDoListItem(
        title: task.title,
        isCompleted: task.isCompleted
    ) {
        toggleTaskCompletion(task)
    }
}

private func toggleTaskCompletion(_ task: ToDoTask) {
    ToDoTaskService.toggleTaskCompletion(task, modelContext: modelContext)
    loadTasks()
}
```

## 重要な修正点

1. `ToDoListItem`のタップで完了状態が切り替わります
2. 完了したタスクはチェック表示になります

## toggleTaskCompletion メソッド

このメソッドは：

1. サービスを通じてタスクの完了状態を反転させます
2. データベースに変更を保存します
3. UI更新のためにタスク一覧を再度読み込みます

## 次のステップへ

次は、タスクを削除する機能を実装します。
