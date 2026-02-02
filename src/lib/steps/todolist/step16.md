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

<img src="/images/todolist/ContentView16.png" alt="ContentViewの完成イメージ" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

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
