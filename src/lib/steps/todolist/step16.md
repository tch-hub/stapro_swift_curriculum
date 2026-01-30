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
