# ステップ4: ToDoタブモデルの作成

<script>
    import {base} from '$app/paths';
</script>

## タブとは

ToDoリストを複数のカテゴリに分類するために「タブ」を使います。例えば、「仕事」「プライベート」「買い物」など、異なるカテゴリでやることをまとめます。

## ToDoTab.swift の作成

`SwiftData/Models/`フォルダに`ToDoTab.swift`を作成し、以下のコードを記述します：

```swift
import Foundation
import SwiftData

@Model
final class ToDoTab {
    var id: UUID = UUID()
    var name: String = ""
    var createdAt: Date = Date()

    init(name: String) {
        self.name = name
        self.createdAt = Date()
    }
}
```

## 各プロパティの説明

| プロパティ  | 型     | 説明                                 |
| ----------- | ------ | ------------------------------------ |
| `id`        | UUID   | タブの一意な識別子                   |
| `name`      | String | タブの名前（例：「仕事」「買い物」） |
| `createdAt` | Date   | タブが作成された日時                 |

## タスクとタブの関係

- 1つのタブに複数のタスクが属することができます
- 各タスク（`ToDoTask`）は`tabId`プロパティで、どのタブに属するかを指定しています
- これによって、タブごとにタスクを管理することができます

## 次のステップへ

次は、これらのモデルを操作するための「サービス」を作成します。
