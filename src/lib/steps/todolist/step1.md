# ステップ1: プロジェクトの作成とセットアップ

<script>
    import {base} from '$app/paths';
</script>

## 1. Xcodeで新規プロジェクトを作成

1. Xcodeを起動し、「Create a new Xcode project」を選択する。
2. テンプレートで「App」を選択して「Next」をクリックする。
3. 設定を入力します：
   - Product Name: `UIToDoList`
   - Organization Identifier: `jp.ac.stpro` など適切な名前
   - Interface: SwiftUI
   - Language: Swift
4. 保存先を選んでプロジェクトを作成する。

## 2. プロジェクトの構成を作成する

新しいプロジェクトを作ると自動生成されるファイルの中で、以下の3つをまず削除します：

- ContentView.swift
- Assets.xcassets内の不要な画像

次に、以下の構造でフォルダとファイルを作成します：

```
UIToDoList/
├── SwiftUIToDoListApp.swift  # アプリのエントリーポイント
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

## 3. ファイルの配置方法

Xcodeでフォルダやファイルを作成する際の注意点：

- 「Create folder」を使ってフォルダを作成する
- 「New File」→「Swift File」でSwiftファイルを作成する
- 作成したファイルをドラッグ&ドロップで正しいフォルダに配置する

## 4. SwiftUIToDoListApp.swiftの作成

アプリのエントリーポイントとなるファイルを作成します。以下はひな形です：

```swift
import SwiftUI

@main
struct SwiftUIToDoListApp: App {
    var body: some Scene {
        WindowGroup {
            InitialView()
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
