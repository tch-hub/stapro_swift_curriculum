# ステップ12: タスク追加機能の実装

<script>
    import {base} from '$app/paths';
</script>

## HomeView.swift の修正

タスクを追加するための入力アラートと「+」ボタンを追加します：

```swift
@State private var showingAddTask = false
@State private var newTaskTitle = ""

// 既存のZStack内に追加
.textFieldAlert(
    isPresented: $showingAddTask,
    title: "新しいタスクを追加",
    message: "タスクの内容を入力してください",
    text: $newTaskTitle,
    placeholder: "例: 買い物に行く",
    actionButtonTitle: "追加",
    action: addTask
)

if selectedTabId != nil {
    FloatingButton(
        action: { showingAddTask = true },
        icon: "plus",
        backgroundColor: .green
    )
}

private func addTask() {
    guard !newTaskTitle.isEmpty, let selectedTabId = selectedTabId else { return }

    let newTask = ToDoTask(title: newTaskTitle, detail: "", tabId: selectedTabId)
    ToDoTaskService.addTask(newTask, to: modelContext)

    newTaskTitle = ""
    showingAddTask = false
    loadTasks()
}
```

## 新しい要素

- `@State private var showingAddTask`: 入力アラートの表示状態を管理します
- `@State private var newTaskTitle`: 入力されたタスクのタイトルを保持します
- `.textFieldAlert()`: テキスト入力アラートを表示します
- `FloatingButton`: 画面右下の追加ボタンを表示します
- `addTask()`: 新しいタスクをデータベースに保存します

## 次のステップへ

次は、タスクを削除する機能を実装します。
