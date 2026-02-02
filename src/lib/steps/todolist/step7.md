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

- `@Model`: このクラスをデータベースのテーブルとして扱うためのマークです。
- `tabId`: タスクがどのタブ（カテゴリー）に属しているかを管理するために使います。

---

## コード全体

### SwiftData/ToDoTask.swift

```swift
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
