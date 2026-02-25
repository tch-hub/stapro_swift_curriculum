# ステップ12: タブ管理画面を作る(TabManageView.swift)

### ステップ12終了時の完成イメージ

<img src="/images/todolist/TabManageView.png" alt="タブ管理画面の完成イメージ" class="mobile-screenshot-top" />

## 1. 基本的な構造とデータ管理

`Views/TabmanageView.swift` を開き、基本的な構造を作ります。
SwiftDataを使うための `@Environment` と、画面の状態を管理する変数を定義します。

```swift
import SwiftUI   // 画面を作るための部品を使えるようにする
import SwiftData // データベースを使えるようにする

struct TabManageView: View {
    // 【データベースへの接続口】
    // アプリ全体で共有されているデータベース接続を受け取る
    @Environment(\.modelContext) private var modelContext

    // 【画面の状態を管理する変数】
    // 値が変わると、SwiftUIが自動的に画面を更新してくれる
    @State private var tabs: [ToDoTab] = []         // データベースから取得したタブの一覧
    @State private var newTabName = ""              // 入力欄に今入力されているタブ名
    @State private var showDeleteAlert = false      // true になると削除確認ダイアログが表示される
    @State private var tabToDelete: ToDoTab?        // 「削除しようとしているタブ」を一時的に覚えておく場所

    var body: some View {
        // ここに画面のレイアウトを書いていく（次のステップで実装）
        Text("Tab Manager")
    }
}
```

**データ管理の仕組み:**

- **`@Environment(\.modelContext)`**
  アプリ全体で共有されているデータベースの接続口を受け取ります。`@Environment` は「アプリが用意してくれている共通の情報」を取り出すための書き方です。この `modelContext` を通じてデータの読み書きができます。

- **`@State` 変数の役割**
  - **`tabs`**: データベースから取り出したタブの一覧をここに入れておきます。中身が変わると、画面も自動でつくり直されます。
  - **`newTabName`**: 入力欄に今入力されているタブ名を入れておく変数です。`$newTabName` と書くことで、入力欄の文字と変数が自動で連動します。
  - **`showDeleteAlert`**: `true` にすると削除確認のポップアップが表示され、`false` にすると消えます。
  - **`tabToDelete`**: 「削除しようとしているタブ」をいったん覚えておく場所です。アラートで「削除」が押されたとき、ここに入っているタブを実際に消します。

## 2. UIの実装: タブ一覧と入力エリア

`body` の中身を実装します。
これまでに作った `CustomList` と `InputView` を組み合わせて画面を作ります。

```swift
    var body: some View {
       
        ZStack {  // ZStack：複数のビューを重ねて表示する（今回は1つだが、後でビューを追加しやすいようにしている）

            // ①タブ一覧リスト
            CustomList(items: tabs, onDelete: handleDelete) { tab in // tabs 配列の中身を一覧表示する。スワイプ削除は handleDelete に任せる
                VStack(alignment: .leading, spacing: 4) { // 各タブの行に表示する内容（名前と作成日を縦に並べる）
                    Text(tab.name)           // タブの名前を大きめに表示
                        .font(.headline)
                    Text("作成日: \(tab.createdAt.formatted(date: .abbreviated, time: .omitted))")
                        .font(.caption)      // 作成日を小さめに表示
                        .foregroundColor(.gray)
                }
            }
            .navigationTitle("タブ管理")   // ナビゲーションバーのタイトル
            .onAppear { loadTabs() }        // 画面が開いたとき、まずデータを読み込む

            .alert("タブの削除", isPresented: $showDeleteAlert) { // 削除確認アラート:showDeleteAlert が true になると自動的に表示される
                Button("削除", role: .destructive) { confirmDelete() } // 赤い「削除」ボタン
                Button("キャンセル", role: .cancel) {}                  // 「キャンセル」ボタン
            } message: {
                
                Text("このタブを削除すると、関連するすべてのタスクも削除されます。") // アラートに表示するメッセージ（タスクも消えることを警告）
            }
        }
        // ②下部のタブ追加エリア
        // 画面の一番下に固定して InputView を表示する（ホームバーと重ならないように自動調整）
        .safeAreaInset(edge: .bottom) {
            InputView(
                text: $newTabName,           // 入力欄と newTabName を連動させる
                placeholder: "新しいタブ",   // 何も入力されていないときに薄く表示される文字
                buttonIcon: "plus.circle.fill" // ボタンのアイコン（＋マーク）
            ) {
                addTab() // ボタンが押されたときにタブを追加する
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
  `showDeleteAlert` が `true` になると表示されるアラートです。「削除」ボタン（赤色）と「キャンセル」ボタンを用意し、誤操作を防いでいます。

- **`.safeAreaInset(edge: .bottom)`（下部の入力エリア）**
  画面の下部に固定で表示される領域を作ります。`InputView` を配置することで、常に画面下部からタブを追加できるようにしています。セーフエリア（ホームバーなど）を避けて配置されるため、iPhoneでも使いやすくなっています。

## 3. ロジックの実装

画面の下部（`body` の外）に、データの読み込み・追加・削除を行うメソッドを追加します。`var body: some View {...}` の直後に追加します。

```swift
    // 【タブ一覧を読み込む関数】
    // データベースにある全タブを取得して、tabs 変数に入れる
    private func loadTabs() {
        tabs = ToDoTabService.getAllTabs(from: modelContext) // サービスに取得を頼む
    }

    // 【新しいタブを追加する関数】
    private func addTab() {
        guard !newTabName.isEmpty else { return } // 入力欄が空のままだったら、何もせずにここで終わる（空のタブを作らないため）

        let newTab = ToDoTab(name: newTabName) // 入力された名前で新しいタブを作る
        ToDoTabService.addTab(newTab, to: modelContext) // データベースに保存する

        newTabName = "" // 入力欄を空にして、次のタブ名を入れられるようにする
        loadTabs()      // データベースから最新の一覧を読み直して画面に反映する
    }
