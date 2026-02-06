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

**完了切り替えメソッドの仕組み:**

- **`private func toggleTaskCompletion(_ task: ToDoTask)`**
  タスクオブジェクトを受け取り、その完了状態を反転させる関数です。
  - `_` は外部引数ラベルを省略する記号。呼び出し時に `toggleTaskCompletion(task)` と書けます
  - 引数ラベルなしだと `toggleTaskCompletion(someTask)` のように簡潔に書けます

- **`ToDoTaskService.toggleTaskCompletion(task, modelContext: modelContext)`**
  ステップ10で作成したサービスメソッドを呼び出します。
  - このメソッド内で `task.isCompleted` が反転され、データベースに保存されます
  - ビジネスロジック（データ操作）をServiceクラスに分離することで、コードの保守性が向上します

- **`loadTasks()`**
  データベースの更新後、画面に表示するタスクリストを再読み込みします。
  
  **なぜ再読み込みが必要？**
  SwiftDataは自動的にビューを更新してくれますが、`tasks` 配列は `@State` で管理されているローカルコピーです。データベースの変更を反映するには、明示的に再取得する必要があります。

**データの流れ:**
1. ユーザーがタスクをタップ
2. `toggleTaskCompletion(task)` が呼ばれる
3. Serviceメソッドでデータベースの値を更新
4. `loadTasks()` でデータベースから最新のタスクリストを取得
5. `tasks` 配列が更新される
6. SwiftUIが自動的にUIを再描画
7. チェックマークの表示が切り替わる

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

**アクションの紐付けの仕組み:**

- **`ToDoListItem(...) { ... }`**
  これは**トレイリングクロージャ**という構文です。最後の引数がクロージャ（関数）の場合、括弧の外に書くことができます。
  
  通常の書き方:
  ```swift
  ToDoListItem(title: task.title, isCompleted: task.isCompleted, onTap: {
      toggleTaskCompletion(task)
  })
  ```
  
  トレイリングクロージャを使った書き方（上記のコード）:
  ```swift
  ToDoListItem(title: task.title, isCompleted: task.isCompleted) {
      toggleTaskCompletion(task)
  }
  ```
  
  **メリット:** コードがすっきりして読みやすくなります。

- **クロージャ内の処理**
  ```swift
  {
      toggleTaskCompletion(task)
  }
  ```
  
  このクロージャは、`ToDoListItem` がタップされた時に実行されます。
  - `task` は `CustomList` のループで現在処理中のタスクオブジェクト
  - タップされると、このタスクを引数として `toggleTaskCompletion` が呼ばれます

- **クロージャのキャプチャ**
  クロージャは、定義された時点の `task` の値を「キャプチャ」（記憶）します。
  - 各 `ToDoListItem` は、それぞれ異なるタスクをキャプチャしています
  - タップされた時、正しいタスクが `toggleTaskCompletion` に渡されます

**イベントの流れ:**
1. ユーザーが特定のタスク行をタップ
2. `ToDoListItem` 内部で `onTap` クロージャが実行される
3. キャプチャされた `task` を使って `toggleTaskCompletion(task)` が呼ばれる
4. データベースが更新される
5. `loadTasks()` で画面が更新される

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
