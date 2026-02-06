# ステップ11: タブ操作のサービスを作る(ToDoTabService.swift)

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

タブの作成（insert）と更新（save）を行うメソッドを追加します。
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

## 3. タブの削除

タブの削除機能を追加します。
**重要**: タブを削除する際、そのタブに関連付いているタスクも全て削除する必要があります。

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

**タブ削除の重要なポイント:**

- **なぜタスクを先に削除するのか？**
  タブとタスクは「親子関係」にあります（タスクは `tabId` でタブを参照）。親（タブ）を先に削除してしまうと、子（タスク）が「存在しないタブを参照している」という不整合な状態になってしまいます。これを防ぐため、先に子（タスク）を全削除してから親（タブ）を削除します。これを「カスケード削除（連鎖削除）」と呼びます。

- **他のサービスのメソッドを呼び出す**
  `ToDoTaskService.deleteAllTasks()` を使うことで、コードの重複を避けています。「タブに紐づくタスクを全削除」というロジックは既に実装済みなので、それを再利用しています。

## 4. 全タブの取得

保存されている全てのタブを取得するメソッドを追加します。

```swift
    // すべてのタブを取得する
    @MainActor
    static func getAllTabs(from modelContext: ModelContext) -> [ToDoTab] {
        let descriptor = FetchDescriptor<ToDoTab>()
        // 取得に失敗した場合は空配列を返す
        return (try? modelContext.fetch(descriptor)) ?? []
    }
```

**全タブ取得の仕組み:**

- **`FetchDescriptor<ToDoTab>()`（条件なし）**
  前のステップでは `#Predicate` で条件を指定しましたが、ここでは条件を指定していません。これは「全てのタブを取得する」という意味になります。

- **`?? []`（nil合体演算子）**
  `fetch()` が失敗した場合（データベースエラーなど）、`nil` が返ってきます。その場合は空の配列 `[]` を返すことで、「タブが0個」として扱えるようにしています。これにより、呼び出し側でエラー処理を書かなくても安全に使えます。

---

## コード全体

### Services/ToDoTabService.swift

```swift
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
