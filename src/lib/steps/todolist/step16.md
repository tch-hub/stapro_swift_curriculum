# ステップ16: 起動時の初期化を行う(ContentView.swift)

## 1. 基本変数の追加

`Views/ContentView.swift` を開き、初期化状態を管理する変数などを追加します。

```swift
import SwiftUI
import SwiftData

struct ContentView: View {
    // データ操作用
    @Environment(\.modelContext) private var modelContext

    // 初期化が完了したかどうかを管理するフラグ
    @State private var isInitialized: Bool

    // 自動初期化を行うかどうか（プレビュー用などではfalseにできるように）
    private let autoInitialize: Bool

    // 初期化（イニシャライザ）
    init(isInitialized: Bool = false, autoInitialize: Bool = true) {
        _isInitialized = State(initialValue: isInitialized)
        self.autoInitialize = autoInitialize
    }

    var body: some View {
        // ... (次の手順で実装します)
        Text("Loading...")
    }
}
```

**初期化状態管理の仕組み:**

- **`@State private var isInitialized: Bool`**
  アプリの初期化が完了したかどうかを管理するフラグです。`false` の間はローディング画面を表示し、`true` になったらメイン画面を表示します。

- **`private let autoInitialize: Bool`**
  自動で初期化処理を実行するかどうかを制御します。本番では `true`、プレビューでは `false` にすることで、プレビュー時に初期化処理をスキップできます。

- **カスタムイニシャライザ（`init`）**
  SwiftUIのビューは通常、イニシャライザを書く必要がありませんが、`@State` 変数に初期値を外部から渡したい場合は、カスタムイニシャライザが必要です。
  - **`_isInitialized = State(initialValue: isInitialized)`**
    `@State` のラッパーに直接アクセスするには、変数名の前に `_` をつけます。`State(initialValue:)` で初期値を設定しています。
  - **デフォルト引数**
    `isInitialized: Bool = false` のように、引数にデフォルト値を設定することで、呼び出し側で省略できるようにしています。本番では `ContentView()` と引数なしで呼べます。

## 2. 画面表示の切り替え

`body` の中身を実装します。
初期化が完了していればメイン画面へ、まだならローディング画面を表示するようにします。

```swift
    var body: some View {
        if isInitialized {
            // 初期化完了：メインの画面遷移へ
            MainStack()
        } else {
            // 初期化中：ローディング表示
            VStack {
                Text("アプリを準備中...")
                ProgressView()
            }
            .onAppear {
                // 画面が表示されたら初期化処理を開始
                if !autoInitialize { return }

                // 1秒待ってから処理開始（ローディングを見せるため）
                DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                    initializeAppIfNeeded()
                    isInitialized = true
                }
            }
        }
    }
```

**画面切り替えと非同期初期化の仕組み:**

- **条件分岐による画面切り替え**

  ```swift
  if isInitialized {
      MainStack()  // 初期化完了後の画面
  } else {
      VStack { ... }  // ローディング画面
  }
  ```

  `isInitialized` の値によって、表示するビューを切り替えています。SwiftUIは状態が変わると自動的に画面を再描画するため、`isInitialized` が `true` になった瞬間に `MainStack()` に切り替わります。

- **`ProgressView()`**
  くるくる回るローディングインジケーターを表示します。ユーザーに「処理中」であることを視覚的に伝えます。

- **`.onAppear { ... }`**
  ビューが画面に表示された時に1度だけ実行される処理です。ここで初期化処理を開始します。

- **`DispatchQueue.main.asyncAfter(deadline: .now() + 1)`**
  メインスレッドで、1秒後に処理を実行します。
  - **なぜ1秒待つのか？**: ローディング画面を一瞬だけ表示して即座に消えると、ユーザーが「何が起きたのか」分からなくなります。1秒待つことで、ローディング画面を見せる時間を確保しています。
  - **メインスレッド（`main`）**: UI更新はメインスレッドで行う必要があるため、`DispatchQueue.main` を使います。

