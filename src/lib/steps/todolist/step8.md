# ステップ8: タブのデータモデルを作る(ToDoTab.swift)

## 1. モデルの作成

`SwiftData/ToDoTab.swift` を開き、タブ（リストのカテゴリー）情報を保存するためのデータモデルを作成します。
タスクと同様に `@Model` を使用します。

以下のコードを記述してください。

```swift
import Foundation
import SwiftData

// @Modelをつけることで、タブの情報もデータベースに保存できるようにする
@Model
final class ToDoTab: Identifiable {
    // タブごとの一意のID
    var id: UUID = UUID()
    // タブの名前
    var name: String = ""
    // 作成日時
    var createdAt: Date = Date()
    
    // 新しいタブを作成する時の初期設定
    init(name: String) {
        self.name = name
        // 作成日時を現在時刻に設定
        self.createdAt = Date()
    }
}
```

- `@Model`: このクラスをデータベースのテーブルとして扱うためのマークです。

---

## コード全体

### SwiftData/ToDoTab.swift

```swift
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
