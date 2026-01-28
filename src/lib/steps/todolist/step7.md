# ステップ7: ScreenID と NavigationItemの定義

<script>
    import {base} from '$app/paths';
</script>

## ナビゲーションの仕組み

SwiftUIでは、複数の画面を切り替える際に、どの画面に遷移するかを管理する必要があります。そのために、画面を識別するための定義を作成します。

## ScreenID.swift の作成

`Screens/Navigation/`フォルダに`ScreenID.swift`を作成し、以下のコードを記述します：

```swift
import Foundation

enum ScreenID: Hashable {
    case home
    case tabManage
}
```

## NavigationItem.swift の作成

`Screens/Navigation/`フォルダに`NavigationItem.swift`を作成し、以下のコードを記述します：

```swift
import Foundation

struct NavigationItem: Hashable {
    let id: ScreenID

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }

    static func == (lhs: NavigationItem, rhs: NavigationItem) -> Bool {
        lhs.id == rhs.id
    }
}
```

## Hashable について

NavigationStackで画面遷移を管理するには、ナビゲーション情報が`Hashable`である必要があります。`Hashable`は、オブジェクトを一意に識別できるプロトコルです。

## 各ScreenIDの説明

| ScreenID    | 説明                         |
| ----------- | ---------------------------- |
| `home`      | ホーム画面（タスク一覧表示） |
| `tabManage` | タブ管理画面                 |

## 次のステップへ

次は、アプリの初期画面`ContentView`を作成します。
