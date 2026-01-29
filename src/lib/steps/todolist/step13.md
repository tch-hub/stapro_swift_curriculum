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
    @Environment(\.dismiss) var dismiss
    @State private var tabs: [ToDoTab] = []
    @State private var showingAddTab = false
    @State private var newTabName = ""

    var body: some View {
        VStack {
            List {
                ForEach(tabs) { tab in
                    Text(tab.name)
                }
                .onDelete(perform: deleteTab)
            }

            HStack {
                Button(action: { showingAddTab = true }) {
                    Label("タブを追加", systemImage: "plus")
                }
                .padding()

                Button("戻る") {
                    dismiss()
                }
                .padding()
            }
        }
        .navigationTitle("タブ管理")
        .sheet(isPresented: $showingAddTab) {
            VStack {
                TextField("タブ名を入力", text: $newTabName)
                    .textFieldStyle(.roundedBorder)
                    .padding()

                HStack {
                    Button("キャンセル") {
                        showingAddTab = false
                        newTabName = ""
                    }

                    Button("追加") {
                        addTab()
                    }
                    .disabled(newTabName.isEmpty)
                }
                .padding()
            }
        }
        .onAppear {
            loadTabs()
        }
    }

    private func loadTabs() {
        let descriptor = FetchDescriptor<ToDoTab>()
        tabs = (try? modelContext.fetch(descriptor)) ?? []
    }

    private func addTab() {
        let newTab = ToDoTab(name: newTabName)
        ToDoTabService.addTab(newTab, to: modelContext)
        newTabName = ""
        showingAddTab = false
        loadTabs()
    }

    private func deleteTab(offsets: IndexSet) {
        for index in offsets {
            let tabToDelete = tabs[index]
            ToDoTabService.deleteTab(tabToDelete, from: modelContext)
        }
        loadTabs()
    }
}

#Preview {
    TabManageView()
}
```

## 各要素の説明

- `loadTabs()`: データベースからすべてのタブを読み込みます
- `addTab()`: 新しいタブを追加します
- `deleteTab()`: タブを削除します（関連するタスクも削除されます）
- `@Environment(\.dismiss)`: 前の画面に戻るために使用します

## 次のステップへ

次は、このビューをより整えて、エラーハンドリングを追加します。
