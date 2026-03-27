---
title: ステップ17: タブとタスクを表示する(HomeView.swift)
summary: タブ選択とタスク一覧の表示を実装します。
---

### ステップ17終了時の完成イメージ

<img src="/images/todolist/17.png" alt="HomeViewの完成イメージ" class="mobile-screenshot-top" />

## 1. データを入れる箱（変数）を準備する

`Views/HomeView.swift` を開いて、画面に表示する「タブ」や「タスク」を覚えておくための変数を追加しましょう。

```swift
import SwiftUI
import SwiftData // この行を追加

struct HomeView: View {
    @Environment(\.modelContext) private var modelContext // この行を追加
    // 画面に表示するデータを覚えておくための箱
    @State private var tabs: [ToDoTab] = []         // この行を追加
    @State private var tasks: [ToDoTask] = []       // この行を追加
    @State private var selectedTabId: UUID?         // この行を追加

    @Binding var navigationPath: [NavigationItem]
}
```

| 追加した内容     | 役割                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `modelContext`   | データベース（データの箱）からデータを取ってきたり保存したりする道具                                                      |
| `tabs`           | データベースから取ってきた「すべてのタブ」を入れておく箱。中身が変わると自動で画面も変わります。                          |
| `tasks`          | 今選ばれているタブに入っている「タスク」を入れておく箱。                                                                  |
| `selectedTabId`  | 今どのタブが選ばれているかを覚えておくための変数。何も選ばれていない状態もあるので、`?`（オプショナル型）がついています。 |
| `navigationPath` | 別の画面（タブ管理画面）へ移動したい時に、移動先の情報を追加するための道具。                                              |

## 2. 画面の枠組みを作る

`body` の中身を作っていきましょう。
まずは全体の枠組みと、アプリを開いたばかりで「タブが1つもない時」の表示を作ります。
`body` の中身を一度消してから書いてください。

```swift
    var body: some View {
        VStack(spacing: 0) {
            if tabs.isEmpty {
                // タブが1つもない時：「タブがありません」という案内を表示する
                ContentUnavailableView("タブがありません", systemImage: "tray")
            } else {
                // タブがある時：ここにタブの切り替えボタンとタスクのリストを作ります
            }
        }
        .navigationTitle("ToDoリスト") // 画面の上にタイトルを表示
        .onAppear {
            loadTabs() // 画面が表示されたときに、タブのデータを読み込む（後で作ります）
        }
    }
```

| コード                     | 役割                                                                                                                        |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `VStack(spacing: 0)`       | 画面のパーツを縦に並べるためのコンテナです。`spacing: 0` と書くことで、パーツ同士の隙間をなくしてぴったりくっつけています。 |
| `if tabs.isEmpty`          | もし `tabs` という箱の中身が空っぽ（0個）だったら、「タブがありません」という特別な画面を表示します。                       |
| `ContentUnavailableView`   | データがないということを表示してくれる、iOSに最初から用意されている便利な部品です。                                         |
| `.onAppear { loadTabs() }` | 画面が表示された瞬間に1回だけ、中の処理（ここではタブの読み込み）を実行します。                                             |

## 3. タブを切り替えるボタン（ヘッダー）を作る

`else`（タブがある時）の中に、タブを選ぶためのヘッダーを追加します。

```swift
            } else {
                // 1. タブを切り替えるボタンの集まり
                TabHeaderView(
                    tabs: tabs.map { .init(id: $0.id, name: $0.name) }, // 必要なデータだけにして渡す
                    selectedTabId: $selectedTabId,
                    onManageTabs: {
                        // 管理ボタン（歯車マークなど）が押されたら、タブ管理画面へ移動する
                        navigationPath.append(NavigationItem(id: .tabManage))
                    }
                )
                .onChange(of: selectedTabId) { _, _ in
                    // 選ばれているタブが変わったら、そのタブのタスクを読み込み直す
                    loadTasks()
                }

                // 次に、この下にタスクのリストを追加します
            }
```

| コード             | 役割                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tabs.map { ... }` | `TabHeaderView` という部品が使いやすいように、データベースそのままのデータではなく、必要な情報（`id` と `name`）だけを抜き出して渡しています。                     |
| `$selectedTabId`   | 頭に `$` をつけることで、タブがタップされたときに変数も同時に変える指示をしています（これをバインディングと呼びます）。                                            |
| `.onChange`        | `selectedTabId` の中身が変わった瞬間をキャッチして、中の処理を実行してくれます。ここでは「別のタブが選ばれたから、タスクを読み込み直す」という指示を出しています。 |

## 4. タスクのリストを作る

`// 次に、この下にタスクのリストを追加します` の下の行に追加してください。

```swift
// 次に、この下にタスクのリストを追加します

// 2. タスクが並ぶリストの部分
if selectedTabId != nil && !tasks.isEmpty {
    // タブが選ばれていて、タスクも1つ以上あるならリストを表示
    CustomList(items: tasks, onDelete: nil) { task in
        ToDoListItem(
            title: task.title,           // タスクの名前
            isCompleted: task.isCompleted // 終わっているかどうか
        ) {
            // タップした時の処理（次のステップで作ります）
        }
    }
} else {
    // タスクが1つもない時は、空の画面を表示
    EmptyStateView(hasSelectedTab: selectedTabId != nil)
}
```

- **`if selectedTabId != nil && !tasks.isEmpty`**
  `&&` は「〜かつ〜である」という意味です。「タブがきちんと選ばれていて」、かつ「タスクが空ではない」という2つの条件が揃った時だけ、タスクのリストを表示します。

- **`CustomList` と `ToDoListItem`**
  前のステップで作ったリストの部品を使って、1つ1つのタスクを画面に表示しています。

