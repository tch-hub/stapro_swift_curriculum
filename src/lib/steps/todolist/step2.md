# ステップ2: SwiftData環境の準備

<script>
    import {base} from '$app/paths';
</script>

## SwiftDataとは

SwiftDataは、iOSアプリ内でデータを永続化するための仕組みです。データベースのようなもので、アプリを再起動してもデータが保存されます。

## ToDoListApp.swiftの修正

SwiftDataを使うために、`ToDoListApp.swift`を以下のように修正します：

```swift
import SwiftUI
import SwiftData

@main
struct ToDoListApp: App {
    let modelContainer: ModelContainer

    init() {
        // SwiftDataのスキーマを定義
        let schema = Schema([
            ToDoTask.self,
            ToDoTab.self
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            modelContainer = try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not initialize ModelContainer: \(error)")
        }
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(modelContainer)
    }
}
```

## 各部分の説明

- `Schema`: どのようなデータを保存するかを指定します。ここでは`ToDoTask`と`ToDoTab`を指定しています
- `ModelConfiguration`: データベースの設定です。`isStoredInMemoryOnly: false`で、ディスクに保存されます
- `ModelContainer`: SwiftDataのコンテナで、データベース接続を管理します
- `.modelContainer(modelContainer)`: アプリ全体でSwiftDataを使えるようにする設定です

## 次のステップへ

次はデータモデルの`ToDoTask`と`ToDoTab`を作成します。
