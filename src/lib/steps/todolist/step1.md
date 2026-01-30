# ステップ1: プロジェクトの作成とセットアップ

### 1. Xcodeで新規プロジェクトを作成

1. Xcodeを起動し、「Create a new Xcode project」を選択する。
2. テンプレートで「App」を選択して「Next」をクリックする。
3. 設定を入力し、以下の画像のように指定して「Next」を押す。

![Xcode の設定画面](/images/setup.png)

4. 保存先を選んでプロジェクトを作成する。

### 2. 自動作成されるファイルを削除して必要なファイルを作成する

新しいプロジェクトを作ると自動生成されるファイルはすべて削除し、必要なファイルを自分で作り直します。以下の手順で進めてください！

#### ファイルを削除する方法

- Xcodeのプロジェクトナビゲーターで、削除したいファイルまたはフォルダを見つけて選択します。
- 選択したファイルまたはフォルダを右クリックし、メニューから「Delete」を選択する。

#### 必要なファイルを作成する

```
ToDoList/
├── ToDoListApp.swift  # アプリのエントリーポイント
├── Views
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
    ├── CustomAlert.swift
    ├── List.swift
    ├── ListItem.swift
    ├── EmptyStateView.swift
    ├── TabHeaderView.swift
    └── TaskInputView.swift
```

Xcodeで新しいフォルダを作る手順

- プロジェクトナビゲーターの空白の部分で右クリックし、「New Folder」を選択

Xcodeで新しいファイルを作る手順（いずれかの方法でファイルを作成してください）

- Xcode メニューバーの「File」→「New」→「EmptyFile」を選択
- プロジェクトナビゲーターの空白の部分で右クリックし、「New EmptyFile」を選択

### 3. ToDoListApp.swiftに以下のコードを追加する

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

`import SwiftData`
SwiftDataを読み込むと、アプリ内でデータモデルを定義して永続化できるようになります。`@Model`属性を使ったモデルを作り、SwiftUIと組み合わせて簡単にデータの保存・取得・更新が行えます。

`import SwiftUI`
SwiftUIをよみこむことで、TextやButtonなどの便利な機能を使えるようになります。  
`body`という部分は、画面に何を表示するかを書くところです。
ContentViewという構造体を作ります。これはアプリの画面のメイン部分です。Viewというルールに従って作ります。  
`WindowGroup {ContentView()}`は、コードを書くたびに画面をすぐに見られる機能です。これで、アプリの見た目をすぐに確認できます。

#### ※ここまでの状態では画面に何も表示されないので次のステップに進んでください。
