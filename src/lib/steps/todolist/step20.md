---
title: ステップ20: スワイプ削除を追加する(HomeView.swift)
summary: タスクをスワイプして削除できるようにします。
---

### ステップ20終了時の完成イメージ

<img src="/images/todolist/20.png" alt="HomeViewの完成イメージ" class="mobile-screenshot-top" />

## 1. タスクを削除する仕組みを作る

`Views/HomeView.swift` を開き、タスク削除用のメソッド（処理）を追加します。
リストから項目を削除する時は「上から何番目の行か（インデックス）」を指定して削除する対象を特定します。

```swift
    // スワイプ削除を実行する処理
    private func handleDeleteTask(_ offsets: IndexSet) {
        for index in offsets { // 渡された行番号（インデックス）を一つずつ処理する
            let taskToDelete = tasks[index]  // その行番号にあるタスクのデータを取得する
            ToDoTaskService.deleteTask(taskToDelete, from: modelContext) // 取得したタスクをデータベースから削除する
        }
        loadTasks() // タスクが消えた後の最新リストを画面に反映させる
    }
```

**削除処理の仕組み:**

| コード                                               | 役割                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `private func handleDeleteTask(_ offsets: IndexSet)` | 削除したい行番号（インデックス）のまとまりを受け取る関数です。<br>・`IndexSet` という「複数の番号をまとめられる型」を使うことで、複数の行を一度に削除することも可能にしています。<br>・`_` をつけることで、呼び出すときに `offsets:` という名前を省略して書けるようにしています。 |
| `for index in offsets { ... }`                       | 今回削除したい行番号を一つずつ取り出して、中カッコ `{ }` の中の処理を繰り返します（これを**ループ処理**と呼びます）。                                                                                                                                                             |
| `let taskToDelete = tasks[index]`                    | 変数 `tasks` に入っている一覧から、`index`（今回削除する行番号）番目のデータを取得し、`taskToDelete` という定数に一時的に入れます。                                                                                                                                               |
| `ToDoTaskService.deleteTask(...)`                    | ステップ10で作成したデータベース処理を呼び出し、先ほど取得したタスクのデータをデータベースから削除します。                                                                                                                                                                        |
| `loadTasks()`                                        | 全ての削除が終わったあとに1回だけ呼ぶことで、タスクが消えた最新の状態を画面に表示し直します。                                                                                                                                                                                     |

## 2. 画面のスワイプ動作と紐付ける

作った削除機能を画面から使えるようにします。
`body` 内の `CustomList` の呼び出し部分を修正し、`onDelete` という設定に先ほど作った処理を渡します。

```swift
                // MARK: - コンテンツ
                if selectedTabId != nil && !tasks.isEmpty {

                    CustomList(items: tasks, onDelete: handleDeleteTask) { task in // onDelete に handleDeleteTask を渡すことでスワイプ削除が有効になります
                        ToDoListItem(
                            title: task.title,
                            isCompleted: task.isCompleted
                        ) {
                            toggleTaskCompletion(task)
                        }
                    }
                } else {
```

**スワイプ削除を有効にする仕組み:**

| コード                       | 役割・解説                                                                                                                                                                                                                                                           |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onDelete: handleDeleteTask` | タスクがスワイプ（横にサッとスライド）された時に、「この関数を実行してね」と処理自体を渡しています。<br>・**注意:** カッコをつけて `handleDeleteTask()` と書いてしまうとその場で実行されてしまうため、カッコはつけずに「関数の名前だけ」を渡すのがポイントです。     |
| `CustomList` の動作          | もともと `onDelete: nil`（削除機能なし）にしていた部分を関数に置き換えたことで、以下のように動くようになります。<br>① ユーザーが画面でスワイプする<br>② 左から「削除」ボタンが現れる<br>③ ボタンを押すと消す行番号が特定され、自動的に `handleDeleteTask` へ渡される |

お疲れ様でした！これでToDoリストアプリの主要な機能はすべて実装完了です。
プレビューやシミュレーターを実行して、タスクの追加・完了の切り替え・スワイプでの削除がすべて正しく動くか、実際に触って確認してみましょう！

---

## コード全体

<img src="/images/todolist/20.png" alt="HomeViewの完成イメージ" class="mobile-screenshot" />

```swift title="Views/HomeView.swift"
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
