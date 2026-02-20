# ステップ10: タスク操作のサービスを作る(ToDoTaskService.swift)

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

タスクの作成（insert）と更新（save）を行うメソッドを追加します。
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

- **`ModelContext`**
  データベースとの「窓口」です。データの追加・削除・変更はすべてこのコンテキストを通して行います。

- **操作の流れ**
  1.  **`context.insert(task)`**: 新しいデータを「保存待ちリスト」に追加します。
  2.  **`try? context.save()`**: 変更内容を実際にデータベースファイルに書き込みます。エラーが起きてもアプリが落ちないように `try?` をつけています。

## 3. タスクの削除

タスクの削除機能を追加します。
個別の削除と、タブごとの一括削除を用意します。

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

**一括削除の仕組み（`deleteAllTasks`）の解説:**

1.  **`#Predicate { $0.tabId == tabId }`**:
    「条件」を作るための機能です。「タスクの `tabId` が、引数で渡された `tabId` と同じもの」だけを対象にする、というフィルターを定義しています。

2.  **`FetchDescriptor`**:
    「データの探し方」をまとめた設定書です。先ほどの条件（Predicate）をセットして、「この条件に合うタスクを探してきて！」という命令を作ります。

3.  **`modelContext.fetch(descriptor)`**:
    設定書（descriptor）に基づいて、実際にデータベースからデータを探してきます。見つかったデータは配列（リスト）として返ってきます。

4.  **`tasks.forEach { ... }`**:
    見つかったタスクを1つずつ順番に `delete`（削除予約）していきます。最後に `save()` することで、まとめて削除が実行されます。

## 4. 完了状態の切り替え

タスクの完了/未完了を切り替えるメソッドを追加します。

```swift
    // 完了状態を切り替える
    @MainActor
    static func toggleTaskCompletion(_ task: ToDoTask, modelContext: ModelContext) {
        task.isCompleted.toggle()
        try? modelContext.save()
    }
```

**完了状態の切り替えの仕組み:**

- **`task.isCompleted.toggle()`**:
  `Bool`型（true/false）の値を反転させる便利なメソッドです。`true` なら `false` に、`false` なら `true` に切り替わります。

- **なぜ `save()` だけで更新できるのか？**
  SwiftDataは「オブジェクトの変更を自動追跡」してくれます。つまり、`task.isCompleted` を変更した時点で「このデータが変わった」と認識され、`save()` を呼ぶだけで変更がデータベースに反映されます。`update()` のような特別なメソッドは不要です。

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
    static func toggleTaskCompletion(_ task: ToDoTask, modelContext: ModelContext) {
        task.isCompleted.toggle()
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
}
```

---

このステップでは「裏側の処理（ビジネスロジック）」を作りました。画面には何も変化が現れませんが、次のステップ以降でこのサービスを使ってデータを操作していきます。
