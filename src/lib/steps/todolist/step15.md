# ステップ15: 画面遷移の土台を作る

`NavigationStack` を使って画面遷移をまとめます。

### 1. 画面IDを定義

```swift
enum ScreenID: String {
    case home
    case tabManage
}
```

### 2. 遷移情報の型を作成

```swift
struct NavigationItem: Hashable {
    let id: ScreenID
}
```

### 3. NavigationStack を構成

```swift
NavigationStack(path: $navigationPath) {
    HomeView(navigationPath: $navigationPath)
        .navigationDestination(for: NavigationItem.self) { item in
            switch item.id {
            case .tabManage:
                TabManageView()
            default:
                EmptyView()
            }
        }
}
```

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
import SwiftUI
// MainStack.swift

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

