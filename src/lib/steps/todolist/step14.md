# ステップ9: HomeView の作成（タブ選択）

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
    @State private var showingAddTask = false
    @State private var newTaskTitle = ""
    @Binding var navigationPath: [NavigationItem]

    var selectedTab: ToDoTab? {
        tabs.first { $0.id == selectedTabId }
    }

    var body: some View {
        ZStack {
            VStack {
                // タブ選択用Picker
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

                // CustomListを使用してタスク一覧を表示
                if let selectedTabId = selectedTabId, !tasks.isEmpty {
                    CustomList(items: tasks, onDelete: handleDeleteTask) { task in
                        ToDoListItem(
                            title: task.title,
                            isCompleted: task.isCompleted
                        ) {
                            toggleTaskCompletion(task)
                        }
                    }
                } else if selectedTabId != nil {
                    // タスクが空の場合
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
                    // タブが選択されていない場合
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

                // タブ管理ボタン
                Button(action: {
                    navigationPath.append(NavigationItem(id: .tabManage))
                }) {
                    Label("タブ管理", systemImage: "folder")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                .padding()
            }
            .padding()
            .navigationTitle("ToDoリスト")
            .onAppear {
                loadTabs()
            }
            // テキスト入力アラート
            .textFieldAlert(
                isPresented: $showingAddTask,
                title: "新しいタスクを追加",
                message: "タスクの内容を入力してください",
                text: $newTaskTitle,
                placeholder: "例: 買い物に行く",
                actionButtonTitle: "追加",
                action: addTask
            )

            // FloatingButtonで新規タスク追加
            if selectedTabId != nil {
                FloatingButton(
                    action: { showingAddTask = true },
                    icon: "plus",
                    backgroundColor: .green
                )
            }
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

    private func addTask() {
        guard !newTaskTitle.isEmpty, let selectedTabId = selectedTabId else { return }
        
        let newTask = ToDoTask(title: newTaskTitle, detail: "", tabId: selectedTabId)
        ToDoTaskService.addTask(newTask, to: modelContext)
        
        newTaskTitle = ""
        showingAddTask = false
        loadTasks()
    }

    private func toggleTaskCompletion(_ task: ToDoTask) {
        ToDoTaskService.toggleTaskCompletion(task, modelContext: modelContext)
        loadTasks()
    }

    private func handleDeleteTask(offsets: IndexSet) {
        for index in offsets {
            let taskToDelete = tasks[index]
            ToDoTaskService.deleteTask(taskToDelete, from: modelContext)
        }
        loadTasks()
    }
}

#Preview {
    HomeView(navigationPath: .constant([]))
}
```

## コードの説明

### 使用コンポーネント

#### 1. **CustomList** (Step 3)
- 選択したタブのタスク一覧を表示
- スワイプで削除機能を提供

```swift
CustomList(items: tasks, onDelete: handleDeleteTask) { task in
    ToDoListItem(
        title: task.title,
        isCompleted: task.isCompleted
    ) {
        toggleTaskCompletion(task)
    }
}
```

#### 2. **ToDoListItem** (Step 2)
- 各タスクを個別に表示
- チェックマークアイコンと打ち消し線で完了状態を表示
- タップでタスク完了状態を切り替え

```swift
ToDoListItem(
    title: task.title,
    isCompleted: task.isCompleted
) {
    toggleTaskCompletion(task)
}
```

#### 3. **TextFieldAlert Modifier** (Step 6)
- 新規タスク追加時にテキスト入力アラートを使用
- ユーザーフレンドリーな入力インターフェース

```swift
.textFieldAlert(
    isPresented: $showingAddTask,
    title: "新しいタスクを追加",
    message: "タスクの内容を入力してください",
    text: $newTaskTitle,
    placeholder: "例: 買い物に行く",
    actionButtonTitle: "追加",
    action: addTask
)
```

#### 4. **FloatingButton** (Step 5)
- 画面右下に配置される丸いボタン
- タブが選択されている場合のみ表示
- 新規タスク追加機能をトリガー

```swift
FloatingButton(
    action: { showingAddTask = true },
    icon: "plus",
    backgroundColor: .green
)
```

### 重要な機能

| 機能             | 説明                                                   |
| ---------------- | ------------------------------------------------------ |
| タブ選択         | Pickerでタブを切り替えると、自動的にタスク一覧を更新   |
| タスク表示       | 選択したタブに属するタスクのみを表示                   |
| 完了状態切り替え | ToDoListItemをタップするとタスクの完了状態が変更される |
| タスク追加       | FloatingButtonで新規タスク追加アラートを表示           |
| タスク削除       | スワイプでタスクを削除                                 |
| 空状態表示       | タスク未登録時の分かりやすいメッセージ表示             |

### 状態管理

| State変数        | 説明                                     |
| ---------------- | ---------------------------------------- |
| `tabs`           | 現在のタブリスト                         |
| `tasks`          | 選択したタブのタスク一覧                 |
| `selectedTabId`  | 現在選択されているタブのID               |
| `showingAddTask` | タスク追加アラートの表示/非表示          |
| `newTaskTitle`   | 新規タスク追加時のテキスト入力フィールド |

### メソッドの説明

| メソッド                 | 説明                       |
| ------------------------ | -------------------------- |
| `loadTabs()`             | SwiftDataからタブを取得    |
| `loadTasks()`            | 選択したタブのタスクを取得 |
| `addTask()`              | 新しいタスクを追加         |
| `toggleTaskCompletion()` | タスクの完了状態を切り替え |
| `handleDeleteTask()`     | スワイプ削除時の処理を実行 |

## 次のステップへ

次は、タスク詳細ビューを実装します。
