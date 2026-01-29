# ステップ11: タスク追加機能の実装

<script>
    import {base} from '$app/paths';
</script>

## HomeView.swift の修正

タスクを追加するための入力アラートと「+」ボタンを追加します：

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

    var body: some View {
        ZStack {
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

                if let selectedTabId = selectedTabId, !tasks.isEmpty {
                    CustomList(items: tasks, onDelete: handleDeleteTask) { task in
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
            .textFieldAlert(
                isPresented: $showingAddTask,
                title: "新しいタスクを追加",
                message: "タスクの内容を入力してください",
                text: $newTaskTitle,
                placeholder: "例: 買い物に行く",
                actionButtonTitle: "追加",
                action: addTask
            )

            if selectedTabId != nil {
                FloatingButton(
                    action: { showingAddTask = true },
                    icon: "plus",
                    backgroundColor: .green
                )
            }
        }
    }

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

    private func handleDeleteTask(_ offsets: IndexSet) {
        // 削除処理は次のステップで実装します
    }
}
```

## 新しい要素

- `@State private var showingAddTask`: 入力アラートの表示状態を管理します
- `@State private var newTaskTitle`: 入力されたタスクのタイトルを保持します
- `.textFieldAlert()`: テキスト入力アラートを表示します
- `FloatingButton`: 画面右下の追加ボタンを表示します
- `addTask()`: 新しいタスクをデータベースに保存します


## ビルドと実行

Canvas のプレビューでは UI の見た目確認ができますが、実際にタスク追加などの機能を試すにはビルドして実行する必要があります。

### シミュレータでのビルド・実行

1. **プロジェクトを選択**
   - Xcode の左側のプロジェクトナビゲーターで、プロジェクト名を選択します

2. **ターゲットを確認**
   - 「Targets」から自分のアプリを選択します

3. **ビルド・実行**
   - Xcode のメニューから「Product」→「Run」を選択、または `Cmd + R` キーを押します
   - または、ツールバーの「▶」（再生ボタン）をクリックします

4. **シミュレータの起動**
   - 自動的にシミュレータが起動し、アプリが実行されます

### ビルドエラーが出た場合

```
「Could not initialize ModelContainer」
```

このエラーが出た場合は、`step2.md` で説明している `ToDoListApp.swift` の以下の部分をコメント解除したか確認してください：

```swift
let schema = Schema([
    ToDoTask.self,      // ← コメント解除
    ToDoTab.self        // ← コメント解除
])
```

### データの確認

シミュレータでアプリを実行してタスクを追加すると、データがデバイス（またはシミュレータ）に保存されます。再度アプリを起動すると、保存されたタスク一覧が表示されます。

## 次のステップへ

次は、タスクの完了状態を切り替える機能を実装します。



