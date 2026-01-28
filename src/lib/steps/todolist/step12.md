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
            } else {
                Text("タブが登録されていません")
                    .foregroundColor(.gray)
                    .padding()
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
                    showingAddTask = true
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
            VStack(spacing: 20) {
                Text("タスク追加")
                    .font(.headline)
                
                TextField("タスクを入力", text: $newTaskTitle)
                    .textFieldStyle(.roundedBorder)
                    .padding()

                HStack(spacing: 20) {
                    Button("キャンセル") {
                        showingAddTask = false
                        newTaskTitle = ""
                    }

                    Button("追加") {
                        addTask()
                    }
                    .disabled(newTaskTitle.isEmpty)
                }
                .padding()

                Spacer()
            }
            .padding()
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
        // タブが存在しない場合は自動で作成
        var tabId = selectedTabId
        if tabId == nil {
            let defaultTab = ToDoTab(name: "デフォルト")
            ToDoTabService.addTab(defaultTab, to: modelContext)
            loadTabs()
            tabId = tabs.first?.id
        }
        
        guard let tabId = tabId else { return }
        
        let newTask = ToDoTask(title: newTaskTitle, detail: "", tabId: tabId)
        ToDoTaskService.addTask(newTask, to: modelContext)
        loadTasks()
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

## タブが存在しない場合の処理

このステップで改善されました：

```swift
private func addTask() {
    // タブが存在しない場合は自動で作成
    var tabId = selectedTabId
    if tabId == nil {
        let defaultTab = ToDoTab(name: "デフォルト")
        ToDoTabService.addTab(defaultTab, to: modelContext)
        loadTabs()
        tabId = tabs.first?.id
    }
    
    guard let tabId = tabId else { return }
    // ... タスク追加処理
}
```

この処理により：
- ユーザーがタスクを追加しようとした時にタブが存在しない場合、自動的に「デフォルト」という名前のタブが作成されます
- そのタブにタスクが追加されます
- タブ管理画面でタブの名前は後から変更できます


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



