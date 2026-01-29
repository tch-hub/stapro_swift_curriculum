# ステップ13: タスク削除機能の実装

<script>
    import {base} from '$app/paths';
</script>

## HomeView.swift の修正

リスト内でスワイプして削除できるようにします：

```swift
CustomList(items: tasks, onDelete: handleDeleteTask) { task in
    ToDoListItem(
        title: task.title,
        isCompleted: task.isCompleted
    ) {
        toggleTaskCompletion(task)
    }
}

private func handleDeleteTask(_ offsets: IndexSet) {
    for index in offsets {
        let taskToDelete = tasks[index]
        ToDoTaskService.deleteTask(taskToDelete, from: modelContext)
    }
    loadTasks()
}
```

## .onDelete モディファイア

- `onDelete`: `CustomList`に削除処理を渡します
- `offsets`: 削除対象の行のインデックスを示します
- 削除後は`loadTasks()`でUI更新します

## 削除の流れ

1. ユーザーがタスクをスワイプします
2. 削除ボタンが表示されます
3. ユーザーが削除ボタンをタップします
4. `handleDeleteTask()`メソッドが呼び出されます
5. サービスを通じてタスクをデータベースから削除します
6. UI更新のためにタスク一覧を再度読み込みます

## 次のステップへ

次は、タブを管理するための画面`TabManageView`を作成します。
