---
title: ステップ19: タスク追加フォームを作る(HomeView.swift)
summary: 画面下部にタスク追加欄を実装します。
---

### ステップ19終了時の完成イメージ

<img src="/images/todolist/19.png" alt="HomeViewの完成イメージ" class="mobile-screenshot-top" />

## 1. 入力された文字を覚えておく変数を作る

`Views/HomeView.swift` を開き、新しく入力されたタスクの名前を覚えておくための変数を追加します。

```swift
struct HomeView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var tabs: [ToDoTab] = []
    @State private var tasks: [ToDoTask] = []
    @State private var selectedTabId: UUID?

    @State private var newTaskTitle = "" // この行を追加
```

| コード                                 | 役割                                                                                                                                                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@State private var newTaskTitle = ""` | ユーザーが入力しているタスクの名前を一時的に保存しておくための変数です。<br>・最初は空（`""`）にしておきます。<br>・入力されるたびにこの変数の中身が変わり、タスクを追加し終わったらまた空に戻します。 |

## 2. タスクを入力する枠（エリア）を配置する

`body` の中身を修正し、画面の一番下にタスクを入力する枠（`InputView`）を配置します。
リストなどの他の部分と重ならないように、`.safeAreaInset` という仕組みを使います。
`.onAppear { loadTabs() }` の直下に追加します。
```swift
    var body: some View {
        VStack(spacing: 0) {
            // ... (これまでのヘッダーやリストの実装)
        }
        .navigationTitle("ToDoリスト")
        .onAppear { loadTabs() }

        // ここから下を追加
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

| コード・設定                    | 役割                                                                                                                                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.safeAreaInset(edge: .bottom)` | 画面の下部（`.bottom`）に入力欄を固定するための仕組みです。これを使うことで、リストの最後のタスクが入力欄に隠れて見えなくなるのを防ぎ、スクロールすれば全てのタスクが見えるようになります。           |
| `if selectedTabId != nil`       | 「どのタブにタスクを追加するか」を明確にするため、タブがきちんと選択されている時だけ入力欄を表示するようにする条件です。                                                                              |
| `InputView(...)`                | ステップ5で作った入力用コンポーネントです。<br>・`text: $newTaskTitle`: 入力された文字を変数と連動して同期します。<br>・`{ addTask() }`: 送信ボタンが押された時にタスクを追加する処理を呼び出します。 |

## 3. タスクを追加する仕組み（ロジック）を作る

送信ボタンが押された時に実行される `addTask` メソッドを作成します。入力された名前でタスクを作成し、データベースに保存します。
`private func toggleTaskCompletion(_ task: ToDoTask) {...}` の下に追加します。

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

| コード                                                                           | 役割                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `guard !newTaskTitle.isEmpty, let selectedTabId = selectedTabId else { return }` | カンマ（`,`）でつないで2つの条件を同時にチェックする安全確認です。<br>① `!newTaskTitle.isEmpty`: タスクの名前が空ではないこと<br>② `let selectedTabId = selectedTabId`: タブがきちんと選択されていること<br>どちらか一つでも満たしていなければ処理をストップ（`return`）して、空のタスクが作られるのを防ぎます。 |
| `let newTask = ToDoTask(...)`                                                    | 入力されたタイトルと、選択されているタブのIDを使って、新しいタスクのデータを作成します。                                                                                                                                                                                                                         |
| `ToDoTaskService.addTask(...)`                                                   | ステップ10で作成した処理を使って、新しく作成したタスクをデータベースへ保存します。                                                                                                                                                                                                                               |
| `newTaskTitle = ""`                                                              | 入力欄を空にして、次のタスクをすぐに入力できるように準備します。                                                                                                                                                                                                                                                 |

> [!NOTE] 
> コードが書けたら、`Command + R` でアプリを実行して、新しいタスクを入力して追加できるかを確認してみましょう！

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

## 練習問題

![完成イメージ](/images/todolist/p19.png)

このステップで学んだ **`.safeAreaInset` / `@State var newText` / `guard` による入力チェック / `.onChange` での自動更新** を使って、買い物リスト機能を実装してみましょう。

Xcodeで新規プロジェクト（App）を作成し、以下の条件を満たすコードを `ContentView.swift` に実装してください。

1. **`ShoppingItem` モデルの作成**（@Model）
   - `id: UUID`（主キー）
   - `name: String`（買い物アイテムの名前）

2. **`@State private var newItemName = ""`** を定義してください。

3. **`.safeAreaInset(edge: .bottom)` の配置**  
   `VStack` の末尾（または `navigationTitle` の後）に、下部入力エリアを表示してください。  
   入力エリアは `HStack` で `TextField` と「追加」`Button` を横並びにしてください。

4. **`addItem()` の実装**  
   以下の条件を `guard` で確認してください。
   - `newItemName` が空でないこと  
     モデルコンテキストに `insert()` でデータベースに保存し、入力欄を空にしてから `loadItems()` を呼んでください。

### 解答例

```swift title="ContentView.swift"
import SwiftUI
import SwiftData

// 買い物リスト項目のデータモデル
@Model final class ShoppingItem {
    var id: UUID
    var name: String

    init(name: String) {
        self.id = UUID()
        self.name = name
    }
}

struct ContentView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var items: [ShoppingItem] = []
    @State private var newItemName = ""

    var body: some View {
        VStack(spacing: 0) {
            if items.isEmpty {
                ContentUnavailableView("買い物リストが空です", systemImage: "cart.fill")
            } else {
                List {
                    ForEach(items, id: \.id) { item in
                        HStack {
                            Text(item.name)
                                .font(.body)
                            Spacer()
                            Image(systemName: "checkmark.circle")
                                .foregroundStyle(.secondary)
                        }
                    }
                    .onDelete { indices in
                        indices.forEach { index in
                            modelContext.delete(items[index])
                        }
                        loadItems()
                    }
                }
            }
        }
        .navigationTitle("買い物リスト")
        .onAppear {
            loadItems()
        }
        .safeAreaInset(edge: .bottom) {
            HStack {
                TextField("新しい買い物", text: $newItemName)
                    .textFieldStyle(.roundedBorder)
                Button("追加") { addItem() }
                    .disabled(newItemName.isEmpty)
            }
            .padding()
            .background(.ultraThinMaterial)
        }
    }

    private func loadItems() {
        let descriptor = FetchDescriptor<ShoppingItem>()
        items = (try? modelContext.fetch(descriptor)) ?? []
    }

    private func addItem() {
        guard !newItemName.isEmpty else { return }

        let item = ShoppingItem(name: newItemName)
        modelContext.insert(item)

        newItemName = ""
        loadItems()
    }
}

#Preview {
    NavigationStack {
        ContentView()
            .modelContainer(for: ShoppingItem.self, inMemory: true)
    }
}
```
