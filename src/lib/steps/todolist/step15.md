# ステップ15: 画面遷移の土台を作る(MainStack.swift)

## 1. 画面IDの定義

`Views/MainStack.swift` を開き、中身を実装していきます。
まず、`import` 文の下に、アプリ内の画面を識別するためのIDを定義します。

```swift
import SwiftUI
import SwiftData

// import文の下に追加
// アプリ内の画面を識別するためのID
enum ScreenID: String {
    case home      // ホーム画面
    case tabManage // タブ管理画面
}
```

## 2. 遷移情報の定義

続いて、`enum ScreenID` の閉じ括弧 `}` の下に、遷移情報を保存するためのデータ型を定義します。

```swift
// ScreenID定義の下に追加
// NavigationStackで扱うためのデータ型
struct NavigationItem: Hashable {
    let id: ScreenID
}
```

## 3. MainStackの作成

最後に、`struct NavigationItem` の下に、画面遷移を管理するメインのViewを作ります。

```swift
// NavigationItem定義の下に追加（または既存のMainStackを置き換え）
struct MainStack: View {
    // 画面遷移の履歴を管理するパス
    @State private var navigationPath: [NavigationItem] = []

    var body: some View {
        NavigationStack(path: $navigationPath) {
            // ルートビュー（最初に表示する画面）
            HomeView(navigationPath: $navigationPath)
                // 画面遷移の定義：IDに対応する画面を表示
                .navigationDestination(for: NavigationItem.self) { item in
                    switch item.id {
                    case .tabManage:
                        TabManageView() // タブ管理画面へ
                    default:
                        EmptyView()
                    }
                }
        }
    }
}
```

## 4. HomeViewの修正

`Views/HomeView.swift` を開き、`MainStack` からデータを受け取れるようにコードを修正します。

**1. 変数の追加**
`struct HomeView: View {` のすぐ下に、`@Binding` 変数を追加してください。

```swift
struct HomeView: View {
    // ↓この行を追加
    @Binding var navigationPath: [NavigationItem]

    var body: some View {
        // ...
```

**2. プレビューの修正**
ファイルの末尾にある `#Preview` の中身を修正します。引数にダミーデータ (`.constant([])`) を渡します。

```swift
#Preview {
    NavigationStack {
        // ↓引数(navigationPath)を追加
        HomeView(navigationPath: .constant([]))
    }
}
```

---

## コード全体

<img src="/images/todolist/MainStack.png" alt="MainStackの完成イメージ" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

### Views/MainStack.swift

```swift
import SwiftUI
import SwiftData

/// 画面ID
enum ScreenID: String {
    case home      // ホーム画面
    case tabManage // タブ管理画面
}

/// 画面遷移の情報
struct NavigationItem: Hashable {
    let id: ScreenID
}

/// メインスタック
struct MainStack: View {
    @State private var navigationPath: [NavigationItem] = []

    var body: some View {
        NavigationStack(path: $navigationPath) {
            // ホーム画面を表示
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
    }
}

#Preview {
    MainStack()
        .modelContainer(for: [ToDoTab.self, ToDoTask.self], inMemory: true)
}
```

### Views/HomeView.swift

```swift
import SwiftUI

/// ホーム画面（枠だけ作成）
struct HomeView: View {
    // 親から受け取る遷移パス
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
        // ダミーのデータ（.constant）を渡す
        HomeView(navigationPath: .constant([]))
    }
}
```
