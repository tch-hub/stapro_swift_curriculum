# ステップ8: タブのデータモデルを作る

タブ情報を保存するためのモデルを作成します。

### 1. モデルの基本構造

```swift
import Foundation
import SwiftData

@Model
final class ToDoTab: Identifiable {
}
```

### 2. 変数の定義

```swift
var id: UUID = UUID()
var name: String = ""
var createdAt: Date = Date()
```

- `id` は一意のIDです。
- `name` はタブ名です。
- `createdAt` は作成日時です。

### 3. 初期化

```swift
init(name: String) {
    self.name = name
    self.createdAt = Date()
}
```

---

## コード全体

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
