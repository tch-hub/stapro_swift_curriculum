# ステップ16: 起動時の初期化を行う

アプリ起動時の初期化処理とローディング表示を追加します。

---

## コード全体

<img src="/images/todolist/ContentView16.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
// ContentView.swift
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
