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

---

## コード全体

<img src="/images/todolist/17.png" alt="HomeViewの完成イメージ" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

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