```

**データの読み込みと追加の流れ:**

- **`loadTabs()`**
  `ToDoTabService` を使ってデータベースに保存されているタブをすべて取り出し、`tabs` という箱に入れます。`tabs` が変わると、SwiftUIが自動的に画面を更新してくれます。

- **`addTab()`の処理フロー**
  1.  **`guard !newTabName.isEmpty else { return }`**: 入力欄が空のときは何もしないで終わります（空のタブが作られないようにするためのチェックです）。
  2.  **`ToDoTab(name: newTabName)`**: 入力した名前で新しいタブを作ります。
  3.  **`ToDoTabService.addTab(...)`**: 作ったタブをデータベースに保存します。
  4.  **`newTabName = ""`**: 入力欄を空にして、次に新しい名前が入力できるようにします。
  5.  **`loadTabs()`**: データベースから最新のタブ一覧を読み込んで、画面に表示します。

この「保存 → 再読み込み」という流れにすることで、画面に表示されるデータとデータベースの中身が必ず一致するようになります。

続けて、削除関連のメソッドも追加します。

```swift
// 【第1段階：スワイプで削除しようとしたときに呼ばれる関数】
// 実際にはまだ削除せず、確認アラートを表示するだけ
private func handleDelete(offsets: IndexSet) { // offsets には「何行目をスワイプしたか」の番号が入っている
    if let index = offsets.first {  // 先頭の1つだけ取り出す
        tabToDelete = tabs[index]   // 削除しようとしているタブを覚えておく
        showDeleteAlert = true       // true にするとアラートが表示される
    }
}

// 【第2段階：アラートで「削除」を押したときに呼ばれる関数】
// ここで初めて実際の削除が行われる
private func confirmDelete() {
    if let tabToDelete = tabToDelete { // tabToDelete に値が入っているか確認（nilでないことを確かめる）
        ToDoTabService.deleteTab(tabToDelete, from: modelContext) // データベースから削除
        loadTabs() // 削除後に一覧を読み直して画面を更新する
    }
}
```

**削除処理の2段階パターン:**

- **`handleDelete(offsets: IndexSet)`（第1段階：削除するタブを選ぶ）**
  - **`IndexSet`**: スワイプして削除しようとした行の「番号」が入っています。複数まとめて取得することもできますが、ここでは先頭の1つだけを使います。
  - **`tabToDelete = tabs[index]`**: 削除しようとしているタブを、いったん別の場所に覚えておきます。
  - **`showDeleteAlert = true`**: 確認メッセージ（アラート）を画面に表示します。

- **`confirmDelete()`（第2段階：実際に削除する）**
  アラートで「削除」ボタンを押したときに呼ばれます。さっき覚えておいたタブをデータベースから取り除き、`loadTabs()` で画面の一覧を更新します。

**なぜ2段階にするのか？**
間違えてタブを消してしまわないようにするためです。このアプリではタブを削除すると、そのタブに入っているタスクも全部一緒に消えてしまうので、「本当に消しますか？」という確認をはさむことがとても大切です。

## 4. プレビューの作成

最後に、ファイルの末尾にプレビュー用のコードを追加して動作を確認します。
```swift
// Xcodeのプレビュー画面で動作確認するためのコード（アプリ本体には影響しない）
#Preview {
    NavigationStack { // ナビゲーションバーを表示するために必要
        TabManageView()
            // inMemory: true → アプリを閉じると消えるテスト用のデータベースを使う
            .modelContainer(for: ToDoTab.self, inMemory: true)
    }
}
```

- `#Preview`: このブロック内に書いたコードがXcodeのプレビュー画面に表示されます。

  ※ このコードは、実際のアプリ本体には必須ではありませんが、プレビュー上で動作や状態変化を確認するためのテスト用ラッパーとして書かれています。  
  ※ 実行せずに確認できるようにしています。

---

## コード全体

```swift title="Views/TabmanageView.swift"
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
