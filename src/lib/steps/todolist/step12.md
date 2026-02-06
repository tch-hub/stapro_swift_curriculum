# ステップ12: タブ管理画面を作る(TabManageView.swift)

## 1. 基本的な構造とデータ管理

`Views/TabmanageView.swift` を開き、基本的な構造を作ります。
SwiftDataを使うための `@Environment` と、画面の状態を管理する変数を定義します。

```swift
import SwiftUI
import SwiftData

struct TabManageView: View {
    // データベース接続
    @Environment(\.modelContext) private var modelContext

    // 状態変数
    @State private var tabs: [ToDoTab] = []         // タブ一覧
    @State private var newTabName = ""              // 入力中のタブ名
    @State private var showDeleteAlert = false      // 削除アラート表示フラグ
    @State private var tabToDelete: ToDoTab?        // 削除対象のタブ

    var body: some View {
        // レイアウトの実装をここに書きます
        Text("Tab Manager")
    }
}
```

**データ管理の仕組み:**

- **`@Environment(\.modelContext)`**
  SwiftDataのデータベース接続を取得します。`@Environment` は「アプリ全体で共有されている情報」にアクセスするためのキーワードです。この `modelContext` を使って、データの読み書きを行います。

- **`@State` 変数の役割**
  - **`tabs`**: データベースから取得したタブの一覧を保持します。この配列が更新されると、画面も自動的に再描画されます。
  - **`newTabName`**: 入力欄に入力中のテキストを保持します。`InputView` と双方向バインディング（`$newTabName`）で繋がっています。
  - **`showDeleteAlert`**: 削除確認アラートの表示/非表示を管理します。
  - **`tabToDelete`**: 削除しようとしているタブを一時的に保存します。ユーザーが「削除」を確定した時に、このタブを削除します。

## 2. UIの実装: タブ一覧と入力エリア

`body` の中身を実装します。
これまでに作った `CustomList` と `InputView` を組み合わせて画面を作ります。

```swift
    var body: some View {
        ZStack {
            // ①タブ一覧リスト
            CustomList(items: tabs, onDelete: handleDelete) { tab in
                VStack(alignment: .leading, spacing: 4) {
                    Text(tab.name)
                        .font(.headline)
                    Text("作成日: \(tab.createdAt.formatted(date: .abbreviated, time: .omitted))")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            .navigationTitle("タブ管理")
            .onAppear { loadTabs() } // 表示時にデータを読み込む

            // 削除確認アラート
            .alert("タブの削除", isPresented: $showDeleteAlert) {
                Button("削除", role: .destructive) { confirmDelete() }
                Button("キャンセル", role: .cancel) {}
            } message: {
                Text("このタブを削除すると、関連するすべてのタスクも削除されます。")
            }
        }
        // ②下部のタブ追加エリア
        .safeAreaInset(edge: .bottom) {
            InputView(
                text: $newTabName,
                placeholder: "新しいタブ",
                buttonIcon: "plus.circle.fill"
            ) {
                addTab()
            }
        }
    }
```

**UIの構成要素:**

- **`CustomList`（タブ一覧）**
  以前のステップで作成した再利用可能なリストコンポーネントです。`items` にタブの配列を渡し、`onDelete` で削除時の処理を指定します。各タブは `VStack` でタブ名と作成日を縦に並べて表示しています。

- **`.onAppear { loadTabs() }`**
  画面が表示された時に実行される処理です。ここでデータベースからタブ一覧を読み込んでいます。これにより、画面を開くたびに最新のデータが表示されます。

- **`.alert()`（削除確認アラート）**
  `showDeleteAlert` が `true` になると表示されるアラートです。「削除」ボタン（赤色）と「キャンセル」ボタンを用意し、誤操作を防いでいます。`message` でカスケード削除の警告も表示しています。

- **`.safeAreaInset(edge: .bottom)`（下部の入力エリア）**
  画面の下部に固定で表示される領域を作ります。`InputView` を配置することで、常に画面下部からタブを追加できるようにしています。セーフエリア（ホームバーなど）を避けて配置されるため、iPhoneでも使いやすくなっています。

## 3. ロジックの実装

画面の下部（`body` の外）に、データの読み込み・追加・削除を行うメソッドを追加します。

```swift
    // データベースからタブ一覧を読み込む
    private func loadTabs() {
        tabs = ToDoTabService.getAllTabs(from: modelContext)
    }

    // 新しいタブを追加する
    private func addTab() {
        guard !newTabName.isEmpty else { return }

        let newTab = ToDoTab(name: newTabName)
        ToDoTabService.addTab(newTab, to: modelContext)

        newTabName = "" // 入力欄をクリア
        loadTabs()      // 一覧を更新
    }
```

