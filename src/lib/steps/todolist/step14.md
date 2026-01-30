# ステップ14: ホーム画面の枠を作る

このステップでは、ホーム画面の土台だけを作ります。

### 1. 画面遷移用の `Binding`

```swift
@Binding var navigationPath: [NavigationItem]
```

`MainStack` から渡される `navigationPath` を更新することで画面遷移します。

### 2. 画面の中身

```swift
VStack(spacing: 12) {
    Text("ここにタスク一覧を表示します")
        .foregroundColor(.gray)

    Button(action: {
        navigationPath.append(NavigationItem(id: .tabManage))
    }) {
        Text("タブ管理")
    }
}
```

- まだタスク一覧は作らず、説明テキストだけ置きます。
- ボタンでタブ管理画面へ遷移します。

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
