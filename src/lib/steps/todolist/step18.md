# ステップ18: 完了切り替えを実装する

タスクをタップした時に完了/未完了を切り替えます。

### 1. 切り替え処理を追加

```swift
// タスクの完了状態を切り替えるメソッド
private func toggleTaskCompletion(_ task: ToDoTask) {
    // Serviceクラスを使ってデータベースの値を更新
    ToDoTaskService.toggleTaskCompletion(task, modelContext: modelContext)
    // 更新後のリストを再読み込みして表示に反映
    loadTasks()
}
```

`ToDoTaskService` に定義した `toggleTaskCompletion` を呼び出してデータベースを更新し、直後に `loadTasks` を呼ぶことで画面上のタスク一覧も最新の状態（チェックマークの有無など）に更新します。

### 2. ToDoListItem に処理を渡す

```swift
// リスト内の各行を作成
ToDoListItem(
    title: task.title,
    isCompleted: task.isCompleted
) {
    // タップされた時に呼ばれるクロージャ
    toggleTaskCompletion(task)
}
```

`ToDoListItem` コンポーネントの初期化時に、タップ時の動作として先ほど作成した `toggleTaskCompletion` メソッドを実行するように設定しています。  
これにより、行をタップするとタスクの完了状態が切り替わるようになります。

---

## コード全体

<img src="/images/todolist/18.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
// HomeView.swift
import SwiftUI
import SwiftData

struct HomeView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var tabs: [ToDoTab] = []
    @State private var tasks: [ToDoTask] = []
    @State private var selectedTabId: UUID?
    @Binding var navigationPath: [NavigationItem]

    var body: some View {
        VStack {
            if tabs.isEmpty {
                Text("タブがありません")
                    .padding()
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
        .padding()
        .navigationTitle("ToDoリスト")
        .onAppear {
            loadTabs()
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
}
```
