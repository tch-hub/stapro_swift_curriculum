# ステップ8: InitialView と MainStack の作成

<script>
    import {base} from '$app/paths';
</script>

## InitialView.swift の作成

`Screens/Views/`フォルダに`InitialView.swift`を作成します。このビューはアプリ起動時に最初に表示されます：

```swift
import SwiftUI

struct InitialView: View {
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

struct MainStack: View {
    @State private var navigationPath: [NavigationItem] = []

    var body: some View {
        NavigationStack(path: $navigationPath) {
            HomeView(navigationPath: $navigationPath)
                .navigationDestination(for: NavigationItem.self) { item in
                    switch item.id {
                    case .home:
                        HomeView(navigationPath: $navigationPath)
                    case .tabManage:
                        TabManageView()
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

- `InitialView`: アプリ起動時の初期化処理を行い、その後`MainStack`に遷移します
- `MainStack`: NavigationStackを使って、複数の画面を管理します
- `navigationDestination`: `NavigationItem`の内容に応じて、表示する画面を切り替えます

## 次のステップへ

次は、ホーム画面（タスク一覧）を作成します。
