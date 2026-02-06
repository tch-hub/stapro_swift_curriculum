# ステップ17: タブとタスクを表示する(HomeView.swift)

## 1. 状態変数の準備

`Views/HomeView.swift` を開き、データを管理するための変数を追加します。

```swift
import SwiftUI
import SwiftData

struct HomeView: View {
    @Environment(\.modelContext) private var modelContext

    // データ管理用の状態変数
    @State private var tabs: [ToDoTab] = []         // 全タブのリスト
    @State private var tasks: [ToDoTask] = []       // 選択中のタブのタスクリスト
    @State private var selectedTabId: UUID?         // 選択中のタブID

    @Binding var navigationPath: [NavigationItem]   // 親から受け取る遷移パス

    // ... body部分の実装へ
}
```

**状態変数の役割:**

- **`@Environment(\.modelContext) private var modelContext`**
  SwiftDataのデータベースにアクセスするためのコンテキストです。アプリ全体で共有されているものを受け取ります。

- **`@State private var tabs: [ToDoTab] = []`**
  データベースから取得した全タブのリストを保持します。この配列が変更されると、UIが自動的に更新されます。

- **`@State private var tasks: [ToDoTask] = []`**
  現在選択されているタブに属するタスクのリストです。タブを切り替えるたびに、この配列の中身が入れ替わります。

- **`@State private var selectedTabId: UUID?`**
  どのタブが選択されているかを追跡します。`UUID?`（オプショナル型）なのは、初期状態では何も選択されていない可能性があるためです。

- **`@Binding var navigationPath: [NavigationItem]`**
  親（MainStack）から受け取った画面遷移の履歴です。タブ管理画面への遷移時に、この配列に要素を追加します。

**データの流れ:**

1. `loadTabs()` で全タブを取得 → `tabs` に格納
2. 最初のタブを自動選択 → `selectedTabId` に設定
3. `selectedTabId` の変更を検知 → `loadTasks()` が実行される
4. 選択されたタブのタスクを取得 → `tasks` に格納
5. `tasks` の変更でUIが更新される

## 2. UIの実装: レイアウトの枠組み

`body` の中身を実装します。
まずは全体の枠組みと、タブが1つもない場合（アプリ初期化前など）の表示を作ります。

```swift
    var body: some View {
        VStack(spacing: 0) {
            if tabs.isEmpty {
                // データが全くない場合の表示（iOS 17以降で使える標準コンポーネント）
                ContentUnavailableView("タブがありません", systemImage: "tray")
            } else {
                // ここにヘッダーとリストを追加していきます
            }
        }
        .navigationTitle("ToDoリスト")
        // 画面が表示された時にデータを読み込む
        .onAppear {
            loadTabs()
        }
    }
```

**UIレイアウトの仕組み:**

- **`VStack(spacing: 0)`**
  縦方向にビューを並べるコンテナです。`spacing: 0` で要素間の余白をなくしています。

- **`if tabs.isEmpty`**
  タブが1つもない場合の条件分岐です。アプリ初期化前や、全タブを削除した場合に該当します。

- **`ContentUnavailableView`（iOS 17以降）**
  「データがない」状態を表示するための標準コンポーネントです。アイコンとメッセージを自動的にレイアウトしてくれます。
  - 第1引数: 表示するメッセージ
  - `systemImage`: SF Symbolsのアイコン名

- **`.onAppear { loadTabs() }`**
  ビューが画面に表示された時に1度だけ実行されます。ここでデータベースからタブ一覧を読み込みます。

  **重要:** `.onAppear` はビューのライフサイクルの一部で、画面が表示されるたびに呼ばれます。ただし、同じビューが表示され続けている間は再実行されません。

## 3. UIの実装: タブヘッダー

`else` ブロックの中に、タブを選択するためのヘッダーを追加します。

```swift
            } else {
                // 1. タブ選択ヘッダー
                TabHeaderView(
                    tabs: tabs.map { .init(id: $0.id, name: $0.name) }, // データ型を変換して渡す
                    selectedTabId: $selectedTabId,
                    onManageTabs: {
                        // 管理ボタンが押されたら画面遷移
                        navigationPath.append(NavigationItem(id: .tabManage))
                    }
                )
                // タブが変わったらタスクを再読み込み
                .onChange(of: selectedTabId) { _, _ in
                    loadTasks()
                }

                // 次にリスト部分を追加します
            }
```

- `tabs.map { ... }`: `TabHeaderView` が期待しているデータ型に合わせて、変換を行っています。

**タブヘッダーの仕組み:**

