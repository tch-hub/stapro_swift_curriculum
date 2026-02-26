---
title: ステップ16: 起動時の初期化を行う(ContentView.swift)
summary: 初期化処理とローディング表示を追加します。
---

### ステップ16終了時の完成イメージ

<img src="/images/todolist/ContentView16.png" alt="ContentViewの完成イメージ" class="mobile-screenshot-top" />

## 1. アプリの準備をするための変数を追加する

`Views/ContentView.swift` を開いて、アプリの準備（初期化）の状態を管理するための変数を追加しましょう。

```swift
import SwiftUI
import SwiftData

struct ContentView: View {
    @Environment(\.modelContext) private var modelContext // データベースを操作するための道具

    @State private var isInitialized: Bool // アプリの準備が終わったかどうかを覚えておくためのスイッチ（フラグ）

    private let autoInitialize: Bool // 自動で準備を始めるかどうか（プレビュー画面などのために用意）

    // init() はこの画面が作られる時に、一番最初に動く「最初の設定」
    init(isInitialized: Bool = false, autoInitialize: Bool = true) {
        _isInitialized = State(initialValue: isInitialized)
        self.autoInitialize = autoInitialize
    }

    var body: some View {
        // ... (次の手順で中身を作ります)
        Text("Loading...")
    }
}
```

**新しく追加したコードの役割:**

| 追加した内容     | 役割                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `modelContext`   | データベース（データの箱）を操作するための道具                                                                     |
| `isInitialized`  | アプリの準備が終わったかどうかを判定するスイッチ（終わってなければローディング画面、終わったらメイン画面を見せる） |
| `autoInitialize` | 自動で準備を始めるかどうかを決める設定（プレビュー画面の時はOFFにするために使う）                                  |
| `init()`         | 画面が最初に作られる時の初期設定                                                                                   |

## 2. 画面の表示を切り替える

`body` の中身を作っていきましょう。
準備が終わっていればメイン画面へ、まだなら「準備中…」というローディング画面を表示するようにします。
`var body: some View {...}`の中に以下のコードを追加します。

```swift
    var body: some View {
        if isInitialized {
            // 準備OK！：メイン画面（MainStack）を表示する
            MainStack()
        } else {
            // 準備中...：くるくる回るローディング画面を表示する
            VStack {
                Text("アプリを準備中...")
                ProgressView() // くるくる回るアニメーション
            }
            .onAppear {
                // 画面が表示されたときに、自動で準備をスタートする
                if !autoInitialize { return } // 自動準備がOFFならここでストップ

                // 1秒だけ待ってから準備を始める（ローディング画面を少しだけ見せるため）
                DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                    initializeAppIfNeeded() // 準備の処理（後で作ります）
                    isInitialized = true  // 準備が終わったので、スイッチをONにする！
                }
            }
        }
    }
```

- **`if isInitialized`**
  `isInitialized` というスイッチが `true`（ON）なら `MainStack()` というメイン画面を表示します。もし `false`（OFF）なら「アプリを準備中...」というローディング画面を表示します。SwiftUIは、このスイッチが切り替わった瞬間に自動で画面を切り替えてくれます。

- **`ProgressView()`**
  ロード中によく見る、くるくる回るアニメーションを表示する便利な道具です。

- **`.onAppear`**
  画面が表示されたときに、1度だけ中の処理を実行してくれます。ここでアプリの準備をスタートさせます。

- **`DispatchQueue.main.asyncAfter(...)`**
  指定した時間の後に処理を実行するための機能です。ここでは `1` を設定して「1秒待ってから実行する」ようにしています。
  処理がすぐに終わって画面が切り替わってしまうと、一瞬だけローディング画面が表示されて不自然に見えることがあるため、あえて1秒間待機する時間を設けています。

## 3. 最初のデータを入れる仕組みを作る

`body` のブロックの外側に、アプリを初めて開いたときに最初のデータ（初期データ）を自動で入れる仕組みを追加します。

```swift
    // アプリの準備（初期化）の処理
    private func initializeAppIfNeeded() {
        // データベースに「タブ」のデータがすでに入っているかチェックする
        let descriptor = FetchDescriptor<ToDoTab>()
        let existingTabs = (try? modelContext.fetch(descriptor)) ?? []

        // もしデータが1件もなければ、最初のデータを作る
        if existingTabs.isEmpty {
            for (tabName, taskNames) in INITIAL_TODO_TABS {
                // タブを作る
                let newTab = ToDoTab(name: tabName)
                ToDoTabService.addTab(newTab, to: modelContext) // データベースに保存！

                // そのタブの中に入るタスクを作る
                for taskName in taskNames {
                    let newTask = ToDoTask(title: taskName, detail: "", tabId: newTab.id)
                    ToDoTaskService.addTask(newTask, to: modelContext) // データベースに保存！
                }
            }
        }
    }
```

---

### 🔄 データを入れるときの流れ

- **`existingTabs.isEmpty`（データが空か確認する）**  
  アプリの初回起動時はデータが「0件」であるため、この中の処理が実行されます。2回目以降の起動時はすでにデータが保存されているためスキップされます。これにより、初期データが重複して作成されるのを防いでいます。

- **ループ処理でデータを作成する手順**  
  あらかじめステップ9で用意しておいた `INITIAL_TODO_TABS` というデータに基づき、順番に作成と保存を行います。
  1. まず「タブ（例えば "今日" など）」を作成してデータベースに保存します。
  2. 次に、そのタブに所属する「タスク（例えば "買い物" など）」を作成してデータベースに保存します。
  3. タスクを作成する際、どのタブの所属かを示すために、作成したタブのID（`tabId`）をセットして関連づけるのが重要なポイントです。

## 4. プレビューの修正

```swift
#Preview {
    // プレビューの時は、この準備処理をスキップするように設定しておく
    ContentView(isInitialized: false, autoInitialize: false)
}
```

- `#Preview`: このブロック内に書いたコードがXcodeのプレビュー画面に表示されます。

  ※ このコードは、実際のアプリ本体には必須ではありませんが、プレビュー上で動作や状態変化を確認するためのテスト用ラッパーとして書かれています。  
  ※ 実行せずに確認できるようにしています。

---

## コード全体

<img src="/images/todolist/ContentView16.png" alt="ContentViewの完成イメージ" class="mobile-screenshot" />

```swift title="Views/ContentView.swift"
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

#Preview {
    ContentView(isInitialized: false, autoInitialize: false)
}
```
