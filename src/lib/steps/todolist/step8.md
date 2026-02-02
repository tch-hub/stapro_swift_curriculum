# ステップ8: タブのデータモデルを作る(ToDoTab.swift)

タブ情報を保存するためのモデルを作成します。
ステップ1で作成した `SwiftData/ToDoTab.swift` を編集します。

### 1. モデルの基本構造

```swift
import Foundation
import SwiftData

// @Modelをつけることで、タブの情報もデータベースに保存できるようにする
@Model
final class ToDoTab: Identifiable {
}
```

### 2. 変数の定義

```swift
// タブごとの一意のID
var id: UUID = UUID()
// タブの名前
var name: String = ""
// 作成日時
var createdAt: Date = Date()
```

タブを管理するために必要な ID と 名前、作成日時を定義しています。  
`@Model` がついているため、これらのプロパティは自動的にデータベースのカラムとして扱われます。

### 3. 初期化

```swift
// 新しいタブを作成する時の初期設定
init(name: String) {
    self.name = name
    // 作成日時を現在時刻に設定
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
