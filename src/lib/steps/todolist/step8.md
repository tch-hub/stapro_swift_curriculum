---
title: ステップ8: タブのデータモデルを作る(ToDoTab.swift)
summary: タブ情報を保存するための「設計図」を作成します。
---

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

## 練習問題

このステップで学んだ **`@Model` / `final class` / `init` / シンプルなプロパティ定義** を使って、プロジェクト（フォルダ）のデータモデルを作ってみましょう。

新規プロジェクト（App）を作成し、`Project.swift` というファイルを追加してください。

1. **`Project` モデルの定義**  
   `@Model` を付けた `final class Project` を `Identifiable` に準拠させて定義してください。

2. **プロパティの定義**  
   以下の3つのプロパティをすべてデフォルト値つきで定義してください。  
   - `id: UUID`（デフォルト `UUID()`）  
   - `name: String`（プロジェクト名、デフォルト `""`）  
   - `createdAt: Date`（作成日時、デフォルト `Date()`）

3. **`init` の実装**  
   `name: String` だけを引数に取るイニシャライザを実装してください。  
   `createdAt` は自動で現在時刻を設定してください。

### 解答例

```swift title="Project.swift"
import Foundation
import SwiftData

@Model
final class Project: Identifiable {
    var id: UUID = UUID()
    var name: String = ""
    var createdAt: Date = Date()

    init(name: String) {
        self.name = name
        self.createdAt = Date()
    }
}
```
