# ステップ12: タブ管理画面を作る(TabManageView.swift)

## このステップで学ぶこと

タブの追加や削除ができる画面を作成します。

設定アプリでアカウントを追加・削除する画面や、メモアプリでフォルダを管理する画面を想像してください。このステップでは、タブを一覧表示し、新しいタブを追加したり、不要なタブを削除したりできる管理画面を作ります。

これまで作成した `CustomList` や `InputView` などのコンポーネントを再利用するので、コードの量は少なくなります。

### 1. ファイルを開く

ステップ1で作成した `Views/TabmanageView.swift` を開いてください。ここにコードを書いていきます。

### 2. 基本的な構造を書く

それでは、一つずつコードを書いていきましょう。

#### 📦 手順① import文とViewの骨組みを書く

まず、必要な部品を読み込んで、基本的な構造を作ります。

```swift
import SwiftUI
import SwiftData

struct TabManageView: View {
    var body: some View {
        // ここにこれから内容を書いていきます
    }
}
```

**各部分の説明：**

- **`import SwiftUI`**: SwiftUIという画面を作るための道具箱を使えるようにします
- **`import SwiftData`**: データベースを使うための道具箱を使えるようにします
- **`struct TabManageView: View`**: タブ管理画面を作る宣言です

#### 💾 手順② データベースと状態変数を追加する

**`struct TabManageView: View {` の直下**に、データベース接続と状態管理の変数を追加します。

```swift
@Environment(\.modelContext) private var modelContext

@State private var tabs: [ToDoTab] = []
@State private var newTabName = ""
@State private var showDeleteAlert = false
@State private var tabToDelete: ToDoTab?
```

**各変数の説明：**

- **`@Environment(\.modelContext)`**: SwiftDataのデータベースに接続します
  - `modelContext` を使ってデータの読み書きができます
- **`@State private var tabs`**: 現在のタブの一覧を保存します
- **`@State private var newTabName`**: 新しいタブ名を入力する欄の内容を保存します
- **`@State private var showDeleteAlert`**: 削除確認アラートを表示するかどうか
- **`@State private var tabToDelete`**: どのタブを削除するか一時的に覚えておきます
  - `?` がついているので、何も選択されていない状態もあります

#### 📱 手順③ 基本的なレイアウトを作る

**`var body: some View { }` の中**にコードを書きます。コメントの部分を以下のコードに置き換えてください。

```swift
ZStack {
    VStack {
        // タブ一覧（これから書きます）
    }
    .navigationTitle("タブ管理")
}
```

**レイアウトの説明：**

- **`ZStack`**: 複数のビューを重ねて表示します（後で入力欄を重ねます）
- **`VStack`**: 縦並びのレイアウト
- **`.navigationTitle("タブ管理")`**: 画面上部に「タブ管理」というタイトルを表示

#### 📋 手順④ タブ一覧を表示する

**`VStack` の中の「タブ一覧（これから書きます）」のコメント部分**を、以下のコードに置き換えてください。

```swift
CustomList(items: tabs, onDelete: handleDelete) { tab in
    VStack(alignment: .leading, spacing: 4) {
        Text(tab.name)
            .font(.headline)
        Text("作成日: \(tab.createdAt.formatted(date: .abbreviated, time: .omitted))")
            .font(.caption)
            .foregroundColor(.gray)
    }
}
```

**タブ一覧の説明：**

- **`CustomList`**: ステップ3で作った一覧表示コンポーネントを再利用します
- **`items: tabs`**: 表示するタブのリストを指定
- **`onDelete: handleDelete`**: スワイプ削除した時の処理（後で作ります）
- **`{ tab in ... }`**: 各タブをどう表示するか定義します
- **`Text(tab.name)`**: タブ名を大きめの文字で表示
- **`Text("作成日: ...")`**: 作成日を小さめのグレー文字で表示
  - `.formatted(date: .abbreviated, time: .omitted)` で日付だけを表示

#### ✏️ 手順⑤ タブ追加の入力欄を追加する

**`ZStack` の閉じ括弧 `}` の直前**（`.navigationTitle("タブ管理")` の下）に、入力欄を追加します。

```swift
.safeAreaInset(edge: .bottom) {
    InputView(
        text: $newTabName,
        placeholder: "新しいタブ",
        buttonIcon: "plus.circle.fill"
    ) {
        addTab()
    }
}
```

**入力欄の説明：**

- **`.safeAreaInset(edge: .bottom)`**: 画面の下部に固定で配置します
- **`InputView`**: ステップ5で作った入力コンポーネントを再利用します
- **`text: $newTabName`**: 入力内容を `newTabName` に保存
- **`placeholder: "新しいタブ"`**: 入力欄のヒント文字
- **`buttonIcon: "plus.circle.fill"`**: ボタンのアイコンをプラスマークに
- **`addTab()`**: ボタンを押した時の処理（後で作ります）

#### 🔄 手順⑥ 画面表示時の処理と削除確認を追加する

