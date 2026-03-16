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

## 練習問題は必要ありません

このステップは**概念学習**に特化しているため、練習問題を用意していません。理由は以下の通りです。

- **@Modelの本来の機能が体験できない**: 練習問題では単ファイルで実装するため、SwiftDataの永続保存機能（@Modelの主要な役割）が実際には機能しません。

- **単なる構造体になってしまう**: 実行環境なしでは、@Modelをつけても通常のクラス定義と変わりなく見えてしまいます。

- **次のステップで実践的に学べる**: step9以降で、このモデルを使ったデータベース操作や複数モデルの関連付けを実装する際に、@Modelの本当の力が理解できます。

したがって、まずは「複数のモデル定義パターン」と「モデル間の関係性（`tabId`など）」をこのステップで理解した上で、次のステップに進んでください。
