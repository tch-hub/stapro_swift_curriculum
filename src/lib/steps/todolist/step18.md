# ステップ18: 完了切り替えを実装する(HomeView.swift)

## 1. ロジックの実装: 完了切り替え

`Views/HomeView.swift` を開き、タスクの完了状態を切り替えるメソッドを追加します。
`HomeView` クラスの一番下（他のprivateメソッドの近く）に追加してください。

```swift
// タスクの完了状態を切り替える
private func toggleTaskCompletion(_ task: ToDoTask) {
    // Serviceクラスを使ってデータベースの値を更新
    ToDoTaskService.toggleTaskCompletion(task, modelContext: modelContext)
    // 更新後のリストを再読み込みして表示に反映
    loadTasks()
}
```

## 2. UIの修正: アクションの紐付け

`body` の中にある `ToDoListItem` の呼び出し部分を修正し、タップされた時に上記のメソッドを実行するようにします。

```swift
if selectedTabId != nil && !tasks.isEmpty {
    CustomList(items: tasks, onDelete: nil) { task in
        ToDoListItem(
            title: task.title,
            isCompleted: task.isCompleted
        ) {
            // タップされたら完了状態を切り替える
            toggleTaskCompletion(task)
        }
    }
}
```

---

## コード全体

<img src="/images/todolist/18.png" alt="完了切り替え機能のイメージ" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

### Views/HomeView.swift

```swift
import SwiftUI
import SwiftData

struct HomeView: View {
    @Environment(\.modelContext) private var modelContext

    @State private var tabs: [ToDoTab] = []
    @State private var tasks: [ToDoTask] = []
    @State private var selectedTabId: UUID?

    @Binding var navigationPath: [NavigationItem]

    var body: some View {
        VStack(spacing: 0) {
            if tabs.isEmpty {
                ContentUnavailableView("タブがありません", systemImage: "tray")
            } else {
                // MARK: - ヘッダー
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

                // MARK: - コンテンツ
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
}

#Preview {
    NavigationStack {
        HomeView(navigationPath: .constant([]))
            .modelContainer(for: [ToDoTab.self, ToDoTask.self], inMemory: true)
    }
}
```
