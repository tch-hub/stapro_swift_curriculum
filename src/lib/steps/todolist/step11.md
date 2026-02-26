---
title: ステップ11: タブ操作のサービスを作る(ToDoTabService.swift)
summary: タブの追加・更新・削除をまとめます。
---

## 1. クラスの基本構造

`Services/ToDoTabService.swift` を開き、タブの追加・更新・削除などのロジックをまとめるクラスを作成します。

```swift
import Foundation
import SwiftData

class ToDoTabService {
    // ここに各メソッドを追加していきます
}
```

## 2. タブの追加と更新

データベースにタブを作成（insert）するメソッドとデータベースに保存されているタブの情報を更新（save）するメソッドを追加します。
`class ToDoTabService {` の中に記述してください。

```swift
    // タブを追加する
    @MainActor
    static func addTab(_ tab: ToDoTab, to modelContext: ModelContext) {
        modelContext.insert(tab)
        try? modelContext.save()
    }

    // タブの内容を更新する
    @MainActor
    static func updateTab(_ tab: ToDoTab, modelContext: ModelContext) {
        try? modelContext.save()
    }
```

- **`@MainActor`**
  「メインスレッド（画面描画を担当する場所）」で実行することを強制するマークです。このアプリでは`ContentView`で関数をつかうために書いています。

- **`static func`**
  関数を宣言しています。

- **メソッドのパラメータ（`_ task: ToDoTab, to modelContext: ModelContext`）**
  メソッドに渡す情報（引数）を指定しています。
  - `_ task: ToDoTab` ：関数内で使用する`tab`という変数に`ToDoTab`型（ステップ7で定義した型）を付けています。
  - `to modelContext: ModelContext` ：関数内で使用する`modelContext`という変数に`ModelContext`型(SwiftDataで用意されている型であるため覚える必要はありません)を付けています。

- **`ModelContext`**
  データベースとの「窓口」です。データの追加・削除・変更はすべてこのコンテキストを通して行います。

- **操作の流れ**
  1.  **`modelContext.insert(tab)`**: 新しいデータを「保存待ちリスト」に追加します。
  2.  **`try? modelContext.save()`**: 変更内容を実際にデータベースファイルに書き込みます。Swift のエラーハンドリング構文で「エラー内容は無視する」という意味になるので、仮にエラーが起こっても処理が止まらないようにしています。

## 3. タブの削除

データベースからタブの削除をする機能を追加します。
class ToDoTabService {...} の中の末尾に記述してください。

```swift
    // タブと、そのタブ内のタスクをすべて削除する
    @MainActor
    static func deleteTab(_ tab: ToDoTab, from modelContext: ModelContext) {
        // 先に中身のタスクを全削除（前回のステップで作ったメソッドを使用）
        ToDoTaskService.deleteAllTasks(for: tab.id, from: modelContext)

        // タブ自体を削除
        modelContext.delete(tab)
        try? modelContext.save()
    }
```

- **`@MainActor`**
  「メインスレッド（画面描画を担当する場所）」で実行することを強制するマークです。このアプリでは`ContentView`で関数をつかうために書いています。

- **`static func`**
  関数を宣言しています。

- **メソッドのパラメータ（`_ task: ToDoTab, to modelContext: ModelContext`）**
  メソッドに渡す情報（引数）を指定しています。
  - `_ task: ToDoTab` ：関数内で使用する`tab`という変数に`ToDoTab`型（ステップ7で定義した型）を付けています。
  - `to modelContext: ModelContext` ：関数内で使用する`modelContext`という変数に`ModelContext`型(SwiftDataで用意されている型であるため覚える必要はありません)を付けています。

- **`ModelContext`**
  データベースとの「窓口」です。データの追加・削除・変更はすべてこのコンテキストを通して行います。

- **操作の流れ**
  1.  **`ToDoTaskService.deleteAllTasks(for: tab.id, from: modelContext)`**：タブに紐づいているタスクを削除します。(`ToDoTaskService.deleteAllTasks`はステップ10で作成しました)
  2.  **`modelContext.delete(tab)`**： タブを削除します。
  3.  **`try? modelContext.save()`**： 変更内容を実際にデータベースファイルに書き込みます。

## 4. 全タブの取得

データベースに保存されている全てのタブを取得するメソッドを追加します。
class ToDoTabService {...} の中の末尾に記述してください。

```swift
    // すべてのタブを取得する
    @MainActor
    static func getAllTabs(from modelContext: ModelContext) -> [ToDoTab] {
        let descriptor = FetchDescriptor<ToDoTab>()

        return (try? modelContext.fetch(descriptor)) ?? []
        // 取得に失敗した場合は空配列を返す
    }
```

**全タブ取得の仕組み:**

- **`-> [ToDoTab]`**
  返ってくるデータの型を定義しています。矢印（`->`）は「結果として何が返ってくるのか」を指定する記号で今回は`toDoTab`が返ってきます。`ToDoTab`型はステップ8で定義しています。

- **`FetchDescriptor<ToDoTab>()`（条件なし）**
  条件を指定していません。つまり「全てのタブを取得してね」という指令書を作っているということです。

- **`try? modelContext.fetch(descriptor)`**
  指令書に従ってデータベースからタブを探すという命令です。成功したらタブのリストが返ってきます。

- **`?? []`（nil合体演算子）**
  もしデータベースエラーなど何か失敗して `nil`（何もない）という結果が返ってきたら、代わりに空のリスト `[]`（タブが0個）を返します。こうすることで、画面側でエラー処理を書かなくても安全に使えます。

---

## コード全体

```swift title="Services/ToDoTabService.swift"
import Foundation
import SwiftData

class ToDoTabService {
    @MainActor
    static func addTab(_ tab: ToDoTab, to modelContext: ModelContext) {
        modelContext.insert(tab)
        try? modelContext.save()
    }

    @MainActor
    static func updateTab(_ tab: ToDoTab, modelContext: ModelContext) {
        try? modelContext.save()
    }

    @MainActor
    static func deleteTab(_ tab: ToDoTab, from modelContext: ModelContext) {
        // まず、そのタブに含まれる全てのタスクを削除
        ToDoTaskService.deleteAllTasks(for: tab.id, from: modelContext)
        // その後でタブ自体を削除
        modelContext.delete(tab)
        try? modelContext.save()
    }

    @MainActor
    static func getAllTabs(from modelContext: ModelContext) -> [ToDoTab] {
        let descriptor = FetchDescriptor<ToDoTab>()
        return (try? modelContext.fetch(descriptor)) ?? []
    }
}
```

---

このステップでは「裏側の処理(ビジネスロジック)」を作りました。画面には何も変化が現れませんが、次のステップ以降でこのサービスを使ってデータを操作していきます。
