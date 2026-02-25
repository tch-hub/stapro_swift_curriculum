# ステップ14: SwiftDataの設定を行う(ToDoListApp.swift)

> ステップ1では `ToDoListApp.swift` にまず最低限のコード（`ContentView` を表示するだけ）を書きました。
> このステップでは、作成したデータモデル（`ToDoTask`, `ToDoTab`）をアプリ全体で使えるように、**SwiftDataの設定を追加**します。

## 1. SwiftDataの設定を追加する

`ToDoListApp.swift` を開いて、以下のコードに書き換えてください。

```swift
import SwiftUI
import SwiftData

@main
struct ToDoListApp: App {
    let modelContainer: ModelContainer

    init() {
        // 保存するデータの種類を登録する
        let schema = Schema([
            ToDoTask.self,
            ToDoTab.self
        ])

        // データベースの設定（アプリを閉じてもデータを残す）
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            // データベースを作成する
            modelContainer = try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not initialize ModelContainer: \(error)")
        }
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        // 作ったデータベースをアプリ全体で使えるようにする
        .modelContainer(modelContainer)
    }
}
```

**ステップ1から追加した部分:**

| 追加した内容 | 説明 |
|---|---|
| `let modelContainer: ModelContainer` | データベースを管理する変数を用意する |
| `init()` | アプリ起動時に最初に実行される処理 |
| `Schema` | どのデータを保存対象にするかを登録する設定 |
| `ModelConfiguration` | データベースの動き方を設定する |
| `ModelContainer` | 実際のデータベースを作る |
| `.modelContainer(modelContainer)` | データベースをアプリ全体に共有する |

---

**各パーツの説明:**

- **`Schema`（スキーマ：データベースの設計図）**
  どのクラス（`@Model` がついたクラス）をデータとして管理するかを登録します。ここでは `ToDoTask`（タスク）と `ToDoTab`（タブ）の2つを登録しています。

- **`ModelConfiguration`（データベースの設定）**
  データベースの動き方を決めます。`isStoredInMemoryOnly` が大事なポイントです。
  - **`false`（本番用）**: アプリを閉じてもデータが残ります。
  - **`true`（テスト用）**: アプリを閉じるとデータが消えます。

- **`ModelContainer`（データベースの本体）**
  実際にデータを保存・管理するデータベースです。`init()` の中で作成します。

- **`do-catch` によるエラー処理**
  データベースの作成に失敗することがあります（容量不足など）。`try` で失敗するかもしれない処理を実行し、失敗したら `catch` でエラーをキャッチします。データベースが使えないとアプリが動かないので、`fatalError()` で強制終了させています。

- **`.modelContainer(modelContainer)`**
  作ったデータベースをアプリ全体で共有します。これにより、どのビューからでも `@Environment(\.modelContext)` を使ってデータにアクセスできます。

**処理の流れ（まとめ）:**

1. アプリ起動 → `init()` が実行される
2. `Schema` でデータの種類を登録
3. `ModelContainer` でデータベースを作成
4. `.modelContainer()` でアプリ全体に共有
5. 各画面で `@Environment(\.modelContext)` を使ってアクセス

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

このステップでは、アプリの裏側で使うデータベースの設定を行いました。見た目には変化はありませんが、次のステップでこのデータを使ってアプリの初期状態をセットアップしていきます。
