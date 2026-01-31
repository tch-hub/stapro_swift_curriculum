# ステップ20: タスク編集を実装する

長押しでタスク名を編集できるようにします。

### 1. 入力付きアラートの拡張機能を追加

タスク名の編集にはテキスト入力が必要ですが、標準のアラートだけでは入力欄を作れません。そこで、便利な拡張機能を追加します。
`View+Extensions.swift` （または `Extensions.swift`）という新しいファイルを作成し、以下のコードを追加してください。

```swift
import SwiftUI

extension View {
    func textFieldAlert(
        isPresented: Binding<Bool>,
        title: String,
        message: String,
        text: Binding<String>,
        placeholder: String = "",
        actionButtonTitle: String = "保存",
        action: @escaping () -> Void
    ) -> some View {
        self.alert(title, isPresented: isPresented) {
            TextField(placeholder, text: text)
            Button("キャンセル", role: .cancel) {}
            Button(actionButtonTitle) {
                action()
            }
            .disabled(text.wrappedValue.isEmpty)
        } message: {
            Text(message)
        }
    }
}
```

### 2. 編集用の状態

```swift
// 編集ダイアログを表示するかどうかのフラグ
@State private var showEditDialog = false
// 編集中のタスク名
@State private var editTaskTitle = ""
// 現在編集しようとしているタスクオブジェクト
@State private var editingTask: ToDoTask?
```

タスク名の編集機能を実現するために、「ダイアログの表示状態」「編集中の文字列」「編集対象のタスク自体」という3つの情報を管理します。

### 3. 長押しで編集開始

```swift
// 長押しジェスチャーを検知
.onLongPressGesture {
    // 長押しされたら編集モードを開始
    startEdit(task)
}
```

`.onLongPressGesture` を使うことで、ユーザーがタスクを長押しした時に編集処理（`startEdit`）を呼び出すように設定しています。  
これにより、タップ（完了切り替え）とは別の操作として編集機能を割り当てています。

### 4. 編集用アラートを表示

```swift
// 自作した textFieldAlert を呼び出して編集画面を表示
.textFieldAlert(
   isPresented: $showEditDialog,
   title: "タスクの編集",
   message: "新しいタイトルを入力してください。",
   text: $editTaskTitle,
   placeholder: "例: 牛乳を買う",
   actionButtonTitle: "保存",
   action: {
      // 保存ボタンが押されたら編集内容を反映
      applyEdit()
   }
)
```

このステップで作成した `textFieldAlert` を使って、タスク名の変更フォームを表示します。入力されたテキストは `$editTaskTitle` に同期され、保存ボタンを押すと `applyEdit` メソッドが実行されます。

### 5. 編集内容を保存

```swift
// 編集内容をデータベースへ保存するメソッド
private func applyEdit() {
   // 編集対象のタスクが存在することを確認
   guard let editingTask = editingTask else { return }

   // タイトルを書き換え
   editingTask.title = editTaskTitle
   // データベースに変更を通知・保存
   ToDoTaskService.updateTask(editingTask, modelContext: modelContext)
   // リストの表示を更新
   loadTasks()
}
```

編集ダイアログで入力された新しいタイトルを対象のタスクオブジェクトに代入し、Serviceを通じてデータベースに保存します。最後にリストを再読み込みして、画面上のタスク名を更新します。

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
   @State private var showEditDialog = false
   @State private var editTaskTitle = ""
   @State private var editingTask: ToDoTask?
   @Binding var navigationPath: [NavigationItem]

   var body: some View {
      ZStack {
         VStack {
            if tabs.isEmpty {
               Text("タブがありません")
                  .padding()
            } else {
               TabHeaderView(
                  tabs: tabs.map { .init(id: $0.id, name: $0.name) },
                  selectedTabId: $selectedTabId,
                  onManageTabs: {
                     navigationPath.append(NavigationItem(id: .tabManage))
                  }
               )
               .onChange(of: selectedTabId) { _, _ in
                  loadTasks()
               }

               if selectedTabId != nil && !tasks.isEmpty {
                  CustomList(items: tasks, onDelete: handleDeleteTask) { task in
                     ToDoListItem(
                        title: task.title,
                        isCompleted: task.isCompleted
                     ) {
                        toggleTaskCompletion(task)
                     }
                     .onLongPressGesture {
                        startEdit(task)
                     }
                  }
               } else {
                  EmptyStateView(hasSelectedTab: selectedTabId != nil)
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
            InputView(text: $newTaskTitle, onAdd: addTask)
         }
      }
      .textFieldAlert(
         isPresented: $showEditDialog,
         title: "タスクの編集",
         message: "新しいタイトルを入力してください。",
         text: $editTaskTitle,
         placeholder: "例: 牛乳を買う",
         actionButtonTitle: "保存",
         action: {
            applyEdit()
         }
      )
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

   private func handleDeleteTask(_ offsets: IndexSet) {
      for index in offsets {
         let taskToDelete = tasks[index]
         ToDoTaskService.deleteTask(taskToDelete, from: modelContext)
      }
      loadTasks()
   }

   private func startEdit(_ task: ToDoTask) {
      editingTask = task
      editTaskTitle = task.title
      showEditDialog = true
   }

   private func applyEdit() {
      guard let editingTask = editingTask else { return }
      editingTask.title = editTaskTitle
      ToDoTaskService.updateTask(editingTask, modelContext: modelContext)
      loadTasks()
   }
}
```