## 5. タスクを読み込む仕組み（ロジック）を作る

`body` のブロックの外側に、データベースからタスクを取ってくる処理を追加します。
まずは、**「今選ばれているタブ」に入っているタスクだけ**を取ってくる関数です。

```swift
    // 選ばれているタブのタスクだけを取り出す処理
    private func loadTasks() {
        guard let tabId = selectedTabId else {
            // もし何もタブが選ばれていなければ、タスクの箱は空っぽにして処理をストップする
            tasks = []
            return
        }

        // 「このタブIDを持っているタスクだけ集める」という指示の条件を作る
        let descriptor = FetchDescriptor<ToDoTask>(
            predicate: #Predicate { $0.tabId == tabId }
        )
        // データベースから取ってきて、`tasks` の箱に入れる
        tasks = (try? modelContext.fetch(descriptor)) ?? []
    }
```

- **`guard let tabId = selectedTabId else { ... }`**
  「もし `selectedTabId` が空(nil)だったら、そこで処理を諦めてストップしてね」という安全確認の機能です。

- **`#Predicate { $0.tabId == tabId }`（条件の絞り込み）**
  すべてのタスクの中から、「自分が持っているタブのID（`$0.tabId`）」と「今選ばれているタブのID（`tabId`）」が同じものだけを見つけ出す、という条件です。

## 6. タブ一覧を読み込む仕組み（ロジック）を作る

すべてのタブを読み込む関数を追加します。
読み込んだ後に「一番最初のタブを自動で選ぶ」という機能も入れます。

```swift
    // すべてのタブを読み込んで、どれを選ぶかセットする処理
    private func loadTabs() {

        tabs = ToDoTabService.getAllTabs(from: modelContext) // ステップ11で作った仕組みを使って、全部のタブを取ってくる

        // 自動的にどれかのタブを選ぶための処理
        if let currentId = selectedTabId {

            if !tabs.contains(where: { $0.id == currentId }) { // もし今選ばれているタブが、なくなっていたら（消されたりして）

                selectedTabId = tabs.first?.id // 先頭のタブを選び直す
            }
        } else {

            selectedTabId = tabs.first?.id // アプリを開いたばかりで何も選ばれていないなら、先頭のタブを選ぶ
        }


        loadTasks() // タブが準備できたので、そのタブのタスクを読み込む
    }
```

---

### 🔄 タブの選択トラブルを防ぐ工夫

アプリを使っていると、「選んでいたタブがいつのまにか消されている（削除機能など）」ということが起こるかもしれません。そのままだとエラーになってしまうので、**「もし選んでいるタブが見つからなかったら、一番最初のタブを選び直す」** または **「初めて開いたら、自動で一番最初のタブを選ぶ」** という賢い仕組み（`selectedTabId = tabs.first?.id`）を入れています。

> [!NOTE]
> コードが書けたら、`Command + R` でアプリを実行して、タブを切り替えてタスクが正しく表示されるかを確認してみましょう！

---

## コード全体

<img src="/images/todolist/17.png" alt="HomeViewの完成イメージ" class="mobile-screenshot" />

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
}

#Preview {
    NavigationStack {
        HomeView(navigationPath: .constant([]))
            .modelContainer(for: [ToDoTab.self, ToDoTask.self], inMemory: true)
    }
}
```

## 練習問題

![完成イメージ](/images/todolist/p17.png)

このステップで学んだ **`FetchDescriptor` / `#Predicate` / `.onChange` / `guard let`** を使って、優先度別タスク表示アプリを作ってみましょう。

Xcodeで新規アプリ制作（App）を作成し（SwiftData対応・`Task` モデルに `priority: Int`（1～3）プロパティがある状態を想定）、`ContentView.swift` に以下を実装してください。

**要件:**

- 優先度フィルタ（高・中・低）のセグメントコントロール
- 選択した優先度のタスクのみ表示
- `.onChange` と `#Predicate` で条件フィルタリング
- タスクが空の場合は `ContentUnavailableView` 表示

### 解答例

```swift title="ContentView.swift"
import SwiftUI
import SwiftData

@Model
final class Task {
    var title: String
    var priority: Int // 1: 低, 2: 中, 3: 高
    var isCompleted: Bool

    init(title: String, priority: Int) {
        self.title = title
        self.priority = priority
        self.isCompleted = false
    }
}

struct ContentView: View {
    @Environment(\.modelContext) private var modelContext

    @State private var tasks: [Task] = []
    @State private var selectedPriority = 3 // デフォルトは「高」

    let priorityLabels = ["低", "中", "高"]

    var body: some View {
        NavigationStack {
            VStack {
                // フィルタセグメント
                Picker("優先度", selection: $selectedPriority) {
                    ForEach(1...3, id: \.self) { priority in
                        Text(priorityLabels[priority - 1]).tag(priority)
                    }
                }
                .pickerStyle(.segmented)
                .padding()
                .onChange(of: selectedPriority) { _, _ in
                    loadTasks()
                }

                // タスク一覧
                if tasks.isEmpty {
                    ContentUnavailableView("タスクがありません", systemImage: "checkmark.circle")
                } else {
                    List {
                        ForEach(tasks) { task in
                            Text(task.title)
                        }
                    }
                }
            }
            .navigationTitle("優先度別タスク")
            .onAppear { loadTasks() }
        }
    }

    private func loadTasks() {
        let descriptor = FetchDescriptor<Task>(
            predicate: #Predicate { $0.priority == selectedPriority }
        )
        tasks = (try? modelContext.fetch(descriptor)) ?? []
    }
}

#Preview {
    ContentView()
        .modelContainer(for: Task.self, inMemory: true)
}
```
