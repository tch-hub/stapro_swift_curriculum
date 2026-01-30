# ステップ9: 初期データを投入する

アプリ起動時にタブとタスクが空なら、初期データを作成します。

### 1. 初期データの定義

`Constants.swift` に初期タブとタスクを定義します。

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

### 2. 起動時の初期化

`ContentView` でデータの有無を確認し、必要なら作成します。

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
        let descriptor = FetchDescriptor<ToDoTab>()
        let existingTabs = (try? modelContext.fetch(descriptor)) ?? []

        if existingTabs.isEmpty {
            for (tabName, taskNames) in INITIAL_TODO_TABS {
                let newTab = ToDoTab(name: tabName)
                ToDoTabService.addTab(newTab, to: modelContext)

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
