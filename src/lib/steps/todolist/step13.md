# ステップ14: TabManageView の作成（基本構造）

<script>
    import {base} from '$app/paths';
</script>

## TabManageView.swift の作成

`Screens/Views/Main/`フォルダに`TabManageView.swift`を作成します：

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
            VStack {
                // 既存のタブリストをCustomListで表示
                CustomList(items: tabs, onDelete: handleDelete) { tab in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(tab.name)
                            .font(.headline)
                        Text("作成日: \(tab.createdAt.formatted(date: .abbreviated, time: .omitted))")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                }
            }
            .navigationTitle("タブ管理")
            .onAppear {
                loadTabs()
            }
            // 削除確認アラート
            .deleteAlert(
                isPresented: $showDeleteAlert,
                title: "タブの削除",
                message: "このタブを削除すると、関連するすべてのタスクも削除されます。",
                deleteText: "削除",
                cancelText: "キャンセル",
                onDelete: confirmDelete
            )
        }
        .safeAreaInset(edge: .bottom) {
            // 画面下部でタブを追加
            HStack(spacing: 12) {
                TextField("新しいタブ", text: $newTabName)
                    .textFieldStyle(.roundedBorder)
                    .submitLabel(.done)
                    .onSubmit {
                        addTab()
                    }

                Button("追加") {
                    addTab()
                }
                .buttonStyle(.borderedProminent)
                .disabled(newTabName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(.ultraThinMaterial)
        }
    }

    // MARK: - Private Methods

    private func loadTabs() {
        let descriptor = FetchDescriptor<ToDoTab>()
        tabs = (try? modelContext.fetch(descriptor)) ?? []
    }

    private func addTab() {
        guard !newTabName.isEmpty else { return }

        let newTab = ToDoTab(name: newTabName)
        ToDoTabService.addTab(newTab, to: modelContext)

        newTabName = ""
        loadTabs()
    }

    private func handleDelete(offsets: IndexSet) {
        // スワイプで削除された場合、確認アラートを表示
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
    struct PreviewWrapper: View {
        // モックデータ用のモデルコンテキストを作成
        var body: some View {
            NavigationStack {
                TabManageView()
                    .modelContainer(
                        try! ModelContainer(
                            for: ToDoTab.self,
                            configurations: ModelConfiguration(isStoredInMemoryOnly: true)
                        )
                    )
            }
        }
    }

    return PreviewWrapper()
}
```

### プレビューについて

このプレビューでは、以下のことができます：

- **タブの表示**: 初期状態でデータベースにあるタブを表示
- **タブの追加**: 画面下部の入力欄でタブ名を入力して追加できます
- **タブの削除**: リスト行をスワイプすると削除アラートが表示され、確認後にタブが削除されます
- **リアルタイム更新**: タブ追加・削除後、自動的にリストが更新されます

> **注意**: プレビューは`isStoredInMemoryOnly: true`でメモリのみに保存されるため、プレビューを再開するとデータはリセットされます。

## 各要素の説明

### 使用コンポーネント

#### 1. **CustomList** (Step 3)

- `items`: タブのリスト
- `onDelete`: スワイプで削除された時の処理
- `rowContent`: タブ情報を表示する行コンテンツ

```swift
CustomList(items: tabs, onDelete: handleDelete) { tab in
    VStack(alignment: .leading, spacing: 4) {
        Text(tab.name)
            .font(.headline)
        Text("作成日: \(tab.createdAt.formatted(date: .abbreviated, time: .omitted))")
            .font(.caption)
            .foregroundColor(.gray)
    }
}
```

#### 2. **画面下部の追加エリア**

- 画面下部の入力欄から直接タブを追加
- Enterで追加できる
- 入力が空の場合は追加ボタンが無効化される

```swift
.safeAreaInset(edge: .bottom) {
    HStack(spacing: 12) {
        TextField("新しいタブ", text: $newTabName)
            .textFieldStyle(.roundedBorder)
            .submitLabel(.done)
            .onSubmit { addTab() }

        Button("追加") { addTab() }
            .buttonStyle(.borderedProminent)
            .disabled(newTabName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 12)
    .background(.ultraThinMaterial)
}
```

#### 3. **deleteAlert Modifier** (Step 4)

- 削除確認用アラート
- タップで削除ボタンをタップした場合に表示
- タブ削除時に関連するすべてのタスクも削除されることをユーザーに通知

```swift
.deleteAlert(
    isPresented: $showDeleteAlert,
    title: "タブの削除",
    message: "このタブを削除すると、関連するすべてのタスクも削除されます。",
    deleteText: "削除",
    cancelText: "キャンセル",
    onDelete: confirmDelete
)
```

#### 4. **FloatingButton** (Step 5)

- 今回は使用しません

### メソッドの説明

| メソッド          | 説明                               |
| ----------------- | ---------------------------------- |
| `loadTabs()`      | SwiftDataからすべてのタブを取得    |
| `addTab()`        | 新しいタブを追加                   |
| `handleDelete()`  | スワイプ削除時に確認アラートを表示 |
| `confirmDelete()` | ユーザーの確認後、タブを実際に削除 |

### 状態管理

| State変数         | 説明                                 |
| ----------------- | ------------------------------------ |
| `tabs`            | 現在のタブリスト                     |
| `newTabName`      | タブ追加時の入力フィールド           |
| `showDeleteAlert` | 削除確認アラートの表示/非表示        |
| `tabToDelete`     | 削除予定のタブ（確認後に実際に削除） |

## 次のステップへ

次は、このビューをより整えて、エラーハンドリングを追加します。
