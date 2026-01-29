# ステップ8: MainStack の作成

<script>
    import {base} from '$app/paths';
</script>

## MainStack.swift の作成

`Screens/Views/Main/`フォルダを作成し、その中に`MainStack.swift`を作成します：

```swift
import SwiftUI

// MARK: - Navigation Definitions
// ここに定義することで、MainStackがどのような遷移を持つかが一目でわかります

/// 画面ID
enum ScreenID: String {
    case home // ホーム画面
    case tabManage // タブ管理画面
}

/// 画面遷移の情報
struct NavigationItem: Hashable {
    let id: ScreenID
}

// MARK: - Main View

/// メインスタック
struct MainStack: View {
    @State private var navigationPath: [NavigationItem] = []

    var body: some View {
        NavigationStack(path: $navigationPath) {
            // ホーム画面
            HomeView(navigationPath: $navigationPath)

                // 画面遷移定義
                .navigationDestination(for: NavigationItem.self) { item in
                    switch item.id {
                    // タブ管理画面
                    case .tabManage:
                        TabManageView()

                    // case .home: はルートビューなのでここには不要ですが、
                    // 将来的に他の画面が増えた場合はここに追加します
                        
                    default:
                        EmptyView()
                    }
                }
        }
    }
}

#Preview {
    MainStack()
}
```

## 各要素の説明

- `MainStack`: NavigationStackを使って、複数の画面を管理します
- `navigationDestination`: `NavigationItem`の内容に応じて、表示する画面を切り替えます
- `ScreenID`: アプリ内の画面を識別する列挙型です
- `NavigationItem`: 画面遷移の情報を保持する構造体です

## 次のステップへ

次は、ホーム画面（タスク一覧）を作成します。
