# ステップ1: プロジェクトの作成とセットアップ

<script>
    import {base} from '$app/paths';
</script>

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
├── Screens/
│   ├── Views/
│   │   └── InitialView.swift
│   └── Navigation/
│       └── ScreenID.swift
├── SwiftData/
│   └── Models/
│       ├── ToDoTask.swift
│       └── ToDoTab.swift
├── Services/
│   ├── ToDoTaskService.swift
│   └── ToDoTabService.swift
└── Components/
```

Xcodeで新しいフォルダを作る手順
- プロジェクトナビゲーターの空白の部分で右クリックし、「New Folder」を選択  

Xcodeで新しいファイルを作る手順（いずれかの方法でファイルを作成してください）
- Xcode メニューバーの「File」→「New」→「EmptyFile」を選択
- プロジェクトナビゲーターの空白の部分で右クリックし、「New EmptyFile」を選択

### 3. ToDoListApp.swiftに以下のコードを追加する

アプリのエントリーポイントとなるファイルを作成します。以下はひな形です：

```swift
import SwiftUI

@main
struct ToDoListApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

このファイルは、アプリ起動時に最初に実行される重要なファイルです。SwiftDataの設定もここで行います。

## 次のステップに進む準備

- プロジェクトを正常に作成できたか確認する
- Xcodeでプロジェクトをビルドして、エラーがないことを確認する
- 必要なフォルダ構造が完成しているか確認する

次のステップでSwiftDataの環境準備を行います。
