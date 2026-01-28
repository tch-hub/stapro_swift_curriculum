# ステップ11: タスク追加機能の実装

<script>
    import {base} from '$app/paths';
</script>

## HomeView.swift の修正

タスクを追加するための入力フォームと「+」ボタンを追加します：

```swift
import SwiftUI
import SwiftData

struct HomeView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var tabs: [ToDoTab] = []
    @State private var tasks: [ToDoTask] = []
    @State private var selectedTabId: UUID?
    @State private var showingAddTask = false
    @State private var newTaskTitle = ""
    @Binding var navigationPath: [NavigationItem]
    @FocusState private var isInputFocused: Bool

    var filteredTasks: [ToDoTask] {
        guard let selectedTabId else { return [] }
        return tasks.filter { $0.tabId == selectedTabId }
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
                    newTaskTitle = ""
                    showingAddTask = true
                    isInputFocused = true
                }) {
                    Label("追加", systemImage: "plus")
                }
                .padding()

                Button(action: {
                    navigationPath.append(NavigationItem(id: .tabManage))
                }) {
                    Text("タブ管理")
                }
                .padding()
            }
        }
        .navigationTitle("ToDoリスト")
        .sheet(isPresented: $showingAddTask) {
            NavigationStack {
                VStack {
                    TextField("タスクを入力", text: $newTaskTitle)
                        .textFieldStyle(.roundedBorder)
                        .padding()
                        .focused($isInputFocused)

                    HStack {
                        Spacer()
                        
                        Button("キャンセル") {
                            showingAddTask = false
                            newTaskTitle = ""
                        }

                        Button("追加") {
                            if !newTaskTitle.isEmpty {
                                addTask()
                            }
                        }
                        .disabled(newTaskTitle.isEmpty)
                    }
                    .padding()

                    Spacer()
                }
                .navigationTitle("タスク追加")
                .navigationBarTitleDisplayMode(.inline)
            }
        }
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

    private func addTask() {
        guard let tabId = selectedTabId else { return }
        let newTask = ToDoTask(title: newTaskTitle, detail: "", tabId: tabId)
        ToDoTaskService.addTask(newTask, to: modelContext)
        
        // 追加後、タスク一覧を再読み込み
        loadTasks()
        
        // モーダルを閉じる
        showingAddTask = false
        newTaskTitle = ""
    }
}
```

## 新しい要素

- `@State private var showingAddTask`: モーダル表示の状態を管理します
- `@State private var newTaskTitle`: 入力されたタスクのタイトルを保持します
- `.sheet()`: モーダルダイアログを表示します
- `addTask()`: 新しいタスクをデータベースに保存します

## 次のステップへ

次は、タスクの完了状態を切り替える機能を実装します。
