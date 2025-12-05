# ステップ1: プロジェクトの作成とセットアップ

<script>
    import {base} from '$app/paths';
</script>

### 1. Xcodeで新規プロジェクトを作成

1. Xcodeを起動し、「Create a new Xcode project」を選択する。
2. テンプレートで「App」を選択して「Next」をクリックする。
3. 設定を入力し、以下の画像のように指定して「Next」を押す。

![Xcode の設定画面]({base}/images/setup.png)

4. 保存先を選んでプロジェクトを作成する。

### 2. 自動作成されるファイルを削除して必要なファイルを作成する

新しいプロジェクトを作ると自動生成されるファイルはすべて削除し、必要なファイルを自分で作り直します。以下の手順で進めてください。

#### ファイルを削除する方法

- Xcodeのプロジェクトナビゲーターで、削除したいファイルまたはフォルダを見つけて選択します。
- 選択したファイルまたはフォルダを右クリックし、メニューから「Delete」を選択する。

削除するファイルの例

```
TimerApp.swift
ContentView.swift
Assets.xcassets
```

#### 必要なファイルを作成する

Xcodeで新しいファイルを作る手順（いずれかの方法でファイルを作成してください）

- Xcode メニューバーの「File」→「New」→「File…」を選択
- プロジェクトナビゲーターの空白の部分で右クリック（またはコントロールクリック）し、「New File…」を選択

タイマーでは次のような構成を作成します。

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
