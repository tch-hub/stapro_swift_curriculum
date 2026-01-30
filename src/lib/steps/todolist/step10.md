# ステップ10: SwiftData の設定を行う

アプリ全体で SwiftData を使えるように `ModelContainer` を設定します。

### 1. スキーマの作成

```swift
let schema = Schema([
    ToDoTask.self,
    ToDoTab.self
])
```

保存するモデルをまとめます。

### 2. ModelContainer の初期化

```swift
let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
modelContainer = try ModelContainer(for: schema, configurations: [modelConfiguration])
```

- `isStoredInMemoryOnly: false` にすると、アプリを閉じてもデータが残ります。

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
