# ステップ11: タスク完了機能の実装

<script>
    import {base} from '$app/paths';
</script>

## HomeView.swift の修正

タスク行をタップして完了状態を切り替える機能を追加します：

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

## 新しい要素

- `toggleTaskCompletion()`: タスクの完了状態を切り替えます
- `ToDoListItem`のタップ: 完了・未完了を切り替えます

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

次は、タスクを追加する機能を実装します。
