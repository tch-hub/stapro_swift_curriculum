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

タイマーアプリでは次のような構成を作成します。以下の構成と同じになるようにフォルダやファイルを作成してください。
```
Timer/
├── TimerApp.swift          # アプリのエントリーポイント
├── ContentView.swift       # メインのビュー
├── ViewModels/
│   └── TimerViewModel.swift # タイマーのロジック
├── Views/
│   ├── TimeSelectionView.swift  # 時間設定ビュー
│   └── TimerDisplayView.swift   # タイマー表示ビュー
└── Components/
    ├── ColorButton.swift    # カスタムボタン
    └── TimePicker.swift     # 時間選択ピッカー
```

Xcodeで新しいフォルダを作る手順
- プロジェクトナビゲーターの空白の部分で右クリックし、「New Folder」を選択  

Xcodeで新しいファイルを作る手順（いずれかの方法でファイルを作成してください）
- Xcode メニューバーの「File」→「New」→「EmptyFile」を選択
- プロジェクトナビゲーターの空白の部分で右クリックし、「New EmptyFile」を選択

### 3. TimerApp.swiftに以下のコードを追加する

```swift
import SwiftUI

@main
struct TimerApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

```
`import SwiftUI`
SwiftUIをよみこむことで、TextやButtonなどの便利な機能を使えるようになります。  
`body`という部分は、画面に何を表示するかを書くところです。 
ContentViewという構造体を作ります。これはアプリの画面のメイン部分です。Viewというルールに従って作ります。  
`WindowGroup {ContentView()}`は、コードを書くたびに画面をすぐに見られる機能です。これで、アプリの見た目をすぐに確認できます。

#### ※ここまでの状態では画面に何も表示されないので次のステップに進んでください。
