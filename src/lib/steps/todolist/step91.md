# ステップ9: 初期データを投入する

アプリ起動時にタブとタスクが空なら、初期データを作成します。

### 1. 初期データの定義

`Constants.swift` に初期タブとタスクを定義します。

```swift
// Constants.swift
import Foundation

// 初期データの定義：タブ名と、それに紐づくタスク名のリスト
// ("タブ名", ["タスク1", "タスク2", ...]) という形式で記述
let INITIAL_TODO_TABS = [
    ("仕事", [
        "プロジェクト企画書を作成",
        "メール返信",
        "会議資料準備"
    ]),
    ("プライベート", [
        "映画を見る",
        "友人に連絡",
        "運動する"
    ]),
    ("買い物", [
        "食料品",
        "日用品",
        "衣類"
    ])
]
```

### 2. 起動時の初期化

`ContentView` でデータの有無を確認し、必要なら作成します。

```swift
// ContentView.swift
import SwiftUI
import SwiftData

struct ContentView: View {
    // アプリのデータ準備ができたかどうかを管理するフラグ
    @State private var isInitialized = false
    // データベース操作用のコンテキスト（環境変数から取得）
    @Environment(\.modelContext) private var modelContext

    var body: some View {
        if isInitialized {
            // 準備完了ならメイン画面を表示
            MainStack()
        } else {
            // 準備中はローディング画面を表示
            VStack {
                Text("アプリを準備中...")
                ProgressView() // グルグル回るインジケーター
            }
            .onAppear {
                // 画面が表示されたら実行（1秒待ってから処理開始）
                DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                    initializeAppIfNeeded()
                    // 準備完了フラグを立てる -> メイン画面へ切り替わる
                    isInitialized = true
                }
            }
        }
    }

    // 必要であれば初期データを投入するメソッド
    private func initializeAppIfNeeded() {
        // 保存されているタブ情報を検索するための記述子
        let descriptor = FetchDescriptor<ToDoTab>()
        // 既存のデータを取得（失敗した場合は空配列）
        let existingTabs = (try? modelContext.fetch(descriptor)) ?? []

        // データが一件もなければ初期データを投入
        if existingTabs.isEmpty {
            for (tabName, taskNames) in INITIAL_TODO_TABS {
                // 新しいタブを作成して保存
                let newTab = ToDoTab(name: tabName)
                ToDoTabService.addTab(newTab, to: modelContext)

                // そのタブに紐づくタスクを作成して保存
                for taskName in taskNames {
                    let newTask = ToDoTask(title: taskName, detail: "", tabId: newTab.id)
                    ToDoTaskService.addTask(newTask, to: modelContext)
                }
            }
        }
    }
}
```

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
// Constants.swift
import Foundation

// 初期タブデータ
let INITIAL_TODO_TABS = [
    ("仕事", [
        "プロジェクト企画書を作成",
        "メール返信",
        "会議資料準備"
    ]),
    ("プライベート", [
        "映画を見る",
        "友人に連絡",
        "運動する"
    ]),
    ("買い物", [
        "食料品",
        "日用品",
        "衣類"
    ])
]
```

```swift
// ContentView.swift
import SwiftUI
import SwiftData

struct ContentView: View {
    @State private var isInitialized = false
    @Environment(\.modelContext) private var modelContext

    var body: some View {
        if isInitialized {
            MainStack()
        } else {
            VStack {
                Text("アプリを準備中...")
                ProgressView()
            }
            .onAppear {
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
```
