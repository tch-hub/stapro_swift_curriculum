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
// ドロップダウンメニューのようなピッカーを表示
Picker("タブを選択", selection: $selectedTabId) {
    // タブの数だけ選択肢を作成
    ForEach(tabs) { tab in
        // タグ付けすることで、選択された時に selectedTabId に tab.id が入る
        Text(tab.name).tag(Optional(tab.id))
    }
}
.pickerStyle(.menu) // メニュースタイル（ポップアップボタンのような見た目）
.onChange(of: selectedTabId) { _, _ in
    // タブが変更されたら、そのタブのタスクを再読み込みする
    loadTasks()
}
```
  

SwiftUIの `Picker` を使ってタブ切り替え機能を作っています。`.onChange(of: selectedTabId)` を使うことで、ユーザーがタブを変更するたびに `loadTasks()` が呼び出され、表示されるタスク一覧が更新される仕組みです。

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
} else if selectedTabId != nil {
    // 2. タブは選択されているが、タスクがない場合：空っぽ表示
    VStack {
        Image(systemName: "checkmark.circle")
            .font(.system(size: 48))
            .foregroundColor(.gray)
        Text("タスクはまだありません")
            .foregroundColor(.gray)
            .padding(.top, 8)
    }
} else {
    // 3. タブがまだ選択されていない場合（初期状態など）
    VStack {
        Image(systemName: "list.bullet")
            .font(.system(size: 48))
            .foregroundColor(.gray)
        Text("タブを選択してください")
            .foregroundColor(.gray)
            .padding(.top, 8)
    }
}
```
  

画面の状態に応じて3パターンの表示を切り替えています。タスクがある場合はリストを表示し、データがない場合やタブ未選択の場合は、それぞれユーザーに状況を伝えるためのアイコンとテキストを表示しています。

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
                HStack(spacing: 12) {
                    Picker("タブを選択", selection: $selectedTabId) {
                        ForEach(tabs) { tab in
                            Text(tab.name).tag(Optional(tab.id))
                        }
                    }
                    .pickerStyle(.menu)
                    .onChange(of: selectedTabId) { _, _ in
                        loadTasks()
                    }

                    Button(action: {
                        navigationPath.append(NavigationItem(id: .tabManage))
                    }) {
                        Text("タブ管理")
                    }
                }
                .padding(.bottom, 8)

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
                    emptyStateView
                }
            }

        }
        .navigationTitle("ToDoリスト")
        .onAppear {
            loadTabs()
            loadTasks()
        }
    }

    @ViewBuilder
    private var emptyStateView: some View {
        if selectedTabId != nil {
            VStack {
                Image(systemName: "checkmark.circle")
                    .font(.system(size: 48))
                    .foregroundColor(.gray)
                Text("タスクはまだありません")
                    .foregroundColor(.gray)
                    .padding(.top, 8)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        } else {
            VStack {
                Image(systemName: "list.bullet")
                    .font(.system(size: 48))
                    .foregroundColor(.gray)
                Text("タブを選択してください")
                    .foregroundColor(.gray)
                    .padding(.top, 8)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
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
