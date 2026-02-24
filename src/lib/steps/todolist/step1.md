# ステップ1: プロジェクトの作成とセットアップ(ToDoListApp.swift)

## 1. Xcodeで新しいプロジェクトを作る

1. Xcodeを起動して「Create a new Xcode project」を選びます。
2. テンプレートで「App」を選んで「Next」をクリックします。
3. 下の画像のように設定して「Next」を押します。

<img src="/images/setup2.png" alt="Xcode の設定画面" class="mx-auto block max-w-full md:max-w-lg rounded-lg border border-base-300 shadow-sm" />

4. 保存先を選んでプロジェクトを作成します。

## 2. 不要なファイルを削除して、必要なファイルを作る

新しくプロジェクトを作ると、Xcodeが自動でいくつかのファイルを作ってくれます。今回はそれらをいったん全部消して、自分で必要なファイルを作り直します。

### ファイルの消し方

- プロジェクトナビゲーター（左の一覧）で消したいファイルまたはフォルダを選びます。
- 右クリックして「Delete」→「Move to Trash」を選べば完全に消えます。

### 作るべきファイル構造

以下の構成になるようにフォルダとファイルを作ってください。

```text
ToDoList/
├── ToDoListApp.swift  # アプリのスタート地点
├── Views/
│   ├── ContentView.swift
│   ├── HomeView.swift
│   ├── MainStack.swift
│   └── TabmanageView.swift
├── SwiftData/
│   ├── Constants.swift
│   ├── ToDoTask.swift
│   └── ToDoTab.swift
├── Services/
│   ├── ToDoTaskService.swift
│   └── ToDoTabService.swift
└── Components/
    ├── CustomList.swift
    ├── ToDoListItem.swift
    ├── EmptyStateView.swift
    ├── TabHeaderView.swift
    └── InputView.swift
```

**フォルダの作り方:**

- プロジェクトナビゲーターの空白部分を右クリックして「New Folder」を選びます。

**ファイルの作り方:**

どちらかの方法で作れます。
  - Xcodeのメニューバーから「File」→「New」→「File...」を選ぶ
  - プロジェクトナビゲーターの空白を右クリックして「New Empty File」を選ぶ

## 3. ToDoListApp.swift を書く

アプリが最初に起動するときに呼ばれるファイルです。以下のコードを書いてください。

```swift
import SwiftUI
import SwiftData

@main
struct ToDoListApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

- `import SwiftData`: データベース機能を使うためのおまじないです。あとのステップで使います。
- `@main`: ここがアプリの開始地点であることを示します。
- `WindowGroup`: アプリのメインウィンドウを管理する箱です。最初に `ContentView` を表示するよう設定しています。

## 4. ContentView.swift を書く

最初に表示されるメイン画面のファイルです。今は文字を表示するだけのシンプルな内容にしておきます。

```swift
import SwiftUI
import SwiftData

struct ContentView: View {
    var body: some View {
        Text("ToDoList")
    }
}

#Preview {
    ContentView()
}
```

- `struct ContentView: View`: SwiftUIの画面（View）を定義しています。
- `Text("ToDoList")`: 画面に「ToDoList」という文字を表示します。ここからどんどん機能を追加していきます。
- `#Preview`: Xcodeのプレビュー機能で画面の見た目を確認するためのコードです。

---

## コード全体

### ToDoListApp.swift

```swift
import SwiftUI
import SwiftData

@main
struct ToDoListApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### Views/ContentView.swift
<img src="/images/todolist/step1.png" alt="ToDoListItemの完成イメージ" class="mobile-screenshot" />


```swift
import SwiftUI
import SwiftData

struct ContentView: View {
    var body: some View {
        Text("ToDoList")
    }
}

#Preview {
    ContentView()
}
```
画面左上のピンマークを押してPreviewを固定表示しておきましょう！