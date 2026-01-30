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
            // ホーム画面を表示
            HomeView(navigationPath: $navigationPath)

                // 画面遷移定義
                .navigationDestination(for: NavigationItem.self) { item in
                    switch item.id {
                    // タブ管理画面へ遷移
                    case .tabManage:
                        TabManageView()

                    default:
                        // 将来的に他の画面が増えた場合はここに追加します
                        EmptyView()
                    }
                }
        }
    }
}

#Preview {
    struct PreviewWrapper: View {
        var body: some View {
            MainStack()
                .modelContainer(
                    try! ModelContainer(
                        for: ToDoTab.self, ToDoTask.self,
                        configurations: ModelConfiguration(isStoredInMemoryOnly: true)
                    )
                )
        }
    }

    return PreviewWrapper()
}
```

## 各要素の説明

### アーキテクチャ

| 要素             | 説明                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `ScreenID`       | アプリ内の画面を識別する列挙型。将来的に画面が増える場合はここに追加 |
| `NavigationItem` | 画面遷移の情報を保持する構造体。ルーター的な役割                     |
| `MainStack`      | NavigationStackを管理するコンテナ。アプリのナビゲーション構造を定義  |
| `navigationPath` | 現在のナビゲーションパス。履歴管理と戻るボタンが自動で動作           |

### NavigationStackの利点

- **自動で戻るボタンが動作**: `@Environment(\.dismiss)`を使用せず、ナビゲーションスタックが自動で戻る機能を提供
- **履歴管理**: `navigationPath`によって、複数の画面遷移を管理
- **戻るジェスチャー対応**: iOS標準のスワイプで戻る機能が自動で有効

### TabManageViewのナビゲーション

TabManageViewでは`@Environment(\.dismiss)`を削除可能です。理由：

```swift
// 不要：NavigationStackが自動で戻る機能を提供
// @Environment(\.dismiss) var dismiss

// NavigationStackでは以下のように自動で戻ります：
// - 戻るボタンをタップ
// - スワイプで戻るジェスチャー
// - プログラムで navigationPath.removeLast()
```

### プレビューについて

- `ModelContainer`: SwiftDataのメモリコンテキストを提供
- `isStoredInMemoryOnly: true`: プレビュー環境ではメモリのみに保存
- `ToDoTab.self, ToDoTask.self`: 両方のモデルを登録

## 次のステップへ

次は、ホーム画面（タスク一覧）を作成します。
