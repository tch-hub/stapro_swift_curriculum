# ステップ8: タブのデータモデルを作る(ToDoTab.swift)

## 1. モデルの作成

`SwiftData/ToDoTab.swift` を開き、タブ（リストのカテゴリー）情報を保存するためのデータモデルを作成します。
タスクと同様に `@Model` を使用します。

以下のコードを記述してください。

```swift title="SwiftData/ToDoTab.swift"
import Foundation
import SwiftData

// @Modelをつけることで、タブの情報もデータベースに保存できるようにする
@Model
final class ToDoTab: Identifiable {

    var id: UUID = UUID()
    // タブごとの一意のID
    var name: String = ""
    // タブの名前
    var createdAt: Date = Date()
    // 作成日時

    // 新しいタブを作成する時の初期設定
    init(name: String) {
        self.name = name

        self.createdAt = Date()
        // 作成日時を現在時刻に設定
    }
}
```

タスクのモデル（`ToDoTask`）と似ていますが、こちらは「タブ」そのものの設計図です。

- **`@Model`**
  これもSwiftDataの管理対象にするためのマークです。「タブ」のデータもデータベースに保存したいので、クラスにこのマークを付けます。

- **`final class ToDoTab`**
  タブ1つ分のデータを表します（例：「買い物リスト」「仕事用」など）。

- **各プロパティ**
  - **`id`**: どのタブかを識別するためのIDです。タスク側の `tabId` と照らし合わせるために使います。
  - **`name`**: タブの表示名です。
  - **`createdAt`**: タブを作った日時です。タブの並び替え（作成順など）に使うことができます。

- **`init`**
  タブを作る時は「名前」だけ指定すれば、あとは自動でIDや作成日時が決まるようにしています。

---

## コード全体

```swift title="SwiftData/ToDoTab.swift"
import Foundation
import SwiftData

@Model
final class ToDoTab: Identifiable {
    var id: UUID = UUID()
    var name: String = ""
    var createdAt: Date = Date()

    init(name: String) {
        self.name = name
        self.createdAt = Date()
    }
}
```

---

このステップでは「裏側の処理(データモデルの定義)」を作りました。画面には何も変化が現れませんが、次のステップ以降でこのモデルを使ってデータを保存・管理していきます。