- **初期化の流れ**
  1. アプリ起動 → `isInitialized = false` → ローディング画面表示
  2. `.onAppear` が実行される
  3. 1秒待つ
  4. `initializeAppIfNeeded()` でデータベースに初期データを投入
  5. `isInitialized = true` に変更
  6. SwiftUIが自動的に `MainStack()` に切り替える

## 3. 初期データの投入ロジック

`body` のブロックの外側に、初期データを投入するプライベートコンポーネントを追加します。
アプリ初回起動時（データが空の時）のみ実行されます。

```swift
    // 初期化ロジック
    private func initializeAppIfNeeded() {
        // 既存データをチェック
        let descriptor = FetchDescriptor<ToDoTab>()
        let existingTabs = (try? modelContext.fetch(descriptor)) ?? []

        // データがまだ1件もなければ、初期データを作成
        if existingTabs.isEmpty {
            for (tabName, taskNames) in INITIAL_TODO_TABS {
                // タブを作成
                let newTab = ToDoTab(name: tabName)
                ToDoTabService.addTab(newTab, to: modelContext)

                // そのタブ内のタスクを作成
                for taskName in taskNames {
                    let newTask = ToDoTask(title: taskName, detail: "", tabId: newTab.id)
                    ToDoTaskService.addTask(newTask, to: modelContext)
                }
            }
        }
    }
```

**初期データ投入の仕組み:**

- **既存データのチェック**
  まず、データベースに既にタブが存在するかをチェックします。条件なしの `FetchDescriptor` で全タブを取得し、エラー時は空配列を返します。

- **`if existingTabs.isEmpty`**
  タブが1件もない場合のみ、初期データを作成します。これにより、アプリを再起動しても初期データが重複して作成されることを防ぎます。

- **ループ処理の流れ**
  1. `INITIAL_TODO_TABS` から1つずつタブ情報を取り出す（タブ名とタスク名のリスト）
  2. タブを作成してデータベースに保存
  3. そのタブに属するタスクを1つずつ作成
  4. 各タスクの `tabId` に、先ほど作成したタブの `id` を設定（親子関係の紐付け）
  5. タスクをデータベースに保存

  **重要なポイント:** タブを先に作成してから、そのタブのIDを使ってタスクを作成する順序が重要です。

## 4. プレビューの修正

最後にプレビューコードを修正します。

```swift
#Preview {
    // プレビューでは初期化処理をスキップして表示確認
    ContentView(isInitialized: false, autoInitialize: false)
}
```

---

## コード全体

<img src="/images/todolist/ContentView16.png" alt="ContentViewの完成イメージ" class="mobile-screenshot" />

### Views/ContentView.swift

```swift
import SwiftUI
import SwiftData

struct ContentView: View {
    @State private var isInitialized: Bool
    private let autoInitialize: Bool
    @Environment(\.modelContext) private var modelContext

    init(isInitialized: Bool = false, autoInitialize: Bool = true) {
        _isInitialized = State(initialValue: isInitialized)
        self.autoInitialize = autoInitialize
    }

    var body: some View {
        if isInitialized {
            MainStack()
        } else {
            VStack {
                Text("アプリを準備中...")
                ProgressView()
            }
            .onAppear {
                if !autoInitialize {
                    return
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                    initializeAppIfNeeded()
                    isInitialized = true
                }
            }
        }
    }

    private func initializeAppIfNeeded() {
        // 既存データをチェック
        let descriptor = FetchDescriptor<ToDoTab>()
        let existingTabs = (try? modelContext.fetch(descriptor)) ?? []

        // 初期データがなければ作成
        if existingTabs.isEmpty {
            for (tabName, taskNames) in INITIAL_TODO_TABS {
                let newTab = ToDoTab(name: tabName)
                ToDoTabService.addTab(newTab, to: modelContext)

                // タブに属するタスクを追加
                for taskName in taskNames {
                    let newTask = ToDoTask(title: taskName, detail: "", tabId: newTab.id)
                    ToDoTaskService.addTask(newTask, to: modelContext)
                }
            }
        }
    }
}

#Preview {
    ContentView(isInitialized: false, autoInitialize: false)
}
```

