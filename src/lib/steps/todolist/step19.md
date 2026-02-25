# ステップ19: タスク追加フォームを作る(HomeView.swift)

### ステップ19終了時の完成イメージ

<img src="/images/todolist/19.png" alt="HomeViewの完成イメージ" class="mobile-screenshot-top" />

## 1. 入力された文字を覚えておく箱（変数）を作る

`Views/HomeView.swift` を開き、新しく入力されたタスクの名前を覚えておくための変数を追加します。

```swift
struct HomeView: View {
    // ... （既存の変数）

    @State private var newTaskTitle = ""
```


| コード | 役割 |
|---|---|
| `@State private var newTaskTitle = ""` | ユーザーが入力しているタスクの名前を一時的に保存しておくための変数です。<br>・最初は空（`""`）にしておきます。<br>・入力されるたびにこの変数の中身が変わり、タスクを追加し終わったらまた空に戻します。 |

## 2. タスクを入力する枠（エリア）を配置する

`body` の中身を修正し、画面の一番下にタスクを入力する枠（`InputView`）を配置します。
リストなどの他の部分と重ならないように、`.safeAreaInset` という仕組みを使います。

```swift
    var body: some View {
        VStack(spacing: 0) {
            // ... (これまでのヘッダーやリストの実装)
        }
        .navigationTitle("ToDoリスト")
        .onAppear { loadTabs() }

        // 画面の下部に入力エリアを固定表示する
        .safeAreaInset(edge: .bottom) {
            // タブが選択されている時だけ入力エリアを表示
            if selectedTabId != nil {
                InputView(text: $newTaskTitle) {
                    addTask()
                }
            }
        }
    }
```


| コード・設定 | 役割 |
|---|---|
| `.safeAreaInset(edge: .bottom)` | 画面の下部（`.bottom`）に入力欄を固定するための仕組みです。これを使うことで、リストの最後のタスクが入力欄に隠れて見えなくなるのを防ぎ、スクロールすれば全てのタスクが見えるようになります。 |
| `if selectedTabId != nil` | 「どのタブにタスクを追加するか」を明確にするため、タブがきちんと選択されている時だけ入力欄を表示するようにする条件です。 |
| `InputView(...)` | ステップ5で作った入力用コンポーネントです。<br>・`text: $newTaskTitle`: 入力された文字を変数と連動して同期します。<br>・`{ addTask() }`: 送信ボタンが押された時にタスクを追加する処理を呼び出します。 |


## 3. タスクを追加する仕組み（ロジック）を作る

送信ボタンが押された時に実行される `addTask` メソッドを作成します。入力された名前でタスクを作成し、データベースに保存します。

```swift
    // 新しいタスクを追加する処理
    private func addTask() {
        
        guard !newTaskTitle.isEmpty, let selectedTabId = selectedTabId else { return } // 安全確認：名前に入力があり、かつ、タブが選択されていること

       
        let newTask = ToDoTask(title: newTaskTitle, detail: "", tabId: selectedTabId)  // 新しいタスクのデータを作成する

        ToDoTaskService.addTask(newTask, to: modelContext) // データベースに保存する
        newTaskTitle = ""
        loadTasks()
    }
```

| コード | 役割 |
|---|---|
| `guard !newTaskTitle.isEmpty, let selectedTabId = selectedTabId else { return }` | カンマ（`,`）でつないで2つの条件を同時にチェックする安全確認です。<br>① `!newTaskTitle.isEmpty`: タスクの名前が空ではないこと<br>② `let selectedTabId = selectedTabId`: タブがきちんと選択されていること<br>どちらか一つでも満たしていなければ処理をストップ（`return`）して、空のタスクが作られるのを防ぎます。 |
| `let newTask = ToDoTask(...)` | 入力されたタイトルと、選択されているタブのIDを使って、新しいタスクのデータを作成します。 |
| `ToDoTaskService.addTask(...)` | ステップ10で作成した処理を使って、新しく作成したタスクをデータベースへ保存します。 |
| `newTaskTitle = ""` | 入力欄を空にして、次のタスクをすぐに入力できるように準備します。 |

---

## コード全体

<img src="/images/todolist/19.png" alt="HomeViewの完成イメージ" class="mobile-screenshot" />

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
}

#Preview {
    NavigationStack {
        HomeView(navigationPath: .constant([]))
            .modelContainer(for: [ToDoTab.self, ToDoTask.self], inMemory: true)
    }
}
```
