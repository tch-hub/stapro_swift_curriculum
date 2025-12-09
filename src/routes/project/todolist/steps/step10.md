# ステップ10: タスク一覧の表示

<script>
    import {base} from '$app/paths';
</script>

## HomeView.swift の修正

前のステップで作成した`HomeView`を以下のように修正します：

```swift
import SwiftUI
import SwiftData

struct HomeView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var tabs: [ToDoTab] = []
    @State private var tasks: [ToDoTask] = []
    @State private var selectedTabId: UUID?
    @Binding var navigationPath: [NavigationItem]

    var filteredTasks: [ToDoTask] {
        tasks.filter { $0.tabId == selectedTabId }
    }

    var body: some View {
        VStack {
            if !tabs.isEmpty {
                Picker("タブを選択", selection: $selectedTabId) {
                    ForEach(tabs) { tab in
                        Text(tab.name).tag(Optional(tab.id))
                    }
                }
                .pickerStyle(.menu)
                .onChange(of: selectedTabId) { _, _ in
                    loadTasks()
                }
            }

            List {
                ForEach(filteredTasks) { task in
                    HStack {
                        Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                        Text(task.title)
                            .strikethrough(task.isCompleted)
                    }
                }
            }

            HStack {
                Button(action: {
                    navigationPath.append(NavigationItem(id: .tabManage))
                }) {
                    Text("タブ管理")
                }
                .padding()
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
        selectedTabId = tabs.first?.id
    }

    private func loadTasks() {
        let descriptor = FetchDescriptor<ToDoTask>()
        tasks = (try? modelContext.fetch(descriptor)) ?? []
    }
}
```

## 新しい要素

- `filteredTasks`: 選択されたタブに属するタスクのみをフィルタリングします
- `List`: タスクを一覧表示するUIコンポーネントです
- `onChange`: タブが変更されたときに自動的にタスク一覧を更新します
- `strikethrough`: 完了したタスクに取り消し線を表示します

## チェックボックスの表示

- 完了していないタスク: `circle`（空の円）
- 完了したタスク: `checkmark.circle.fill`（チェック付き円）

## 次のステップへ

次は、新しいタスクを追加する機能を実装します。