**`.safeAreaInset` の閉じ括弧 `}` の下**に、画面表示時の処理と削除確認アラートを追加します。

```swift
.onAppear {
    loadTabs()
}
.alert("タブの削除", isPresented: $showDeleteAlert) {
    Button("削除", role: .destructive) {
        confirmDelete()
    }
    Button("キャンセル", role: .cancel) {}
} message: {
    Text("このタブを削除すると、関連するすべてのタスクも削除されます。")
}
```

**各部分の説明：**

- **`.onAppear`**: 画面が表示された時に実行される処理
- **`loadTabs()`**: データベースからタブ一覧を読み込む関数（後で作ります）
- **`.alert`**: 削除確認のアラート（ダイアログ）を表示
- **`isPresented: $showDeleteAlert`**: `showDeleteAlert` が `true` の時に表示
- **`Button("削除", role: .destructive)`**: 削除ボタン（赤色で警告的に表示）
- **`confirmDelete()`**: 削除を確定する関数（後で作ります）
- **`Button("キャンセル", role: .cancel)`**: キャンセルボタン
- **`message:`**: アラートのメッセージ部分

#### 💡 手順⑦ タブ読み込み処理を追加する

**`var body: some View { }` の閉じ括弧 `}` の下**に、データベースからタブを読み込む関数を追加します。

```swift
// MARK: - Private Methods

// データベースからタブ一覧を取得
private func loadTabs() {
    let descriptor = FetchDescriptor<ToDoTab>()
    tabs = (try? modelContext.fetch(descriptor)) ?? []
}
```

**関数の説明：**

- **`// MARK: - Private Methods`**: コードの区切りを分かりやすくするコメント
- **`private func loadTabs()`**: タブ一覧を読み込む関数
- **`FetchDescriptor<ToDoTab>()`**: データベースから `ToDoTab` を取得する設定
- **`modelContext.fetch(descriptor)`**: データベースからデータを取得
- **`?? []`**: エラーが起きた場合は空の配列を使う

#### ➕ 手順⑧ タブ追加処理を追加する

**`loadTabs()` 関数の閉じ括弧 `}` の下**に、新しいタブを追加する関数を追加します。

```swift
// 新しいタブを追加
private func addTab() {
    guard !newTabName.isEmpty else { return }

    let newTab = ToDoTab(name: newTabName)
    ToDoTabService.addTab(newTab, to: modelContext)

    newTabName = ""
    loadTabs()
}
```

**関数の説明：**

- **`guard !newTabName.isEmpty else { return }`**: 入力が空の場合は何もしない
- **`let newTab = ToDoTab(name: newTabName)`**: 新しいタブオブジェクトを作成
- **`ToDoTabService.addTab`**: タブをデータベースに保存（サービス関数を使用）
- **`newTabName = ""`**: 入力欄を空にする
- **`loadTabs()`**: 一覧を再読み込みして、追加されたタブを表示

#### 🗑️ 手順⑨ 削除処理を追加する

**`addTab()` 関数の閉じ括弧 `}` の下**に、削除関連の2つの関数を追加します。

```swift
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

**各関数の説明：**

**handleDelete（削除候補を選択）：**

- **`offsets: IndexSet`**: スワイプで削除された行の番号
- **`if let index = offsets.first`**: 削除された最初の行の番号を取得
- **`tabToDelete = tabs[index]`**: どのタブを削除するか覚えておく
- **`showDeleteAlert = true`**: 確認アラートを表示

**confirmDelete（削除を実行）：**

- **`if let tabToDelete = tabToDelete`**: 削除するタブが選択されているか確認
- **`ToDoTabService.deleteTab`**: タブをデータベースから削除
- **`loadTabs()`**: 一覧を再読み込みして、削除されたタブを消す

#### 👀 手順⑩ プレビュー機能を追加する

最後に、**`TabManageView` の構造体の下**（閉じ括弧 `}` の後）に、プレビュー用のコードを追加します。

```swift
#Preview {
    struct PreviewWrapper: View {
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

**プレビューの説明：**

- **`NavigationStack`**: ナビゲーションバー（上部のタイトルバー）を表示するために必要
- **`.modelContainer`**: プレビュー用の一時的なデータベースを用意
- **`isStoredInMemoryOnly: true`**: メモリ上だけで動作（実際のデータベースに影響しない）

これで `TabManageView.swift` が完成しました！🎉

---

## なぜこのような構成にするのか

このタブ管理画面は、以下の点で工夫されています：

1. **コンポーネントの再利用**: `CustomList` と `InputView` を再利用することで、コード量を減らし、一貫性のあるUIを実現
2. **安全な削除**: いきなり削除せず、確認アラートを表示することで誤操作を防ぐ
3. **タスクの連鎖削除**: タブを削除する時、関連するタスクも一緒に削除されることを明示
4. **リアルタイム更新**: データを変更したら即座に `loadTabs()` で一覧を更新

---

## 完成したコード全体

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
            // InputViewを使用してタブを追加
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
