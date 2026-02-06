# ステップ14: SwiftDataの設定を行う(ToDoListApp.swift)

## 1. SwiftDataの構成

`ToDoListApp.swift` を開き、作成したデータモデル（`ToDoTask`, `ToDoTab`）をアプリ全体で使えるように設定します。

```swift
import SwiftUI
import SwiftData

@main
struct ToDoListApp: App {
    let modelContainer: ModelContainer

    init() {
        // 保存対象のデータモデルを定義
        let schema = Schema([
            ToDoTask.self,
            ToDoTab.self
        ])

        // データベースの設定（永続化を有効にするため isStoredInMemoryOnly: false）
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            // コンテナの初期化
            modelContainer = try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not initialize ModelContainer: \(error)")
        }
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        // 作成したコンテナをアプリ全体に適用
        .modelContainer(modelContainer)
    }
}
```

- `Schema`: どのクラスをデータベースのテーブルとして扱うかを定義します。
- `ModelContainer`: データの保存場所（データベース）の実体です。これを `.modelContainer` で渡すことで、アプリ内のどこからでもデータにアクセスできるようになります。

---

## コード全体

### ToDoListApp.swift

```swift
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
