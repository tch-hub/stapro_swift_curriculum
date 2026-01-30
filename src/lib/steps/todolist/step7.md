# ステップ7: タスクのデータモデルを作る

SwiftData を使ってタスク情報を保存するためのモデルを作成します。

### 1. モデルの基本構造

```swift
import Foundation
import SwiftData

@Model
final class ToDoTask: Identifiable {
}
```

`@Model` を付けることで、SwiftData の保存対象になります。

### 2. 変数の定義

```swift
var id: UUID = UUID()
var title: String = ""
var detail: String = ""
var isCompleted: Bool = false
var tabId: UUID = UUID()
var createdAt: Date = Date()
```

- `id` は一意のIDです。
- `title` はタスク名です。
- `detail` は詳細説明です。
- `isCompleted` は完了状態です。
- `tabId` は所属タブのIDです。
- `createdAt` は作成日時です。

### 3. 初期化

```swift
init(title: String, detail: String, tabId: UUID) {
    self.title = title
    self.detail = detail
    self.isCompleted = false
    self.tabId = tabId
    self.createdAt = Date()
}
```

---

## コード全体

```swift
import Foundation
import SwiftData

// データモデルとしてマークするデコレータ
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