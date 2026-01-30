# ステップ19: スワイプ削除を追加する

タスクを左にスワイプして削除できるようにします。

### 1. onDelete を渡す

```swift
// スワイプ削除時の処理（handleDeleteTask）をCustomListに渡す
CustomList(items: tasks, onDelete: handleDeleteTask) { task in
    ToDoListItem(
        title: task.title,
        isCompleted: task.isCompleted
    ) {
        toggleTaskCompletion(task)
    }
}
```

`CustomList` の初期化パラメータ `onDelete` に次のステップで説明する削除メソッド `handleDeleteTask` を渡すことで、スワイプ操作による行の削除機能が有効になります。

### 2. 削除処理

```swift
// スワイプ削除イベントを受け取るメソッド
private func handleDeleteTask(_ offsets: IndexSet) {
    // 選択された行のインデックス（番号）をループ処理
    for index in offsets {
        // インデックスから削除対象のタスクを特定
        let taskToDelete = tasks[index]
        // データベースから削除
        ToDoTaskService.deleteTask(taskToDelete, from: modelContext)
    }
    // リスト表示を更新
    loadTasks()
}
```

リストでスワイプ削除が行われると、削除対象の行番号（インデックス）の集合が `offsets` として渡されてきます。  
これを使って対象の `ToDoTask` を特定し、データベースから削除します。

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
// HomeView.swift
import SwiftUI
import SwiftData

struct HomeView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var tabs: [ToDoTab] = []
    @State private var tasks: [ToDoTask] = []
    @State private var selectedTabId: UUID?
    @State private var newTaskTitle = ""
    @Binding var navigationPath: [NavigationItem]

    var body: some View {
        ZStack {
            VStack {
                if tabs.isEmpty {
                    Text("タブがありません")
                        .padding()
                } else {
                    TabHeaderView(
                        tabs: tabs,
                        selectedTabId: $selectedTabId,
                        onManageTabs: {
                            navigationPath.append(NavigationItem(id: .tabManage))
                        }
                    )
                    .onChange(of: selectedTabId) { _, _ in
                        loadTasks()
                    }

                    if selectedTabId != nil && !tasks.isEmpty {
                        CustomList(items: tasks, onDelete: handleDeleteTask) { task in
                            ToDoListItem(
                                title: task.title,
                                isCompleted: task.isCompleted
                            ) {
                                toggleTaskCompletion(task)
                            }
                        }
                    } else {
                        EmptyStateView(hasSelectedTab: selectedTabId != nil)
                    }
                }

            }
            .padding()
            .navigationTitle("ToDoリスト")
            .onAppear {
                loadTabs()
            }
        }
        .safeAreaInset(edge: .bottom) {
            if selectedTabId != nil {
                TaskInputView(text: $newTaskTitle, onAdd: addTask)
            }
        }
    }

    private func loadTabs() {
        let descriptor = FetchDescriptor<ToDoTab>()
        tabs = (try? modelContext.fetch(descriptor)) ?? []
        if let selectedTabId = selectedTabId {
            // 現在の選択が削除済みの場合は先頭タブに戻す
            if !tabs.contains(where: { $0.id == selectedTabId }) {
                self.selectedTabId = tabs.first?.id
            }
        } else {
            selectedTabId = tabs.first?.id
        }
        loadTasks()
    }

    private func loadTasks() {
        guard let selectedTabId = selectedTabId else {
            tasks = []
            return
        }

        let descriptor = FetchDescriptor<ToDoTask>(
            predicate: #Predicate { $0.tabId == selectedTabId }
        )
        tasks = (try? modelContext.fetch(descriptor)) ?? []
    }

    private func toggleTaskCompletion(_ task: ToDoTask) {
        ToDoTaskService.toggleTaskCompletion(task, modelContext: modelContext)
        loadTasks()
    }

    private func addTask() {
        guard !newTaskTitle.isEmpty, let selectedTabId = selectedTabId else { return }

        let newTask = ToDoTask(title: newTaskTitle, detail: "", tabId: selectedTabId)
        ToDoTaskService.addTask(newTask, to: modelContext)

        newTaskTitle = ""
        loadTasks()
    }

    private func handleDeleteTask(_ offsets: IndexSet) {
        for index in offsets {
            let taskToDelete = tasks[index]
            ToDoTaskService.deleteTask(taskToDelete, from: modelContext)
        }
        loadTasks()
    }
}
```
