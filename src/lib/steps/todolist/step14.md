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

**SwiftDataの初期化の仕組み:**

- **`Schema`（スキーマ：データベースの設計図）**
  どのクラス（`@Model`がついたクラス）をデータベースのテーブルとして管理するかを定義します。ここでは `ToDoTask` と `ToDoTab` の2つを登録しています。これにより、SwiftDataがこれらのクラスの構造を理解し、適切なデータベーステーブルを自動生成します。

- **`ModelConfiguration`（データベースの設定）**
  データベースの動作を設定します。重要なのは `isStoredInMemoryOnly` パラメータです:
  - **`false`（本番用）**: データをディスク（ストレージ）に永続保存します。アプリを終了しても、次回起動時にデータが残ります。
  - **`true`（テスト用）**: データをメモリ上にのみ保存します。アプリを終了するとデータは消えます（プレビューやテストで使用）。

- **`ModelContainer`（データベースの実体）**
  実際のデータベースファイルを管理するコンテナです。`init()` で作成し、`modelContainer` プロパティに保存しています。

- **`do-catch` によるエラーハンドリング**
  データベースの初期化は失敗する可能性があります（ディスク容量不足、権限エラーなど）。`try` でエラーが発生する可能性のある処理を実行し、`catch` でエラーをキャッチします。ここでは `fatalError()` でアプリを強制終了させていますが、これはデータベースなしではアプリが動作できないためです。

- **`.modelContainer(modelContainer)`**
  作成したコンテナをアプリ全体に注入します。これにより、アプリ内のどのビューでも `@Environment(\.modelContext)` でデータベースにアクセスできるようになります。

**データの流れ:**

1. アプリ起動時に `init()` が実行される
2. `Schema` でデータモデルを登録
3. `ModelContainer` でデータベースを初期化
4. `.modelContainer()` でアプリ全体に共有
5. 各ビューで `@Environment(\.modelContext)` を使ってアクセス

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

---

このステップでは、アプリの裏側で使用する初期データの定義を行いました。見た目には変化はありませんが、次のステップでこのデータを使ってアプリを初期状態にセットアップしていきます。
