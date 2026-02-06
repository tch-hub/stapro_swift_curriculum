# ステップ20: スワイプ削除を追加する(HomeView.swift)

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

**削除処理メソッドの仕組み:**

- **`private func handleDeleteTask(_ offsets: IndexSet)`**
  削除対象の行番号（インデックス）の集合を受け取る関数です。
  - `IndexSet`: 整数の集合を表す型。複数の行を一度に削除できるため、配列ではなく集合を使います
  - `_`: 外部引数ラベルを省略（呼び出し時に `handleDeleteTask(offsets)` と書ける）

- **`for index in offsets { ... }`**
  削除対象の各インデックスをループ処理します。

  **なぜループが必要？**
  - ユーザーが複数の行を選択して一度に削除することがあるため
  - 通常は1つのインデックスですが、編集モードでは複数選択が可能です

- **`let taskToDelete = tasks[index]`**
  配列のインデックスを使って、削除対象のタスクオブジェクトを取得します。
  - `tasks[0]`: 1番目のタスク
  - `tasks[1]`: 2番目のタスク
  - `tasks[index]`: index番目のタスク

- **`ToDoTaskService.deleteTask(taskToDelete, from: modelContext)`**
  ステップ10で作成したサービスメソッドを使って、データベースから削除します。

- **`loadTasks()`**
  削除後、タスクリストを再読み込みして画面を更新します。
  - ループの外で1回だけ呼ぶことで、効率的に更新できます

**処理の流れ:**

1. ユーザーがタスクを左にスワイプ
2. 削除ボタンが表示される
3. 削除ボタンをタップ
4. `handleDeleteTask` が呼ばれる（削除する行番号が渡される）
5. 行番号から該当するタスクオブジェクトを取得
6. データベースから削除
7. タスクリストを再読み込み
8. UIが自動的に更新され、タスクが消える

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

**削除アクションの有効化:**

- **`onDelete: handleDeleteTask`**
  関数を値として渡しています（関数参照）。

  **関数参照とは？**
  - `handleDeleteTask()` と書くと、関数を**実行**してしまいます
  - `handleDeleteTask` と書くと、関数そのものを**値として渡す**ことができます
  - `CustomList` は、スワイプ削除が発生した時にこの関数を呼び出します

- **`CustomList` 内部での処理**
  ステップ6で作成した `CustomList` は、以下のように動作します:
  1. ユーザーがスワイプ操作を行う
  2. SwiftUIの `.onDelete` モディファイアが反応
  3. 削除対象の行番号（`IndexSet`）が取得される
  4. `onDelete` パラメータに渡された関数（`handleDeleteTask`）を呼び出す
  5. `handleDeleteTask` が実行され、データベースから削除される

- **`nil` から `handleDeleteTask` への変更**
  - 以前: `onDelete: nil` → スワイプ削除が無効
  - 今回: `onDelete: handleDeleteTask` → スワイプ削除が有効

**データの流れ:**

```
ユーザーのスワイプ操作
  ↓
CustomList が検知
  ↓
IndexSet（削除する行番号）を取得
  ↓
handleDeleteTask(offsets) を呼び出し
  ↓
データベースから削除
  ↓
loadTasks() で画面更新
  ↓
タスクが消える
```

お疲れ様でした！これでToDoリストアプリの主要な機能はすべて実装完了です。
プレビューやシミュレーターを実行して、タスクの追加・編集・削除ができるか確認してみましょう。

---

## コード全体

<img src="/images/todolist/20.png" alt="HomeViewの完成イメージ" class="mobile-screenshot" />

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
