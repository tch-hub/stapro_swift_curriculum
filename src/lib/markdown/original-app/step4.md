---
title: ステップ4: データモデルの実装
summary: SwiftDataでデータモデルとサービスクラスを実装する
---

アプリで「保存したい情報」をSwiftDataのモデルとして定義します。  
ここが完成すると、アプリのデータが端末に永続保存されるようになります。

---

## 1. データモデルの設計を確認する

ステップ1で決めた「保存するデータ」をSwiftのコードに落とし込みます。

| 情報の種類                | Swiftの型        |
| ------------------------- | ---------------- |
| 文字（名前・タイトル等）  | `String`         |
| 数値（回数・点数等）      | `Int` / `Double` |
| 真偽（完了した/しない等） | `Bool`           |
| 日付・時刻                | `Date`           |
| 複数の選択肢              | `enum`           |

---

## 2. データモデルを実装する

```swift
import Foundation
import SwiftData

@Model
final class 〇〇Model: Identifiable {
    var id: UUID = UUID()
    var title: String = ""
    var isCompleted: Bool = false
    var createdAt: Date = Date()

    init(title: String) {
        self.title = title
        self.isCompleted = false
        self.createdAt = Date()
    }
}
```

> 💡 ヒント: ToDoリストアプリの `ToDoTask.swift` と同じ構造です。  
> 検索バーで「@Model」と検索して確認しましょう。

---

## 3. ModelContainerの設定

`〇〇App.swift` を更新して、SwiftDataが使えるようにします。

> 💡 検索バーで「ModelContainer」と検索して、ToDoListApp.swiftの実装を参考にしてください。

---

## 4. サービスクラスを作る

データの追加・削除・更新をまとめたクラスを作ります。

```swift
import Foundation
import SwiftData

class 〇〇Service {
    // データを追加する
    @MainActor
    static func add(_ item: 〇〇Model, to modelContext: ModelContext) {
        modelContext.insert(item)
        try? modelContext.save()
    }

    // データを削除する
    @MainActor
    static func delete(_ item: 〇〇Model, from modelContext: ModelContext) {
        modelContext.delete(item)
        try? modelContext.save()
    }

    // データを更新する（プロパティを変えた後に呼ぶ）
    @MainActor
    static func update(modelContext: ModelContext) {
        try? modelContext.save()
    }
}
```

> 💡 ヒント: ToDoリストアプリの `ToDoTaskService.swift` と同じパターンです。  
> 検索バーで「ToDoTaskService」または「static func addTask」と検索して確認しましょう。

---

## 🔍 詰まったときの検索キーワード

| 困ったこと                 | 検索キーワード                                |
| -------------------------- | --------------------------------------------- |
| データモデルの書き方       | 「@Model」「final class」                     |
| SwiftDataの設定            | 「ModelContainer」「Schema」                  |
| データの保存・取得         | 「modelContext.insert」「modelContext.fetch」 |
| データの種類（型）の一覧   | 「String」「Int」「Bool」「Date」             |
| 複数のモデルを関連付けたい | 「tabId」「UUID」                             |

---

## ⚠️ よくあるミス

- `@Model` は `class` にしか使えません（`struct` は使えない）
- SwiftDataを使う場合は `import SwiftData` を忘れずに
- `ModelContainer` に登録していないモデルはデータが保存されません
