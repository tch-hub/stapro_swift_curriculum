# ステップ12: タスク追加機能の実装

<script>
    import {base} from '$app/paths';
</script>

## HomeView.swift の修正

タスクを追加するための画面下部の入力欄を追加します：

```swift
@State private var newTaskTitle = ""

// 既存のZStackの外側に追加
.safeAreaInset(edge: .bottom) {
    if selectedTabId != nil {
        HStack(spacing: 12) {
            TextField("新しいタスク", text: $newTaskTitle)
                .textFieldStyle(.roundedBorder)
                .submitLabel(.done)
                .onSubmit {
                    addTask()
                }

            Button("追加") {
                addTask()
            }
            .buttonStyle(.borderedProminent)
            .disabled(newTaskTitle.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(.ultraThinMaterial)
    }
}

private func addTask() {
    guard !newTaskTitle.isEmpty, let selectedTabId = selectedTabId else { return }

    let newTask = ToDoTask(title: newTaskTitle, detail: "", tabId: selectedTabId)
    ToDoTaskService.addTask(newTask, to: modelContext)

    newTaskTitle = ""
    loadTasks()
}
```

## 新しい要素

- `@State private var newTaskTitle`: 入力されたタスクのタイトルを保持します
- `.safeAreaInset()`: 画面下部に入力エリアを固定表示します
- `addTask()`: 新しいタスクをデータベースに保存します

## 次のステップへ

次は、タスクを削除する機能を実装します。
