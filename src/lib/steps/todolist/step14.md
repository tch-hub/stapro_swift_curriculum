# ステップ?: SwiftData の設定を行う

アプリ全体で SwiftData を使えるように `ModelContainer` を設定します。

### 1. スキーマの作成

```swift
// 保存対象のデータモデル（ToDoTaskとToDoTab）を定義
let schema = Schema([
    ToDoTask.self,
    ToDoTab.self
])
```

SwiftData で扱うデータモデルのクラス（`ToDoTask` と `ToDoTab`）を `Schema` に登録して、データベースの構造を定義しています。

### 2. ModelContainer の初期化

```swift
// モデルの設定（永続的に保存するため、メモリ内のみの保存は false に設定）
let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
// 設定に基づいて ModelContainer を作成
modelContainer = try ModelContainer(for: schema, configurations: [modelConfiguration])
```

`ModelConfiguration` でデータベースの動作設定を行います。  
`isStoredInMemoryOnly: false` に設定することで、アプリを終了してもデータが消えずにファイルとして保存されるようにしています。  
最後に、この設定を使って `ModelContainer`（データベースの実体）を初期化します。

---

## コード全体

```swift title="ToDoListApp.swift"
// ToDoListApp.swift
import SwiftUI
import SwiftData

@main
struct ToDoListApp: App {
    let modelContainer: ModelContainer

    init() {
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
