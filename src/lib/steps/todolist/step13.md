# ステップ13: タブ管理画面を作る

タブの追加や削除ができる画面を作成します。

### 1. 基本構造と変数の定義

```swift
import SwiftUI
import SwiftData

struct TabManageView: View {
    @Environment(\.modelContext) private var modelContext

    @State private var tabs: [ToDoTab] = []
    @State private var newTabName = ""
    @State private var showDeleteAlert = false
    @State private var tabToDelete: ToDoTab?

    var body: some View {
        // この後のコードがここに入ります
    }
}
```

タブ管理画面を構成するために必要な変数を `@State` で定義しています。  
「現在のリスト」「入力中の名前」「アラートの表示状態」「削除候補のデータ」という4つの状態を管理します。  
また、SwiftDataを使用するため `@Environment(\.modelContext)` でデータベースのコンテキストを取得しています。

### 2. タブ一覧表示

```swift
VStack {
    // 自作したCustomListを使用して一覧表示
    CustomList(items: tabs, onDelete: handleDelete) { tab in
        // 各行のデザイン定義
        VStack(alignment: .leading, spacing: 4) {
            // タブ名
            Text(tab.name)
                .font(.headline)
            // 作成日を表示（日付のみ）
            Text("作成日: \(tab.createdAt.formatted(date: .abbreviated, time: .omitted))")
                .font(.caption)
                .foregroundColor(.gray)
        }
    }
}
.navigationTitle("タブ管理")
```

ステップ3で作った `CustomList` コンポーネントを再利用しています。  
行の中身は `VStack` を使って「タブ名」とその下に小さく「作成日」を表示するデザインにしています。  
スワイプ削除時の処理として `handleDelete` メソッド（後述）を渡しています。

### 3. 追加エリア

```swift
.safeAreaInset(edge: .bottom) {
    // 画面下部でタブを追加
    HStack(spacing: 12) {
        // タブ名の入力欄
        TextField("新しいタブ", text: $newTabName)
            .textFieldStyle(.roundedBorder)
            .submitLabel(.done) // キーボードの改行キーを「完了」にする
            .onSubmit {
                addTab() // Enterキーで追加
            }

        // 追加ボタン
        Button("追加") {
            addTab()
        }
        .buttonStyle(.borderedProminent)
        // 名前が空（スペースのみも含む）の場合はボタンを押せないようにする
        .disabled(newTabName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 12)
    .background(.ultraThinMaterial)
}
```

テキストフィールドと追加ボタンを `HStack` で横に並べています。誤操作を防ぐため、タブ名が空欄やスペースのみの場合には `.disabled(...)` を使って追加ボタンを無効化しています。  
`.safeAreaInset(edge: .bottom)` を使用して画面下部に固定して配置しています。

### 4. 画面表示時の処理と削除アラート

```swift
.onAppear {
    loadTabs()
}
// 削除確認アラート
.alert("タブの削除", isPresented: $showDeleteAlert) {
    Button("削除", role: .destructive) {
        confirmDelete()
    }
    Button("キャンセル", role: .cancel) {}
} message: {
    Text("このタブを削除すると、関連するすべてのタスクも削除されます。")
}
```

画面が表示されたときに `loadTabs()` でタブ一覧をデータベースから読み込みます。  
また、SwiftUIの標準的な `.alert` モディファイアを使って削除確認ダイアログを表示します。削除ボタンには `role: .destructive` を指定して赤色で警告的に表示します。

### 5. メソッドの実装

```swift
// MARK: - Private Methods

// データベースからタブ一覧を取得
private func loadTabs() {
    let descriptor = FetchDescriptor<ToDoTab>()
    tabs = (try? modelContext.fetch(descriptor)) ?? []
}

// 新しいタブを追加
private func addTab() {
    guard !newTabName.isEmpty else { return }

    let newTab = ToDoTab(name: newTabName)
    ToDoTabService.addTab(newTab, to: modelContext)

    newTabName = ""
    loadTabs()
}

// スワイプ削除時に確認アラートを表示
private func handleDelete(offsets: IndexSet) {
    if let index = offsets.first {
        tabToDelete = tabs[index]
        showDeleteAlert = true
    }
}

// 削除を確定
private func confirmDelete() {
    if let tabToDelete = tabToDelete {
        ToDoTabService.deleteTab(tabToDelete, from: modelContext)
        loadTabs()
    }
}
```

これらのメソッドで、タブの読み込み、追加、削除の処理を行います。  
`loadTabs()` は `FetchDescriptor` を使ってSwiftDataからタブ一覧を取得します。  
削除は2段階になっており、まず `handleDelete` で削除対象を選択してアラートを表示し、ユーザーが確定したら `confirmDelete` で実際に削除します。

---

## コード全体

<img src="/images/tutorial/todolist_step13.png" alt="タブ管理画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
// TabManageView.swift
import SwiftUI
import SwiftData

struct TabManageView: View {
    @Environment(\.modelContext) private var modelContext

    @State private var tabs: [ToDoTab] = []
    @State private var newTabName = ""
    @State private var showDeleteAlert = false
    @State private var tabToDelete: ToDoTab?

    var body: some View {
        ZStack {
            VStack {
                // 既存のタブリストをCustomListで表示
                CustomList(items: tabs, onDelete: handleDelete) { tab in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(tab.name)
                            .font(.headline)
                        Text("作成日: \(tab.createdAt.formatted(date: .abbreviated, time: .omitted))")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                }
            }
            .navigationTitle("タブ管理")
            .onAppear {
                loadTabs()
            }
            // 削除確認アラート
            .alert("タブの削除", isPresented: $showDeleteAlert) {
                Button("削除", role: .destructive) {
                    confirmDelete()
                }
                Button("キャンセル", role: .cancel) {}
            } message: {
                Text("このタブを削除すると、関連するすべてのタスクも削除されます。")
            }
        }
        .safeAreaInset(edge: .bottom) {
            // 画面下部でタブを追加
            HStack(spacing: 12) {
                TextField("新しいタブ", text: $newTabName)
                    .textFieldStyle(.roundedBorder)
                    .submitLabel(.done)
                    .onSubmit {
                        addTab()
                    }

                Button("追加") {
                    addTab()
                }
                .buttonStyle(.borderedProminent)
                .disabled(newTabName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(.ultraThinMaterial)
        }
    }

    // MARK: - Private Methods

    private func loadTabs() {
        let descriptor = FetchDescriptor<ToDoTab>()
        tabs = (try? modelContext.fetch(descriptor)) ?? []
    }

    private func addTab() {
        guard !newTabName.isEmpty else { return }

        let newTab = ToDoTab(name: newTabName)
        ToDoTabService.addTab(newTab, to: modelContext)

        newTabName = ""
        loadTabs()
    }

    private func handleDelete(offsets: IndexSet) {
        // スワイプで削除された場合、確認アラートを表示
        if let index = offsets.first {
            tabToDelete = tabs[index]
            showDeleteAlert = true
        }
    }

    private func confirmDelete() {
        if let tabToDelete = tabToDelete {
            ToDoTabService.deleteTab(tabToDelete, from: modelContext)
            loadTabs()
        }
    }
}

#Preview {
    struct PreviewWrapper: View {
        // モックデータ用のモデルコンテキストを作成
        var body: some View {
            NavigationStack {
                TabManageView()
                    .modelContainer(
                        try! ModelContainer(
                            for: ToDoTab.self,
                            configurations: ModelConfiguration(isStoredInMemoryOnly: true)
                        )
                    )
            }
        }
    }

    return PreviewWrapper()
}
```
