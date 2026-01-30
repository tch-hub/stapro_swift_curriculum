<script>
    import {base} from '$app/paths';
</script>


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
