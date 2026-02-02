# ステップ15: 画面遷移の土台を作る(MainStack.swift)

`NavigationStack` を使って画面遷移をまとめます。
ステップ1で作成した `Views/MainStack.swift` を編集します。

### 1. 画面IDを定義

```swift
// アプリ内の画面を識別するためのID
enum ScreenID: String {
    case home      // ホーム画面
    case tabManage // タブ管理画面
}
```

画面遷移の行き先を管理しやすくするために、列挙型（enum）を使って画面のリストを定義しています。

### 2. 遷移情報の型を作成

```swift
// NavigationStackで扱うためのデータ型（Hashable準拠が必要）
struct NavigationItem: Hashable {
    let id: ScreenID
}
```

`NavigationStack` のパス（履歴）として保存できるデータ型を作成しています。  
`Hashable` プロトコルに準拠させることで、一意な遷移先として扱えるようになります。

### 3. NavigationStack を構成

```swift
// パス（履歴）と紐づいたナビゲーションスタック
NavigationStack(path: $navigationPath) {
    // 最初に表示する画面（ルートビュー）
    HomeView(navigationPath: $navigationPath)
        // NavigationItem 型のデータがパスに追加された時の遷移先を定義
        .navigationDestination(for: NavigationItem.self) { item in
            switch item.id {
            case .tabManage:
                // .tabManage の場合はタブ管理画面を表示
                TabManageView()
            default:
                EmptyView()
            }
        }
}
```

`NavigationStack` を使って、画面遷移のルートを管理します。  
`path: $navigationPath` を指定することで、プログラムから `navigationPath` 配列を操作して画面遷移ができるようになります。  
`.navigationDestination` で、どのIDが指定されたらどの画面を表示するかを定義しています。

---

### 4. HomeView の引数を追加

`MainStack` から `navigationPath` を渡すので、`HomeView` 側に `@Binding` を追加します。  
プレビューでは `.constant([])` を使ってエラーを回避します。

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
        }
        .padding()
        .navigationTitle("ToDoリスト")
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        HomeView(navigationPath: .constant([]))
    }
}
```

---

## コード全体

<img src="/images/todolist/MainStack.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
import SwiftUI
import SwiftData
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
