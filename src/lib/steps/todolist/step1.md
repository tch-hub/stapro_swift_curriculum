# ステップ1: プロジェクトの作成とセットアップ(ToDoListApp.swift)

## 1. Xcodeで新規プロジェクトを作成

1. Xcodeを起動し、「Create a new Xcode project」を選択します。
2. テンプレートで「App」を選択して「Next」をクリックします。
3. 設定を入力し、以下の画像のように指定して「Next」を押します。

![Xcode の設定画面](/images/setup.png)

4. 保存先を選んでプロジェクトを作成します。

## 2. 自動作成されるファイルを削除して必要なファイルを作成する

新しくプロジェクトを作成すると自動生成されるファイルは一度すべて削除し、必要なファイルを自分で作り直します。以下の手順で進めてください。

### ファイルを削除する方法

- Xcodeのプロジェクトナビゲーターで、削除したいファイルまたはフォルダを選択します。
- 右クリックし、メニューから「Delete」を選択します（「Move to Trash」を選んで完全に削除してください）。

### 必要なファイル構造を作成する

以下の構成になるようにフォルダとファイルを作成してください。

```text
ToDoList/
├── ToDoListApp.swift  # アプリのエントリーポイント
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

**フォルダの作成方法:**

- プロジェクトナビゲーターの空白部分で右クリックし、「New Folder」を作成します。

**ファイルの作成方法:**

- いずれかの方法でファイルを作成してください。
  - Xcode メニューバーの「File」→「New」→「File...」を選択
  - プロジェクトナビゲーターの空白の部分で右クリックし、「New File...」を選択

## 3. ToDoListApp.swift の実装

アプリのエントリーポイントとなる `ToDoListApp.swift` に以下のコードを記述します。

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

- `import SwiftData`: アプリ内でデータベース機能を使うためにインポートします。
- `@main`: ここがアプリの開始地点であることを示します。
- `WindowGroup`: アプリのメインウィンドウを管理するコンテナです。ここでは `ContentView` を最初に表示するように設定しています。

## 4. ContentView.swift の実装

メイン画面となる `ContentView.swift` に以下のコードを記述します。

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

- `struct ContentView: View`: SwiftUIのビューを定義しています。
- `Text("ToDoList")`: 画面に文字を表示するだけのシンプルな構成です。ここから機能を追加していきます。
- `#Preview`: Xcodeのプレビュー機能で画面を確認するためのコードです。

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