- **`tabs.map { .init(id: $0.id, name: $0.name) }`**
  `tabs` 配列（`[ToDoTab]`型）を、`TabHeaderView` が期待する型に変換しています。
  - `map` は配列の各要素を変換する関数
  - `.init(id: $0.id, name: $0.name)` で新しい構造体を作成
  - `$0` は現在処理中の要素（`ToDoTab`）を指す

  **なぜ変換が必要？** `TabHeaderView` は汎用的なコンポーネントなので、SwiftDataの `ToDoTab` に直接依存しないよう設計されています。

- **`selectedTabId: $selectedTabId`**
  `$` をつけることで、Bindingとして渡します。これにより、`TabHeaderView` 内でタブが選択されると、この `selectedTabId` が自動的に更新されます（双方向バインディング）。

- **`onManageTabs: { ... }`**
  タブ管理ボタンが押された時の処理です。クロージャ（無名関数）で定義しています。
  - `navigationPath.append(...)` で画面遷移の履歴に新しい画面を追加
  - `NavigationItem(id: .tabManage)` でタブ管理画面を指定

- **`.onChange(of: selectedTabId) { _, _ in loadTasks() }`**
  `selectedTabId` の値が変わった時に自動的に実行される処理です。
  - 第1引数 `_`: 変更前の値（今回は使わないので `_` で無視）
  - 第2引数 `_`: 変更後の値（今回は使わないので `_` で無視）
  - タブが切り替わったら、そのタブのタスクを読み込み直します

**データの流れ:**

1. ユーザーがタブをタップ
2. `TabHeaderView` 内で `selectedTabId` が更新される
3. Bindingにより、HomeViewの `selectedTabId` も更新される
4. `.onChange` が検知して `loadTasks()` を実行
5. 新しいタブのタスクが `tasks` に格納される
6. UIが自動的に更新される

## 4. UIの実装: タスクリスト

ヘッダーの下に、メインとなるタスクリスト（または空の状態）を表示するコードを追加します。

```swift
                // 2. メインコンテンツエリア
                if selectedTabId != nil && !tasks.isEmpty {
                    // タスクがある場合：リストを表示
                    CustomList(items: tasks, onDelete: nil) { task in
                        ToDoListItem(
                            title: task.title,
                            isCompleted: task.isCompleted
                        ) {
                            // 完了切り替え（次のステップで実装）
                        }
                    }
                } else {
                    // タスクがない場合 or タブ未選択の場合
                    EmptyStateView(hasSelectedTab: selectedTabId != nil)
                }
```

**タスクリスト表示の仕組み:**

- **`if selectedTabId != nil && !tasks.isEmpty`**
  2つの条件を両方満たす場合にタスクリストを表示します:
  1. `selectedTabId != nil`: タブが選択されている
  2. `!tasks.isEmpty`: タスクが1つ以上ある

  `&&` は「かつ」を意味する論理演算子です。

- **`CustomList(items: tasks, onDelete: nil) { task in ... }`**
  以前作成した汎用リストコンポーネントを使用しています。
  - `items: tasks`: 表示するデータ
  - `onDelete: nil`: 削除機能は今回使わない（次のステップで実装）
  - `{ task in ... }`: 各タスクをどう表示するかを定義するクロージャ

- **`ToDoListItem(...)`**
  各タスクを表示するための行コンポーネントです。
  - `title: task.title`: タスクのタイトル
  - `isCompleted: task.isCompleted`: 完了状態
  - `{ }`: タップ時の処理（次のステップで実装予定）

- **`else { EmptyStateView(...) }`**
  タスクがない、またはタブが未選択の場合に表示します。
  - `hasSelectedTab: selectedTabId != nil` で、「タブは選択されているがタスクがない」のか「タブ自体が未選択」なのかを判別し、適切なメッセージを表示します。

## 5. ロジックの実装: タスク読み込み

`body` の外に、データを読み込むプライベートメソッドを追加します。
まずは、**選択中のタブに対応するタスク**だけを読み込む関数を作ります。

```swift
    // 選択中のタブIDを使って、タスクをデータベースから取得
    private func loadTasks() {
        guard let tabId = selectedTabId else {
            // タブが選択されていなければ、タスクは空
            tasks = []
            return
        }

        // 条件：tabIdが一致するタスクだけを取得
        let descriptor = FetchDescriptor<ToDoTask>(
            predicate: #Predicate { $0.tabId == tabId }
        )
        // 取得実行（失敗したら空配列）
        tasks = (try? modelContext.fetch(descriptor)) ?? []
    }
```

