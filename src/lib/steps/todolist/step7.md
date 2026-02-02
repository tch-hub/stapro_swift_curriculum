# ステップ7: タスクのデータモデルを作る(ToDoTask.swift)

SwiftData を使ってタスク情報を保存するためのモデルを作成します。
ステップ1で作成した `SwiftData/ToDoTask.swift` を編集します。

### 1. モデルの基本構造

```swift
import Foundation
import SwiftData

// @Modelをつけることで、このクラスのデータがデータベースに保存できるようになる
@Model
final class ToDoTask: Identifiable {
}
```

クラス定義の前に `@Model` マクロを記述するだけで、SwiftData がこのクラスをデータベースのテーブル定義として認識し、保存や読み込みができるようになります。

### 2. 変数の定義

```swift
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
```

タスク管理に必要な情報をプロパティ（変数）として定義しています。  
それぞれの変数には初期値を設定しておくのが一般的です。  
`tabId` は、後で作成する「タブ（カテゴリー）」とタスクを紐付けるために使います。

### 3. 初期化

```swift
// 新しいタスクを作成する時の初期設定
init(title: String, detail: String, tabId: UUID) {
    self.title = title
    self.detail = detail
    // 作成時は未完了状態にする
    self.isCompleted = false
    self.tabId = tabId
    // 作成日時を現在時刻に設定 false
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
