# ステップ20: スワイプ削除を追加する(HomeView.swift)

いよいよ最後のステップです。タスクを左にスワイプして削除できるようにします。

## 1. ロジックの実装: 削除処理

`Views/HomeView.swift` を開き、タスク削除用のメソッドを追加します。
リスト操作では削除対象が「何行目か(IndexSet)」で渡されるため、それを使って削除対象のタスクを特定します。

```swift
    // スワイプ削除イベントを受け取るメソッド
    private func handleDeleteTask(_ offsets: IndexSet) {
        // 渡されたインデックス（行番号）をループ処理
        for index in offsets {
            // インデックスに対応するタスクを取得
            let taskToDelete = tasks[index]
            // データベースから削除
            ToDoTaskService.deleteTask(taskToDelete, from: modelContext)
        }
        // 表示を更新
        loadTasks()
    }
```

## 2. UIの修正: 削除アクションの有効化

`body` 内の `CustomList` の呼び出し部分を修正し、`onDelete` パラメータに先ほどのメソッドを渡します。

```swift
                if selectedTabId != nil && !tasks.isEmpty {
                    // onDelete に handleDeleteTask を渡すことでスワイプ削除が有効になります
                    CustomList(items: tasks, onDelete: handleDeleteTask) { task in
                        ToDoListItem(
                            title: task.title,
                            isCompleted: task.isCompleted
                        ) {
                            toggleTaskCompletion(task)
                        }
                    }
                }
```

お疲れ様でした！これでToDoリストアプリの主要な機能はすべて実装完了です。
プレビューやシミュレーターを実行して、タスクの追加・編集・削除ができるか確認してみましょう。

---

## コード全体

<img src="/images/todolist/20.png" alt="HomeViewの完成イメージ" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

### Views/HomeView.swift

```swift
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
        VStack(spacing: 0) {
            if tabs.isEmpty {
                ContentUnavailableView("タブがありません", systemImage: "tray")
            } else {
                TabHeaderView(
                    tabs: tabs.map { .init(id: $0.id, name: $0.name) },
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
        .navigationTitle("ToDoリスト")
        .onAppear { loadTabs() }
        .safeAreaInset(edge: .bottom) {
            if selectedTabId != nil {
                InputView(text: $newTaskTitle) {
                    addTask()
                }
            }
        }
    }

    // MARK: - Private Methods

    private func loadTabs() {
        tabs = ToDoTabService.getAllTabs(from: modelContext)
        
        if let currentId = selectedTabId {
            if !tabs.contains(where: { $0.id == currentId }) {
                selectedTabId = tabs.first?.id
            }
        } else {
            selectedTabId = tabs.first?.id
        }
        loadTasks()
    }

    private func loadTasks() {
        guard let tabId = selectedTabId else {
            tasks = []
            return
        }
        
        let descriptor = FetchDescriptor<ToDoTask>(
            predicate: #Predicate { $0.tabId == tabId }
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

#Preview {
    NavigationStack {
        HomeView(navigationPath: .constant([]))
            .modelContainer(for: [ToDoTab.self, ToDoTask.self], inMemory: true)
    }
}
```