**タスク読み込みの仕組み:**

- **`guard let tabId = selectedTabId else { ... }`**
  `guard` 文は「条件を満たさない場合に早期リターン」するための構文です。
  - `selectedTabId` がnilの場合（タブ未選択）、`tasks = []` で空にして関数を終了
  - nilでない場合、`tabId` に値を取り出して処理を続行

  **`if let` との違い:** `guard let` は「正常な場合に処理を続ける」ことを明示し、コードの可読性が向上します。

- **`FetchDescriptor<ToDoTask>(predicate: #Predicate { $0.tabId == tabId })`**
  データベースから特定の条件に合うタスクだけを取得します。
  - `#Predicate { ... }`: 条件式を定義するマクロ
  - `$0.tabId == tabId`: 「タスクの `tabId` が、選択中のタブIDと一致する」という条件
  - これにより、選択中のタブに属するタスクだけが取得されます

- **`(try? modelContext.fetch(descriptor)) ?? []`**
  エラーハンドリング付きのデータ取得です。
  - `try?`: エラーが発生した場合、nilを返す
  - `?? []`: nilの場合は空配列を返す
  - 結果として、エラー時でもアプリがクラッシュせず、空のリストが表示されます

**処理の流れ:**

1. タブが選択されているかチェック
2. 選択されていなければ空配列を設定して終了
3. 選択されていれば、そのタブIDでフィルタリング
4. データベースから該当タスクを取得
5. `tasks` に格納してUIを更新

## 6. ロジックの実装: タブ一覧読み込み

全てのタブを読み込む関数を追加します。
読み込んだ後、どのタブを選択状態にするかの自動調整も行います。

```swift
    // 全てのタブを読み込む
    private func loadTabs() {
        // ステップ11で作ったServiceを使って全件取得
        tabs = ToDoTabService.getAllTabs(from: modelContext)

        // 選択状態の自動調整
        if let currentId = selectedTabId {
            // もし選択中のIDがリストの中に無かったら（削除された場合など）
            if !tabs.contains(where: { $0.id == currentId }) {
                // 先頭のタブを選択し直す
                selectedTabId = tabs.first?.id
            }
        } else {
            // 未選択（初回起動時など）なら、先頭のタブを選択
            selectedTabId = tabs.first?.id
        }

        // タブ一覧の更新に合わせて、タスクも再読み込み
        loadTasks()
    }
```

**タブ一覧読み込みと選択状態管理:**

- **`tabs = ToDoTabService.getAllTabs(from: modelContext)`**
  ステップ11で作成したサービスメソッドを使って、全タブを取得します。

- **選択状態の自動調整ロジック**

  ```swift
  if let currentId = selectedTabId {
      if !tabs.contains(where: { $0.id == currentId }) {
          selectedTabId = tabs.first?.id
      }
  } else {
      selectedTabId = tabs.first?.id
  }
  ```

  **2つのケースを処理:**
  1. **既に何かタブが選択されている場合（`if let currentId = selectedTabId`）**
     - `tabs.contains(where: { $0.id == currentId })`: 選択中のタブIDが、取得したタブリストに含まれているかチェック
     - 含まれていない場合（タブが削除された場合など）、先頭のタブを選択し直す
     - これにより、「存在しないタブが選択されている」という不整合を防ぎます
  2. **何も選択されていない場合（`else`）**
     - 初回起動時やタブが全削除された後の状態
     - 先頭のタブを自動選択します

- **`tabs.first?.id`**
  - `first`: 配列の最初の要素を取得（配列が空ならnil）
  - `?.id`: オプショナルチェイニング。firstがnilでなければidを取得
  - 結果として、タブがあれば最初のタブのID、なければnilが設定されます

- **`loadTasks()`**
  タブ一覧の更新に合わせて、選択中のタブのタスクも再読み込みします。これにより、データの整合性が保たれます。

**処理の流れ:**

1. データベースから全タブを取得
2. 現在選択中のタブが存在するかチェック
3. 存在しなければ先頭のタブを選択
4. 未選択なら先頭のタブを選択
5. タスクを再読み込み
6. UIが自動的に更新される

---

## コード全体

<img src="/images/todolist/17.png" alt="HomeViewの完成イメージ" class="mobile-screenshot" />

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
                // タブ自体がない場合（初期化前など）
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
                            // TODO: 完了状態の切り替え
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
}

#Preview {
    NavigationStack {
        HomeView(navigationPath: .constant([]))
            .modelContainer(for: [ToDoTab.self, ToDoTask.self], inMemory: true)
    }
}
```
