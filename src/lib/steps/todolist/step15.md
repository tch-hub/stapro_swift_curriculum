# ステップ8: ContentView と MainStack の作成

<script>
    import {base} from '$app/paths';
</script>

## ContentView.swift の作成

`Screens/Views/`フォルダに`ContentView.swift`を作成します。このビューはアプリ起動時に最初に表示されます：

```swift
import SwiftUI

struct ContentView: View {
    @State private var isInitialized = false

    var body: some View {
        if isInitialized {
            MainStack()
        } else {
            VStack {
                Text("アプリを準備中...")
                ProgressView()
            }
            .onAppear {
                DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                    isInitialized = true
                }
            }
        }
    }
}

#Preview {
    ContentView()
}
```

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

- `ContentView`: アプリ起動時の初期化処理を行い、その後`MainStack`に遷移します
- `MainStack`: NavigationStackを使って、複数の画面を管理します
- `navigationDestination`: `NavigationItem`の内容に応じて、表示する画面を切り替えます

## 次のステップへ

次は、ホーム画面（タスク一覧）を作成します。