**データの読み込みと追加の流れ:**

- **`loadTabs()`**
  サービス層（`ToDoTabService`）を使ってデータベースから全タブを取得し、`tabs` 配列に格納します。`tabs` が更新されると、SwiftUIが自動的に画面を再描画してくれます。

- **`addTab()`の処理フロー**
  1.  **`guard !newTabName.isEmpty else { return }`**: 入力が空の場合は何もせずに終了します（バリデーション）。
  2.  **`ToDoTab(name: newTabName)`**: 新しいタブオブジェクトを作成します。
  3.  **`ToDoTabService.addTab(...)`**: サービス層を通じてデータベースに保存します。
  4.  **`newTabName = ""`**: 入力欄をクリアして、次の入力に備えます。
  5.  **`loadTabs()`**: データベースから最新のタブ一覧を再取得し、画面に反映します。

この「保存 → 再読み込み」のパターンは、データの一貫性を保つための基本的な手法です。

続けて、削除関連のメソッドも追加します。

```swift
    // スワイプ削除時の処理（確認アラートを出す）
    private func handleDelete(offsets: IndexSet) {
        if let index = offsets.first {
            tabToDelete = tabs[index]
            showDeleteAlert = true
        }
    }

    // 削除を確定する
    private func confirmDelete() {
        if let tabToDelete = tabToDelete {
            ToDoTabService.deleteTab(tabToDelete, from: modelContext)
            loadTabs()
        }
    }
```

**削除処理の2段階パターン:**

- **`handleDelete(offsets: IndexSet)`（第1段階：削除候補の選択）**
  - **`IndexSet`**: スワイプで削除された行のインデックス（位置）を表します。複数選択も可能ですが、ここでは最初の1つだけを取得しています。
  - **`tabToDelete = tabs[index]`**: 削除しようとしているタブを一時保存します。
  - **`showDeleteAlert = true`**: アラートを表示して、ユーザーに確認を求めます。

- **`confirmDelete()`（第2段階：削除の実行）**
  ユーザーがアラートで「削除」を選択した時に呼ばれます。`tabToDelete` に保存されているタブを実際に削除し、`loadTabs()` で画面を更新します。

**なぜ2段階にするのか？**
誤操作を防ぐためです。特にこのアプリでは、タブを削除すると関連するタスクも全て消えてしまうため、確認ステップが重要です。

## 4. プレビューの作成

動作確認用のプレビューを追加します。メモリ内データベース (`isStoredInMemoryOnly: true`) を使用します。

```swift
#Preview {
    NavigationStack {
        TabManageView()
            .modelContainer(for: ToDoTab.self, inMemory: true)
    }
}
```

**プレビューのポイント:**

- **`inMemory: true`**
  テスト用のメモリ内データベースを使用します。プレビューで実際のデータベースファイルを汚さないための設定です。プレビューを閉じるとデータは消えます。

- **`NavigationStack`**
  `.navigationTitle()` を表示するために必要です。プレビューでも本番と同じようにナビゲーションバーが表示されます。

---

## コード全体

<img src="/images/todolist/TabManageView.png" alt="タブ管理画面の完成イメージ" class="mobile-screenshot" />

### Views/TabmanageView.swift

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
        ZStack {
            // MARK: - タブ一覧
            CustomList(items: tabs, onDelete: handleDelete) { tab in
                VStack(alignment: .leading, spacing: 4) {
                    Text(tab.name)
                        .font(.headline)
                    Text("作成日: \(tab.createdAt.formatted(date: .abbreviated, time: .omitted))")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            .navigationTitle("タブ管理")
            .onAppear { loadTabs() }
            .alert("タブの削除", isPresented: $showDeleteAlert) {
                Button("削除", role: .destructive) { confirmDelete() }
                Button("キャンセル", role: .cancel) {}
            } message: {
                Text("このタブを削除すると、関連するすべてのタスクも削除されます。")
            }
        }
        // MARK: - タブ追加エリア
        .safeAreaInset(edge: .bottom) {
            InputView(
                text: $newTabName,
                placeholder: "新しいタブ",
                buttonIcon: "plus.circle.fill"
            ) {
                addTab()
            }
        }
    }

    // MARK: - Private Methods
    private func loadTabs() {
        tabs = ToDoTabService.getAllTabs(from: modelContext)
    }

    private func addTab() {
        guard !newTabName.isEmpty else { return }
        let newTab = ToDoTab(name: newTabName)
        ToDoTabService.addTab(newTab, to: modelContext)
        newTabName = ""
        loadTabs()
    }

    private func handleDelete(offsets: IndexSet) {
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
    NavigationStack {
        TabManageView()
            .modelContainer(for: ToDoTab.self, inMemory: true)
    }
}
```
