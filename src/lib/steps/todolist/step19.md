# ステップ19: タスク追加フォームを作る(HomeView.swift)

## 1. 入力用の状態変数

`Views/HomeView.swift` を開き、新しく作成するタスクのタイトルを保持するための変数を追加します。

```swift
struct HomeView: View {
    // ... 既存の変数
    
    // ↓この行を追加
    @State private var newTaskTitle = ""
```

## 2. UIの実装: 入力エリア

`body` の中身を修正し、画面下部に `InputView` を配置します。
リストなど既存のコンテンツが入力欄に被らないように、`.safeAreaInset` を使います。

```swift
    var body: some View {
        VStack(spacing: 0) {
            // ... (既存のヘッダーやリストの実装)
        }
        .navigationTitle("ToDoリスト")
        .onAppear { loadTabs() }
        
        // ↓ここから追加（VStackの外、bodyの最後の方）
        // 画面の下部に入力エリアを固定表示
        .safeAreaInset(edge: .bottom) {
            // タブが選択されている時のみ表示
            if selectedTabId != nil {
                InputView(text: $newTaskTitle) {
                    addTask()
                }
            }
        }
    }
```

## 3. ロジックの実装: タスク追加

`addTask` メソッドを実装します。入力されたタイトルでタスクを作成・保存します。

```swift
    // 新しいタスクを追加
    private func addTask() {
        // ガード節：タイトルがあり、かつタブが選択されていること
        guard !newTaskTitle.isEmpty, let selectedTabId = selectedTabId else { return }

        // タスクモデルを作成
        let newTask = ToDoTask(title: newTaskTitle, detail: "", tabId: selectedTabId)
        
        // データベースに保存
        ToDoTaskService.addTask(newTask, to: modelContext)

        // 入力欄をクリアしてリスト更新
        newTaskTitle = ""
        loadTasks()
    }
```

---

## コード全体

<img src="/images/todolist/19.png" alt="HomeViewの完成イメージ" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

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
                    CustomList(items: tasks, onDelete: nil) { task in
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
        .onAppear {
            loadTabs()
        }
        // MARK: - 入力エリア
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
}

#Preview {
    NavigationStack {
        HomeView(navigationPath: .constant([]))
            .modelContainer(for: [ToDoTab.self, ToDoTask.self], inMemory: true)
    }
}
```
