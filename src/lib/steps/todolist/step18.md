# ステップ18: 完了切り替えを実装する(HomeView.swift)

### ステップ18終了時の完成イメージ

<img src="/images/todolist/18.png" alt="完了切り替え機能のイメージ" class="mobile-screenshot-top" />

## 1. 完了状態を切り替える仕組みを作る

`Views/HomeView.swift` を開き、タスクの完了状態を切り替えるメソッド（関数）を追加します。
`HomeView` 構造体の一番下（他のprivateメソッドの近く）に追加してください。

```swift
    // タスクの完了状態を切り替える処理
    private func toggleTaskCompletion(_ task: ToDoTask) {
       
        ToDoTaskService.toggleTaskCompletion(task, modelContext: modelContext)  // Serviceクラスを使ってデータベースの値を更新する
        
        loadTasks() // 更新後のリストを再読み込みして画面に反映させる
    }
```

**追加したメソッドの働き:**

| コード | 役割 |
|---|---|
| `private func toggleTaskCompletion(_ task: ToDoTask)` | タスクのデータを受け取り、その完了状態を反転（未完了→完了、完了→未完了）させる関数です。`_` をつけることで、呼び出す際に変数名を省略してシンプルに書けるようにしています。 |
| `ToDoTaskService.toggleTaskCompletion(...)` | ステップ10で作成したデータベース処理を呼び出します。ここでデータベース内の状態が更新され、保存されます。 |
| `loadTasks()` | データベースの更新後、最新のデータを画面に反映させるためにタスクを再読み込みします。（配列 `tasks` は画面表示用のコピーデータなので、改めてデータベースから取得し直す必要があります） |

---

## 2. タップしたときの動作を紐付ける

先ほど作った仕組みを画面の動きと連動させます。
`body` の中にある `ToDoListItem` の部分を修正し、タップされた時に上記の処理が実行されるようにします。

```swift
                // MARK: - コンテンツ
                if selectedTabId != nil && !tasks.isEmpty {
                    CustomList(items: tasks, onDelete: nil) { task in
                        ToDoListItem(
                            title: task.title,
                            isCompleted: task.isCompleted
                        ) {
                            toggleTaskCompletion(task) // タップされたら完了状態を切り替える処理を実行
                        }
                    }
                } else {
```

**クロージャとその仕組み:**

今回の `ToDoListItem(...) { ... }` のように、`{}` の中に書かれた処理を **クロージャ** と呼びます。

| 用語・機能 | 解説 |
|---|---|
| トレイリングクロージャ | 関数に渡す最後のデータが「実行したい処理（クロージャ）」の場合、本来のカッコ `()` の外に `{ }` を使って処理を後書きできる機能です。コードが整理されて読みやすくなります。 |
| 処理の実行タイミング | `{ toggleTaskCompletion(task) }` の中に書かれたプログラムは、画面が表示された時ではなく、**ユーザーがタップした瞬間** に初めて実行されます。 |
| クロージャのキャプチャ | `task` という変数の内容（どのタスクなのか）をクロージャ自身が記憶（キャプチャ）しておくことで、タップされた時に正しいタスクデータを更新処理へ渡すことができます。 |

---

## コード全体

<img src="/images/todolist/18.png" alt="完了切り替え機能のイメージ" class="mobile-screenshot" />

```swift title="Views/HomeView.swift"
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
    }

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
