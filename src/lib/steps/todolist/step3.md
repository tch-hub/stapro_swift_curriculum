# ステップ3: ToDoタスクモデルの作成

<script>
    import {base} from '$app/paths';
</script>

## データモデルとは

ToDoリストでは、各タスク（やることリストの1つ1つの項目）の情報を保存する必要があります。このデータを管理する仕組みを「データモデル」と呼びます。

## ToDoTask.swift の作成

`SwiftData/Models/`フォルダに`ToDoTask.swift`を作成し、以下のコードを記述します：

```swift
import Foundation
import SwiftData

// データモデルとしてマークするデコレータ
@Model
final class ToDoTask: Identifiable {
    var id: UUID = UUID()
    var title: String = ""
    var description: String = ""
    var isCompleted: Bool = false
    var tabId: UUID = UUID()
    var createdAt: Date = Date()

    init(title: String, description: String, tabId: UUID) {
        self.title = title
        self.description = description
        self.isCompleted = false
        self.tabId = tabId
        self.createdAt = Date()
    }
}
```

## 各プロパティの説明

| プロパティ    | 型     | 説明                       |
| ------------- | ------ | -------------------------- |
| `id`          | UUID   | タスクの一意な識別子       |
| `title`       | String | タスクのタイトル           |
| `description` | String | タスクの説明               |
| `isCompleted` | Bool   | タスクが完了したかどうか   |
| `tabId`       | UUID   | このタスクが属するタブのID |
| `createdAt`   | Date   | タスクが作成された日時     |

## @Model デコレータ

`@Model`を使うことで、このクラスをSwiftDataのデータモデルとして登録します。これにより、アプリを再起動しても数据が保存されます。

## 次のステップへ

次は、タスクを分類するための「タブ」を表すモデル`ToDoTab`を作成します。
