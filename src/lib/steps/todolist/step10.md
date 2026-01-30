
<script>
    import {base} from '$app/paths';
</script>


```swift
import SwiftUI
import SwiftData

@main
struct ToDoListApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

このコードは、SwiftDataを使うための最小構成です。アプリのエントリーポイントを定義しています。

### 1. スキーマ（Schema）の定義

`struct ToDoListApp: App {`の下、`var body: some Scene {`の上に追加

```swift
let modelContainer: ModelContainer

init() {
    let schema = Schema([
        // ToDoTask.self,
        // ToDoTab.self
    ])
}
```

スキーマは、アプリで保存するデータの種類を指定します。ここでは`ToDoTask`と`ToDoTab`という2つのデータモデルを保存することを宣言しています。

### 2. モデル設定（ModelConfiguration）

`let schema = Schema([...])`の下に追加

```swift
let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
```

`ModelConfiguration`はデータベースの設定を行います。

- `schema`: 上で定義したスキーマを指定
- `isStoredInMemoryOnly: false`: ディスク（ストレージ）に保存することを指定します。`true`だとメモリのみで、アプリを閉じるとデータが消えます

### 3. モデルコンテナ（ModelContainer）の初期化

`let modelConfiguration = ...`の下に追加

```swift
do {
    modelContainer = try ModelContainer(for: schema, configurations: [modelConfiguration])
} catch {
    fatalError("Could not initialize ModelContainer: \(error)")
}
```

`ModelContainer`はSwiftDataのデータベース接続を管理します。

- `try`と`catch`で、初期化に失敗した場合のエラー処理をしています
- `fatalError`で、エラーが発生したらアプリを停止して原因を通知します

### 4. アプリ全体への適用

`var body: some Scene {}`内の`WindowGroup { ... }`に追加

```swift
.modelContainer(modelContainer)
```

`WindowGroup`に`.modelContainer()`を追加することで、アプリ全体でSwiftDataが使えるようになります

### コード全体 - ToDoListApp.swift

```swift title="ToDoListApp.swift"
import SwiftUI
import SwiftData

@main
struct ToDoListApp: App {
    let modelContainer: ModelContainer

    init() {
        let schema = Schema([
            // ToDoTask.self,
            // ToDoTab.self
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
