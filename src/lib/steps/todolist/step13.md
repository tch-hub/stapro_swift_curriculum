# ステップ13: タブ管理画面を作る

タブの追加や削除ができる画面を作成します。

### 1. 状態の準備

```swift
@State private var tabs: [ToDoTab] = []
@State private var newTabName = ""
@State private var showDeleteAlert = false
@State private var tabToDelete: ToDoTab?
```

- `tabs` は現在のタブ一覧です。
- `newTabName` は入力中のタブ名です。
- `showDeleteAlert` は削除確認の表示用です。

### 2. タブ一覧表示

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

### 3. 追加エリア

```swift
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
```

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
// TabManageView.swift
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
