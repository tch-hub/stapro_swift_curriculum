# ステップ16: タブとタスクを表示する

ホーム画面でタブ選択とタスク表示を行います。

### 1. 状態の準備

```swift
// データベース操作用コンテキスト
@Environment(\.modelContext) private var modelContext
// 全タブのリスト
@State private var tabs: [ToDoTab] = []
// 現在選択されているタブ内のタスクリスト（ロードして更新）
@State private var tasks: [ToDoTask] = []
// 現在選択されているタブのID（初期状態は nil で未選択）
@State private var selectedTabId: UUID?
```

ホーム画面でデータを表示・管理するために必要な状態変数です。  
`tabs` と `tasks` はデータベースから読み込まれた配列を保持し、`selectedTabId` は現在ユーザーがどのタブ（カテゴリー）を見ているかを管理します。

### 2. タブの選択UI

```swift
// TabHeaderViewコンポーネントを使ってヘッダーを表示
TabHeaderView(
    tabs: tabs.map { .init(id: $0.id, name: $0.name) },
    selectedTabId: $selectedTabId,
    onManageTabs: {
        // タブ管理画面への遷移
        navigationPath.append(NavigationItem(id: .tabManage))
    }
)
// タブが変更されたらタスクを再読み込み
.onChange(of: selectedTabId) { _, _ in
    loadTasks()
}
```

ステップ6で作った `TabHeaderView` を配置します。  
`TabHeaderView` 側で `ToDoTab` を独自定義しているため、SwiftDataの `ToDoTab` をそのまま渡すと型が合わずにエラーになります。  
そのため、`tabs` は `id` と `name` だけを使って `TabHeaderView.ToDoTab` に変換して渡します。  
`.onChange` をつけることで、ヘッダー内でタブが切り替えられたタイミングを検知し、`loadTasks()` を実行して表示を更新します。

### 3. タスク一覧と空状態

```swift
if selectedTabId != nil && !tasks.isEmpty {
    // 1. タブが選択され、かつタスクがある場合：リストを表示
    CustomList(items: tasks) { task in
        ToDoListItem(
            title: task.title,
            isCompleted: task.isCompleted
        ) {
            // 完了切り替えは次のステップで実装します
        }
    }
} else {
    // 2. それ以外の場合：EmptyStateViewを表示
    // タブが選択されているかどうかを渡して、表示内容（タスクなし or タブ未選択）を切り替え
    EmptyStateView(hasSelectedTab: selectedTabId != nil)
}
```

リスト部分の条件分岐です。タスクがある場合はリストを表示し、それ以外の場合はステップ4で作った `EmptyStateView` を利用して「タスクなし」または「タブ未選択」の画面を表示します。

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
// HomeView.swift
import SwiftUI
import SwiftData

struct HomeView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var tabs: [ToDoTab] = []
    @State private var tasks: [ToDoTask] = []
    @State private var selectedTabId: UUID?
    @Binding var navigationPath: [NavigationItem]

    var body: some View {
        VStack {
            if tabs.isEmpty {
                Text("タブがありません")
                    .padding()
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
                    CustomList(items: tasks) { task in
                        ToDoListItem(
                            title: task.title,
                            isCompleted: task.isCompleted
                        ) {
                            // 完了切り替えは次のステップで実装します
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
            loadTasks()
        }
    }

    private func loadTabs() {
        let descriptor = FetchDescriptor<ToDoTab>()
        tabs = (try? modelContext.fetch(descriptor)) ?? []
        if let selectedTabId = selectedTabId {
            // 現在の選択が削除済みの場合は先頭タブに戻す
            if !tabs.contains(where: { $0.id == selectedTabId }) {
                self.selectedTabId = tabs.first?.id
            }
        } else {
            selectedTabId = tabs.first?.id
        }
        loadTasks()
    }

    private func loadTasks() {
        guard let selectedTabId = selectedTabId else {
            tasks = []
            return
        }

        let descriptor = FetchDescriptor<ToDoTask>(
            predicate: #Predicate { $0.tabId == selectedTabId }
        )
        tasks = (try? modelContext.fetch(descriptor)) ?? []
    }

}
```
