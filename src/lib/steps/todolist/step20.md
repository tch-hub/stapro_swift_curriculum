# ステップ20: 初期データの設定

<script>
    import {base} from '$app/paths';
</script>

## 初期データとは

アプリ初回起動時に、サンプルのタブやタスクを自動で作成して、ユーザーがすぐにアプリを試せるようにします。

## Constants.swift の作成

`SwiftData/`フォルダに`Constants.swift`を作成します：

```swift
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

## InitialView.swift の修正

アプリ初回起動時に初期データを作成します：

```swift
import SwiftUI
import SwiftData

struct InitialView: View {
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
                if let addedTab = try? modelContext.fetch(
                    FetchDescriptor<ToDoTab>(predicate: #Predicate { $0.name == tabName })
                ).first {
                    for taskName in taskNames {
                        let newTask = ToDoTask(title: taskName, description: "", tabId: addedTab.id)
                        ToDoTaskService.addTask(newTask, to: modelContext)
                    }
                }
            }
        }
    }
}
```

## 初期化処理の流れ

1. アプリ起動時にInitialViewが表示されます
2. `onAppear`で`initializeAppIfNeeded()`が呼び出されます
3. 既存データをチェックします
4. データが存在しなければ、初期データを作成します
5. 初期化が完了したら`MainStack`を表示します

## 次のステップへ

次は、アプリ全体を確認して、最終調整を行います。
