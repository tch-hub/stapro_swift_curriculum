# ステップ17: 完了切り替えを実装する

タスクをタップした時に完了/未完了を切り替えます。

### 1. 切り替え処理を追加

```swift
private func toggleTaskCompletion(_ task: ToDoTask) {
    ToDoTaskService.toggleTaskCompletion(task, modelContext: modelContext)
    loadTasks()
}
```

### 2. ToDoListItem に処理を渡す

```swift
ToDoListItem(
    title: task.title,
    isCompleted: task.isCompleted
) {
    toggleTaskCompletion(task)
}
```

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
        ZStack {
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
                            Label("タブ管理", systemImage: "folder")
                        }
                    }
                    .padding(.bottom, 8)

                    if selectedTabId != nil && !tasks.isEmpty {
                        CustomList(items: tasks) { task in
                            ToDoListItem(
                                title: task.title,
                                isCompleted: task.isCompleted
                            ) {
                                toggleTaskCompletion(task)
                            }
                        }
                    } else if selectedTabId != nil {
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

            }
            .padding()
            .navigationTitle("ToDoリスト")
            .onAppear {
                loadTabs()
            }
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

    private func toggleTaskCompletion(_ task: ToDoTask) {
        ToDoTaskService.toggleTaskCompletion(task, modelContext: modelContext)
        loadTasks()
    }
}
```
