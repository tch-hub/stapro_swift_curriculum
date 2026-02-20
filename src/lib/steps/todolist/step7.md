# ステップ7: タスクのデータモデルを作る(ToDoTask.swift)

## 1. モデルの作成

`SwiftData/ToDoTask.swift` を開き、タスク情報を保存するためのデータモデルを作成します。  
`Foundation`とはSwiftの基盤となるフレームワークです。日付(Date)など、アプリ開発に欠かせない基本機能を提供します。  
`SwiftData`とはアプリ内にデータを永続的に保存するためのフレームワークです。  
SwiftDataを使うには、クラスに `@Model` を付けるだけでOKです。

以下のコードを記述してください。

```swift tite="SwiftData/ToDoTask.swift"
import Foundation
import SwiftData

// @Modelをつけることで、このクラスのデータがデータベースに保存できるようになる
@Model
final class ToDoTask: Identifiable {

    var id: UUID = UUID()
    // タスクごとに一意のID（識別子）
    var title: String = ""
    // タスクのタイトル
    var detail: String = ""
    // タスクの詳細メモ
    var isCompleted: Bool = false
    // 完了したかどうか
    var tabId: UUID = UUID()
    // どのタブ（リスト）に属しているかを紐付けるID
    var createdAt: Date = Date()
    // 作成日時

    // 新しいタスクを作成する時の初期設定
    init(title: String, detail: String, tabId: UUID) {

        self.title = title

        self.detail = detail

        self.isCompleted = false
        // 作成時は未完了状態にする

        self.tabId = tabId

        self.createdAt = Date()
        // 作成日時を現在時刻に設定
    }
}
```

このコードは、アプリのデータ（タスク情報）を保存・管理するための「設計図」です。詳しく解説します。

- **`@Model`**
  **SwiftData** の機能で、このクラスのデータを自動的にデータベースに保存できるようにする魔法のようなキーワード（マクロ）です。これをつけるだけで、複雑な保存処理を自動でやってくれます。

- **`final class ToDoTask`**
  タスク1つ1つのデータを表すクラスです。SwiftDataのモデルは必ず `class`（クラス）である必要があり、`final`（継承不可）をつけるのが推奨されています。
- `Identifiable` このクラスが `id` プロパティで一意に識別可能であることを示すプロトコルです。ForEachやListで各タスクを正確に管理するために書く必要があります。

- **各プロパティ（保存する項目）**
  - **`id`**: データを一意に識別するためのIDです。
  - **`title` / `detail`**: タスクの内容を保存する文字列です。
  - **`isCompleted`**: 完了したかどうかを管理します。
  - **`tabId`**: このタスクが「どのタブ（カテゴリー）」に入っているかを示すためのIDです。これをキーにして、タブごとの絞り込みを行います。

- **`init` (イニシャライザ)**
  新しいタスクデータを作る時に呼ばれます。タイトルやタブIDなど必要な情報を受け取り、初期状態（未完了、作成日時など）をセットします。
- **`self.`** 値を保存するために書く必要があります。

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
