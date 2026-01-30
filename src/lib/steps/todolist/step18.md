# ステップ18: タスク追加フォームを作る

画面下部にタスク追加欄を表示します。

### 1. 入力用の状態

```swift
// 新しく作成するタスクのタイトルを保持する変数
@State private var newTaskTitle = ""
```

タスク追加フォームに入力された文字を一時的に保存しておくための変数を定義しています。

### 2. safeAreaInset で下部に固定

```swift
// 画面の下部に入力エリアを固定表示
.safeAreaInset(edge: .bottom) {
    // タブが選択されている場合のみ表示（どのタブに追加するか分からないため）
    if selectedTabId != nil {
        HStack(spacing: 12) {
            // タスク名入力フィールド
            TextField("新しいタスク", text: $newTaskTitle)
                .textFieldStyle(.roundedBorder)
                .submitLabel(.done) // キーボードの決定キーを「完了」にする
                .onSubmit {
                    addTask() // Enterキーで追加処理を実行
                }

            // 追加ボタン
            Button("追加") {
                addTask()
            }
            .buttonStyle(.borderedProminent)
            // 空白のみ、または未入力の場合はボタンを押せないようにする
            .disabled(newTaskTitle.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
        }
        // 以下、見た目の調整
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(.ultraThinMaterial) // すりガラスのような背景
    }
}
```

`.safeAreaInset(edge: .bottom)` を使うことで、リストの最下部と重ならないように、画面下部に常に入力エリアを表示させています。  
タブが選択されていない時は追加先が不明なため、`if selectedTabId != nil` で非表示にしています。

### 3. 追加処理

```swift
// 新しいタスクをデータベースに追加するメソッド
private func addTask() {
    // タイトルが空でないか、タブが選択されているかを確認（ガード節）
    guard !newTaskTitle.isEmpty, let selectedTabId = selectedTabId else { return }

    // タスクモデルを作成
    let newTask = ToDoTask(title: newTaskTitle, detail: "", tabId: selectedTabId)
    // データベースに保存
    ToDoTaskService.addTask(newTask, to: modelContext)

    // 入力欄をクリア
    newTaskTitle = ""
    // リストを更新して新しいタスクを表示
    loadTasks()
}
```

入力されたタイトルと現在選択されているタブIDを使って新しい `ToDoTask` を作成し、Service経由で保存します。  
保存後は続けて入力できるように入力欄をクリアし、一覧を再読み込みしています。

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
    @State private var newTaskTitle = ""
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
                    } else {
                        emptyStateView
                    }
                }

            }
            .padding()
            .navigationTitle("ToDoリスト")
            .onAppear {
                loadTabs()
            }
        }
        .safeAreaInset(edge: .bottom) {
            if selectedTabId != nil {
                HStack(spacing: 12) {
                    TextField("新しいタスク", text: $newTaskTitle)
                        .textFieldStyle(.roundedBorder)
                        .submitLabel(.done)
                        .onSubmit {
                            addTask()
                        }

                    Button("追加") {
                        addTask()
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(newTaskTitle.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(.ultraThinMaterial)
            }
        }
    }

    @ViewBuilder
    private var emptyStateView: some View {
        if selectedTabId != nil {
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

    private func addTask() {
        guard !newTaskTitle.isEmpty, let selectedTabId = selectedTabId else { return }

        let newTask = ToDoTask(title: newTaskTitle, detail: "", tabId: selectedTabId)
        ToDoTaskService.addTask(newTask, to: modelContext)

        newTaskTitle = ""
        loadTasks()
    }
}
```
