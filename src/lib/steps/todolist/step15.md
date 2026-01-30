# ステップ9: HomeView の作成（タスク表示のみ）

<script>
    import {base} from '$app/paths';
</script>

## HomeView.swift の作成

`Screens/Views/Main/`フォルダに`HomeView.swift`を作成します：

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
        VStack {
            // タブがない場合は案内のみ表示
            if tabs.isEmpty {
                Text("タブがありません")
                    .foregroundColor(.gray)
                    .padding()
            } else {
                // タブ選択
                Picker("タブを選択", selection: $selectedTabId) {
                    ForEach(tabs) { tab in
                        Text(tab.name).tag(Optional(tab.id))
                    }
                }
                .pickerStyle(.menu)
                .onChange(of: selectedTabId) { _, _ in
                    loadTasks()
                }

                // タブ管理へ移動
                Button(action: {
                    navigationPath.append(NavigationItem(id: .tabManage))
                }) {
                    Text("タブ管理")
                }
                .padding(.bottom, 8)

                // タスク一覧
                if !tasks.isEmpty {
                    List {
                        ForEach(tasks) { task in
                            Text(task.title)
                        }
                    }
                } else {
                    Text("タスクはまだありません")
                        .foregroundColor(.gray)
                        .padding()
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
        let descriptor = FetchDescriptor<ToDoTab>()
        tabs = (try? modelContext.fetch(descriptor)) ?? []
        if selectedTabId == nil {
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

## できるようになったこと

- タブを選択してタスク一覧を表示できる
- タスクが空の場合のメッセージを表示できる
- 「タブ管理」へ移動できる

## コードのポイント

- `Picker`でタブを切り替え、`loadTasks()`で一覧を更新します
- `List`でタスクのタイトルだけを表示します
- まずは「表示だけ」に絞り、機能追加は次のステップで行います

## 次のステップへ

次は、タスク一覧を見やすく整える（アイコンや完了表示）ステップに進みます。
