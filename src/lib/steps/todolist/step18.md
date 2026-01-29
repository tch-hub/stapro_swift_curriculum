# ステップ12: タスク完了機能の実装

<script>
    import {base} from '$app/paths';
</script>

## HomeView.swift の修正

リスト内のタスク行をタップして完了状態を切り替える機能を追加します：

```swift
List {
    ForEach(filteredTasks) { task in
        HStack {
            Button(action: {
                toggleTaskCompletion(task)
            }) {
                Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                    .foregroundColor(task.isCompleted ? .green : .gray)
            }
            .buttonStyle(PlainButtonStyle())

            Text(task.title)
                .strikethrough(task.isCompleted)
        }
    }
}

private func toggleTaskCompletion(_ task: ToDoTask) {
    ToDoTaskService.toggleTaskCompletion(task, modelContext: modelContext)
    loadTasks()
}
```

## 重要な修正点

1. `ToDoTask`は`Identifiable`なので、`ForEach`に`id`指定は不要です
2. Button内の画像をタップすると完了状態が切り替わります
3. 完了したタスクは緑色で表示されます

## toggleTaskCompletion メソッド

このメソッドは：

1. サービスを通じてタスクの完了状態を反転させます
2. データベースに変更を保存します
3. UI更新のためにタスク一覧を再度読み込みます

## 次のステップへ

次は、タスクを削除する機能を実装します。
