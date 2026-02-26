---
title: ステップ10: タスク操作のサービスを作る(ToDoTaskService.swift)
summary: タスクの追加・更新・削除・完了切り替えをまとめます。
---

## 1. クラスの基本構造

`Services/ToDoTaskService.swift` を開き、タスクの追加・更新・削除などのロジックをまとめるクラスを作成します。

```swift title="Services/ToDoTaskService.swift"
import Foundation
import SwiftData

class ToDoTaskService {
    // ここに各メソッドを追加していきます
}
```

## 2. タスクの追加と更新

データベースにタスクを作成するメソッドと（insert）とデータベースに保存されているタスクの情報を更新するメソッド（save）を追加します。
`class ToDoTaskService {` の中に記述してください。

```swift title="Services/ToDoTaskService.swift"
    // タスクを追加する
    @MainActor
    static func addTask(_ task: ToDoTask, to modelContext: ModelContext) {
        modelContext.insert(task)
        // 変更を保存
        try? modelContext.save()
    }

    // タスクを更新する
    @MainActor
    static func updateTask(_ task: ToDoTask, modelContext: ModelContext) {
        try? modelContext.save()
    }
```

このコードで登場する重要なキーワードについて解説します。

- **`@MainActor`**
  「メインスレッド（画面描画を担当する場所）」で実行することを強制するマークです。このアプリでは`ContentView`で関数をつかうために書いています。

- **`static func`**
  関数を宣言しています。

- **メソッドのパラメータ（`_ tab: ToDoTask, to modelContext: ModelContext`）**
  メソッドに渡す情報（引数）を指定しています。
  - `_ task: ToDoTask` ：関数内で使用する`task`という変数に`ToDoTask`型（ステップ7で定義した型）を付けています。
  - `to modelContext: ModelContext` ：関数内で使用する`modelContext`という変数に`ModelContext`型(SwiftDataで用意されている型であるため覚える必要はありません)を付けています。

- **`ModelContext`**
  データベースとの「窓口」です。データの追加・削除・変更はすべてこのコンテキストを通して行います。

- **操作の流れ**
  1.  **`modelContext.insert(task)`**: 新しいデータを「保存待ちリスト」に追加します。
  2.  **`try? modelContext.save()`**: 変更内容を実際にデータベースファイルに書き込みます。Swift のエラーハンドリング構文で「エラー内容は無視する」という意味になるので、仮にエラーが起こっても処理が止まらないようにしています。

## 3. タスクの削除

データベースからタスクの削除をする機能を追加します。
個別の削除と、タブごとの一括削除を用意します。

class ToDoTaskService {...} の中の末尾に記述してください。

```swift title="Services/ToDoTaskService.swift"
    // タスクを削除する
    @MainActor
    static func deleteTask(_ task: ToDoTask, from modelContext: ModelContext) {
        modelContext.delete(task)
        try? modelContext.save()
    }

    // 特定のタブ内のタスクをすべて削除する（タブ削除時などに使用）
    @MainActor
    static func deleteAllTasks(for tabId: UUID, from modelContext: ModelContext) {
        // 条件（tabIdが一致）に合うタスクを探す設定
        let descriptor = FetchDescriptor<ToDoTask>(predicate: #Predicate { $0.tabId == tabId })

        // 取得して削除
        if let tasks = try? modelContext.fetch(descriptor) {
            tasks.forEach { modelContext.delete($0) }
            try? modelContext.save()
        }
    }
```

- **`@MainActor`**
  「メインスレッド（画面描画を担当する場所）」で実行することを強制するマークです。このアプリでは`ContentView`で関数をつかうために書いています。

- **`static func`**
  関数を宣言しています。

- **メソッドのパラメータ（`_ tab: ToDoTask, from modelContext: ModelContext`）**
  メソッドに渡す情報（引数）を指定しています。
  - `_ task: ToDoTask` ：関数内で使用する`task`という変数に`ToDoTask`型（ステップ7で定義した型）を付けています。
  - `to modelContext: ModelContext` ：関数内で使用する`modelContext`という変数に`ModelContext`型(SwiftDataで用意されている型であるため覚える必要はありません)を付けています。

- **`ModelContext`**
  データベースとの「窓口」です。データの追加・削除・変更はすべてこのコンテキストを通して行います。

**一括削除の仕組み（`deleteAllTasks`）の解説:**

1.  **`#Predicate { $0.tabId == tabId }`**:
    「どれを削除するのか」という条件です。「このタブID（`$0.tabId`）に属するタスク」という指定をしています。

2.  **`FetchDescriptor`**:
    「データの探し方」をまとめた説明書です。先ほどの条件をセットして、「この条件に合うタスクを探してね」という指令書を作ります。

3.  **`modelContext.fetch(descriptor)`**:
    説明書に従って、実際にデータベースからタスクを探します。見つかったデータは全部リスト（配列）として返ってきます。

4.  **`tasks.forEach { ... }`**:
    見つかったタスクを1つずつ順番に `delete`（削除マーク）していきます。最後に `save()` することで、実際に削除が確定します。

## 4. 完了状態の切り替え

データベースに保存されているタスクの完了/未完了を切り替えるメソッドを追加します。
class ToDoTaskService {...} の中の末尾に記述してください。

```swift title="Services/ToDoTaskService.swift"
    // 完了状態を切り替える
    @MainActor
    static func toggleTaskCompletion(_ task: ToDoTask, modelContext: ModelContext) {
        task.isCompleted.toggle()
        try? modelContext.save()
    }
```

- **`task.isCompleted.toggle()`**:
  `Bool`型（true/false）の値を反転させる便利なメソッドです。`true` なら `false` に、`false` なら `true` に切り替わります。

---

## コード全体

```swift title="Services/ToDoTaskService.swift"
import Foundation
import SwiftData

class ToDoTaskService {
    @MainActor
    static func addTask(_ task: ToDoTask, to modelContext: ModelContext) {
        modelContext.insert(task)
        try? modelContext.save()
    }

    @MainActor
    static func updateTask(_ task: ToDoTask, modelContext: ModelContext) {
        try? modelContext.save()
    }

    @MainActor
    static func deleteTask(_ task: ToDoTask, from modelContext: ModelContext) {
        modelContext.delete(task)
        try? modelContext.save()
    }

    @MainActor
    static func deleteAllTasks(for tabId: UUID, from modelContext: ModelContext) {
        let descriptor = FetchDescriptor<ToDoTask>(predicate: #Predicate { $0.tabId == tabId })
        if let tasks = try? modelContext.fetch(descriptor) {
            tasks.forEach { modelContext.delete($0) }
            try? modelContext.save()
        }
    }

    @MainActor
    static func toggleTaskCompletion(_ task: ToDoTask, modelContext: ModelContext) {
        task.isCompleted.toggle()
        try? modelContext.save()
    }
}
```

---

このステップでは「裏側の処理（ビジネスロジック）」を作りました。画面には何も変化が現れませんが、次のステップ以降でこのサービスを使ってデータを操作していきます。
