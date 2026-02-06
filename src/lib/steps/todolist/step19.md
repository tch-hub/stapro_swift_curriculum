# ステップ19: タスク追加フォームを作る(HomeView.swift)

## 1. 入力用の状態変数

`Views/HomeView.swift` を開き、新しく作成するタスクのタイトルを保持するための変数を追加します。

```swift
struct HomeView: View {
    // ... 既存の変数

    // ↓この行を追加
    @State private var newTaskTitle = ""
```

**入力用状態変数の役割:**

- **`@State private var newTaskTitle = ""`**
  ユーザーが入力中のタスクタイトルを保持する変数です。
  - 初期値は空文字列（`""`）
  - `InputView` とバインディングして、入力内容をリアルタイムで同期します
  - タスク追加後は空文字列にリセットして、次の入力に備えます
  
  **`@State` の役割:** この変数が変更されると、SwiftUIが自動的にUIを更新します。ユーザーが文字を入力するたびに、この変数の値が変わります。

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

**入力エリアの配置方法:**

- **`.safeAreaInset(edge: .bottom)`**
  画面の下部に、コンテンツを押し上げる形で要素を固定配置するモディファイアです。
  
  **他の配置方法との違い:**
  - `.overlay`: コンテンツの上に重ねる（コンテンツが隠れる）
  - `.background`: コンテンツの下に配置
  - **`.safeAreaInset`**: コンテンツを押し上げて、被らないようにする ← 今回使用
  
  **メリット:** リストの最後の項目が入力欄に隠れず、スクロールすれば全て見えます。

- **`edge: .bottom`**
  配置する位置を指定します。
  - `.bottom`: 画面下部
  - `.top`: 画面上部
  - `.leading`: 左端（右から左に読む言語では右端）
  - `.trailing`: 右端（右から左に読む言語では左端）

- **`if selectedTabId != nil { ... }`**
  タブが選択されている時だけ入力欄を表示します。
  - タブ未選択の状態では、入力欄は表示されません
  - これにより、「どのタブに追加するか」が明確になります

- **`InputView(text: $newTaskTitle) { addTask() }`**
  ステップ5で作成した入力コンポーネントを使用します。
  - `text: $newTaskTitle`: Bindingで入力内容を同期
  - `{ addTask() }`: 送信ボタンが押された時の処理（トレイリングクロージャ）

**レイアウトの仕組み:**
1. `VStack` でヘッダーとリストを縦に配置
2. `.safeAreaInset` で下部に入力欄を追加
3. SwiftUIが自動的にリストの高さを調整
4. リストがスクロール可能になり、入力欄は常に下部に固定される

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

**タスク追加メソッドの仕組み:**

- **`guard !newTaskTitle.isEmpty, let selectedTabId = selectedTabId else { return }`**
  複数の条件を同時にチェックする `guard` 文です。カンマ（`,`）で条件を繋げています。
  
  **条件1: `!newTaskTitle.isEmpty`**
  - タイトルが空でないことを確認
  - 空文字列のタスクは作成しません
  
  **条件2: `let selectedTabId = selectedTabId`**
  - オプショナル型の `selectedTabId`（プロパティ）から値を取り出す
  - 成功したら、新しい定数 `selectedTabId` に格納（シャドーイング）
  - 失敗（nilの場合）したら `return` で関数を終了
  
  **シャドーイング（変数の上書き）:**
  ```swift
  // プロパティ: UUID? 型（オプショナル）
  @State private var selectedTabId: UUID?
  
  // guard let で取り出した定数: UUID 型（非オプショナル）
  let selectedTabId = selectedTabId
  ```
  同じ名前を使うことで、以降のコードでは非オプショナル型として扱えます。

- **`let newTask = ToDoTask(title: newTaskTitle, detail: "", tabId: selectedTabId)`**
  新しいタスクオブジェクトを作成します。
  - `title`: ユーザーが入力したタイトル
  - `detail`: 詳細（今回は空文字列）
  - `tabId`: 選択中のタブのID（guardで取り出した非オプショナル値）

- **`ToDoTaskService.addTask(newTask, to: modelContext)`**
  ステップ10で作成したサービスメソッドを使って、データベースに保存します。

- **`newTaskTitle = ""`**
  入力欄をクリアします。これにより、次のタスク入力に備えます。
  - `@State` 変数なので、この変更でUIも自動的に更新されます

- **`loadTasks()`**
  タスクリストを再読み込みして、新しく追加したタスクを画面に表示します。

**処理の流れ:**
1. ユーザーが入力欄にタイトルを入力
2. 送信ボタンをタップ
3. `addTask()` が呼ばれる
4. タイトルが空でないか、タブが選択されているかをチェック
5. 新しいタスクオブジェクトを作成
6. データベースに保存
7. 入力欄をクリア
8. タスクリストを再読み込み
9. UIが自動的に更新され、新しいタスクが表示される

---

## コード全体

<img src="/images/todolist/19.png" alt="HomeViewの完成イメージ" class="mobile-screenshot" />

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

