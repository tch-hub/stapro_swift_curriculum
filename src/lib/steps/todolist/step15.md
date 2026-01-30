<script>
    import {base} from '$app/paths';
</script>

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

