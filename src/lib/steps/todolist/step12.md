# ステップ12: タブ管理画面を作る(TabManageView.swift)

## 1. 基本的な構造とデータ管理

`Views/TabmanageView.swift` を開き、基本的な構造を作ります。
SwiftDataを使うための `@Environment` と、画面の状態を管理する変数を定義します。

```swift
import SwiftUI
import SwiftData

struct TabManageView: View {
    // データベース接続
    @Environment(\.modelContext) private var modelContext

    // 状態変数
    @State private var tabs: [ToDoTab] = []         // タブ一覧
    @State private var newTabName = ""              // 入力中のタブ名
    @State private var showDeleteAlert = false      // 削除アラート表示フラグ
    @State private var tabToDelete: ToDoTab?        // 削除対象のタブ

    var body: some View {
        // レイアウトの実装をここに書きます
        Text("Tab Manager")
    }
}
```

## 2. UIの実装: タブ一覧と入力エリア

`body` の中身を実装します。
これまでに作った `CustomList` と `InputView` を組み合わせて画面を作ります。

```swift
    var body: some View {
        ZStack {
            // ①タブ一覧リスト
            CustomList(items: tabs, onDelete: handleDelete) { tab in
                VStack(alignment: .leading, spacing: 4) {
                    Text(tab.name)
                        .font(.headline)
                    Text("作成日: \(tab.createdAt.formatted(date: .abbreviated, time: .omitted))")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            .navigationTitle("タブ管理")
            .onAppear { loadTabs() } // 表示時にデータを読み込む

            // 削除確認アラート
            .alert("タブの削除", isPresented: $showDeleteAlert) {
                Button("削除", role: .destructive) { confirmDelete() }
                Button("キャンセル", role: .cancel) {}
            } message: {
                Text("このタブを削除すると、関連するすべてのタスクも削除されます。")
            }
        }
        // ②下部のタブ追加エリア
        .safeAreaInset(edge: .bottom) {
            InputView(
                text: $newTabName,
                placeholder: "新しいタブ",
                buttonIcon: "plus.circle.fill"
            ) {
                addTab()
            }
        }
    }
```

## 3. ロジックの実装

画面の下部（`body` の外）に、データの読み込み・追加・削除を行うメソッドを追加します。

```swift
    // データベースからタブ一覧を読み込む
    private func loadTabs() {
        tabs = ToDoTabService.getAllTabs(from: modelContext)
    }

    // 新しいタブを追加する
    private func addTab() {
        guard !newTabName.isEmpty else { return }

        let newTab = ToDoTab(name: newTabName)
        ToDoTabService.addTab(newTab, to: modelContext)

        newTabName = "" // 入力欄をクリア
        loadTabs()      // 一覧を更新
    }
```

続けて、削除関連のメソッドも追加します。

```swift
    // スワイプ削除時の処理（確認アラートを出す）
    private func handleDelete(offsets: IndexSet) {
        if let index = offsets.first {
            tabToDelete = tabs[index]
            showDeleteAlert = true
        }
    }

    // 削除を確定する
    private func confirmDelete() {
        if let tabToDelete = tabToDelete {
            ToDoTabService.deleteTab(tabToDelete, from: modelContext)
            loadTabs()
        }
    }
```

## 4. プレビューの作成

動作確認用のプレビューを追加します。メモリ内データベース (`isStoredInMemoryOnly: true`) を使用します。

```swift
#Preview {
    NavigationStack {
        TabManageView()
            .modelContainer(for: ToDoTab.self, inMemory: true)
    }
}
```

---

## コード全体

<img src="/images/todolist/TabManageView.png" alt="タブ管理画面の完成イメージ" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

### Views/TabmanageView.swift

```swift
import SwiftUI
import SwiftData

struct TabManageView: View {
    @Environment(\.modelContext) private var modelContext

    @State private var tabs: [ToDoTab] = []
    @State private var newTabName = ""
    @State private var showDeleteAlert = false
    @State private var tabToDelete: ToDoTab?

    var body: some View {
        ZStack {
            // MARK: - タブ一覧
            CustomList(items: tabs, onDelete: handleDelete) { tab in
                VStack(alignment: .leading, spacing: 4) {
                    Text(tab.name)
                        .font(.headline)
                    Text("作成日: \(tab.createdAt.formatted(date: .abbreviated, time: .omitted))")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            .navigationTitle("タブ管理")
            .onAppear { loadTabs() }
            .alert("タブの削除", isPresented: $showDeleteAlert) {
                Button("削除", role: .destructive) { confirmDelete() }
                Button("キャンセル", role: .cancel) {}
            } message: {
                Text("このタブを削除すると、関連するすべてのタスクも削除されます。")
            }
        }
        // MARK: - タブ追加エリア
        .safeAreaInset(edge: .bottom) {
            InputView(
                text: $newTabName,
                placeholder: "新しいタブ",
                buttonIcon: "plus.circle.fill"
            ) {
                addTab()
            }
        }
    }

    // MARK: - Private Methods
    private func loadTabs() {
        tabs = ToDoTabService.getAllTabs(from: modelContext)
    }

    private func addTab() {
        guard !newTabName.isEmpty else { return }
        let newTab = ToDoTab(name: newTabName)
        ToDoTabService.addTab(newTab, to: modelContext)
        newTabName = ""
        loadTabs()
    }

    private func handleDelete(offsets: IndexSet) {
        if let index = offsets.first {
            tabToDelete = tabs[index]
            showDeleteAlert = true
        }
    }

    private func confirmDelete() {
        if let tabToDelete = tabToDelete {
            ToDoTabService.deleteTab(tabToDelete, from: modelContext)
            loadTabs()
        }
    }
}

#Preview {
    NavigationStack {
        TabManageView()
            .modelContainer(for: ToDoTab.self, inMemory: true)
    }
}
```
