# ステップ14: ホーム画面の枠を作る

このステップでは、ホーム画面の土台だけを作ります。

### 1. 画面遷移用の `Binding`

```swift
// 親画面（MainStack）と画面遷移の状態を共有するための変数
@Binding var navigationPath: [NavigationItem]
```

`MainStack` から渡される `navigationPath` と接続（Binding）しています。  
この配列に新しい画面の情報を追加する（append）ことで、次の画面への遷移を実現します。

### 2. 画面の中身

```swift
VStack(spacing: 12) {
    // 仮のテキスト表示
    Text("ここにタスク一覧を表示します")
        .foregroundColor(.gray)

    // タブ管理画面へ移動するボタン
    Button(action: {
        // ナビゲーションパスに「タブ管理画面」を追加して遷移
        navigationPath.append(NavigationItem(id: .tabManage))
    }) {
        Text("タブ管理")
    }
}
```

現時点ではまだタスクリストの機能は実装せず、仮のテキストと画面遷移のテスト用ボタンだけを配置しています。  
ボタンを押すと `navigationPath` が更新され、タブ管理画面へと自動的に切り替わります。

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
// HomeView.swift
import SwiftUI

/// ホーム画面（枠だけ作成）
struct HomeView: View {
    @Binding var navigationPath: [NavigationItem]

    var body: some View {
        VStack(spacing: 12) {
            Text("ここにタスク一覧を表示します")
                .foregroundColor(.gray)

            Button(action: {
                navigationPath.append(NavigationItem(id: .tabManage))
            }) {
                Text("タブ管理")
            }
        }
        .padding()
        .navigationTitle("ToDoリスト")
    }
}
```
