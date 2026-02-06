# ステップ7: タスクのデータモデルを作る(ToDoTask.swift)

## 1. モデルの作成

`SwiftData/ToDoTask.swift` を開き、タスク情報を保存するためのデータモデルを作成します。
SwiftDataを使うには、クラスに `@Model` を付けるだけでOKです。

以下のコードを記述してください。

```swift
import Foundation
import SwiftData

// @Modelをつけることで、このクラスのデータがデータベースに保存できるようになる
@Model
final class ToDoTask: Identifiable {
    // タスクごとに一意のID（識別子）
    var id: UUID = UUID()
    // タスクのタイトル
    var title: String = ""
    // タスクの詳細メモ
    var detail: String = ""
    // 完了したかどうか
    var isCompleted: Bool = false
    // どのタブ（リスト）に属しているかを紐付けるID
    var tabId: UUID = UUID()
    // 作成日時
    var createdAt: Date = Date()

    // 新しいタスクを作成する時の初期設定
    init(title: String, detail: String, tabId: UUID) {
        self.title = title
        self.detail = detail
        // 作成時は未完了状態にする
        self.isCompleted = false
        self.tabId = tabId
        // 作成日時を現在時刻に設定
        self.createdAt = Date()
    }
}
```

このコードは、アプリのデータ（タスク情報）を保存・管理するための「設計図」です。詳しく解説します。

- **`@Model`**
  **SwiftData** の機能で、このクラスのデータを自動的にデータベースに保存できるようにする魔法のようなキーワード（マクロ）です。これをつけるだけで、複雑な保存処理を自動でやってくれます。

- **`final class ToDoTask`**
  タスク1つ1つのデータを表すクラスです。SwiftDataのモデルは必ず `class`（クラス）である必要があり、`final`（継承不可）をつけるのが推奨されています。

- **各プロパティ（保存する項目）**
  - **`id`**: データを一意に識別するためのIDです。
  - **`title` / `detail`**: タスクの内容を保存する文字列です。
  - **`isCompleted`**: 完了したかどうかを管理します。
  - **`tabId`**: このタスクが「どのタブ（カテゴリー）」に入っているかを示すためのIDです。これをキーにして、タブごとの絞り込みを行います。

- **`init` (イニシャライザ)**
  新しいタスクデータを作る時に呼ばれます。タイトルやタブIDなど必要な情報を受け取り、初期状態（未完了、作成日時など）をセットします。

---

## コード全体

```swift title="SwiftData/ToDoTask.swift"
import Foundation
import SwiftData

@Model
final class ToDoTask: Identifiable {
    var id: UUID = UUID()
    var title: String = ""
    var detail: String = ""
    var isCompleted: Bool = false
    var tabId: UUID = UUID()
    var createdAt: Date = Date()

    init(title: String, detail: String, tabId: UUID) {
        self.title = title
        self.detail = detail
        self.isCompleted = false
        self.tabId = tabId
        self.createdAt = Date()
    }
}
```

---

このステップでは「裏側の処理(データモデルの定義)」を作りました。画面には何も変化が現れませんが、次のステップ以降でこのモデルを使ってデータを保存・管理していきます。
