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

**画面IDの役割:**

- **`enum ScreenID`**
  アプリ内の各画面に一意の識別子を付けるための列挙型です。文字列（`"home"`, `"tabManage"`）を直接使うこともできますが、enumを使うことで以下のメリットがあります:
  - **タイプミスを防げる**: `"tabManage"` と書くべきところを `"tabmanage"` と書いてもコンパイルエラーにならず、バグの原因になります。enumなら `.tabManage` とタイプミスすると即座にエラーが出ます。
  - **補完が効く**: Xcodeが自動補完してくれるので、入力ミスが減ります。
  - **変更に強い**: 画面名を変更したい時、enumの定義を1箇所変えるだけで済みます。

- **`case home` / `case tabManage`**
  それぞれホーム画面とタブ管理画面を表します。今後、画面が増えたらここに `case` を追加していきます。

## 2. 遷移情報の定義

続いて、`enum ScreenID` の閉じ括弧 `}` の下に、遷移情報を保存するためのデータ型を定義します。

```swift
// ScreenID定義の下に追加
// NavigationStackで扱うためのデータ型
struct NavigationItem: Hashable {
    let id: ScreenID
}
```

**NavigationItemの役割:**

- **`struct NavigationItem`**
  画面遷移の情報を保持するための構造体です。現時点では `id` だけですが、将来的に「遷移先の画面に渡すデータ」を追加できるように、structで包んでいます。

- **`Hashable` プロトコル**
  `NavigationStack` の `path` パラメータは、`Hashable` に準拠した型の配列である必要があります。`Hashable` は「値を一意に識別できる」ことを保証するプロトコルで、SwiftUIがナビゲーション履歴を正しく管理するために必要です。

  `ScreenID` は `enum` なので自動的に `Hashable` ですが、それを `struct` で包む場合は明示的に `Hashable` を宣言します。幸い、中身（`id: ScreenID`）が `Hashable` なので、自動的に準拠してくれます。

**なぜ直接 `ScreenID` を使わないのか？**
将来、画面遷移時にデータを渡したくなった時（例: タスクの詳細画面に遷移する際、どのタスクかを示すIDを渡す）、`NavigationItem` に新しいプロパティを追加するだけで対応できます。

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

**画面遷移の仕組み:**

- **`@State private var navigationPath: [NavigationItem] = []`**
  画面遷移の履歴を管理する配列です。この配列に `NavigationItem` を追加すると画面が遷移し、削除すると前の画面に戻ります。
  - 空の配列 `[]`: ルート画面（HomeView）のみ表示
  - `[NavigationItem(id: .tabManage)]`: ホーム → タブ管理画面
  - `[NavigationItem(id: .tabManage), NavigationItem(id: .home)]`: ホーム → タブ管理 → ホーム（2階層）

- **`NavigationStack(path: $navigationPath)`**
  `path` に配列をバインディング（`$`）することで、配列の変更が自動的に画面遷移に反映されます。逆に、ユーザーが戻るボタンを押すと、配列から要素が削除されます（双方向バインディング）。

- **`HomeView(navigationPath: $navigationPath)`**
  ルートビュー（最初に表示する画面）です。`navigationPath` を渡すことで、HomeViewから他の画面に遷移できるようにしています。

- **`.navigationDestination(for: NavigationItem.self) { item in ... }`**
  「`NavigationItem` が追加されたら、どの画面を表示するか」を定義します。`switch` 文で `item.id` を判定し、対応する画面を返します。
  - `.tabManage` → `TabManageView()` を表示
  - `default` → `EmptyView()`（何も表示しない）

**画面遷移の流れ:**

1. HomeViewで何らかのアクション（ボタンタップなど）が発生
2. `navigationPath.append(NavigationItem(id: .tabManage))` を実行
3. `navigationPath` が更新される
4. SwiftUIが `.navigationDestination` を見て、`.tabManage` に対応する `TabManageView()` を表示
5. ユーザーが戻るボタンを押すと、`navigationPath` から要素が削除され、HomeViewに戻る

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

**HomeViewの修正ポイント:**

- **`@Binding var navigationPath: [NavigationItem]`**
  親（MainStack）から渡された `navigationPath` を受け取ります。`@Binding` を使うことで、HomeView内で `navigationPath` を変更すると、親の `navigationPath` も自動的に更新されます。これにより、HomeViewから画面遷移を実行できるようになります。

- **`.constant([])`（プレビュー用）**
  プレビューでは実際の画面遷移は不要なので、ダミーの固定値（`.constant`）を渡します。`.constant([])` は「変更できない空の配列」を意味し、プレビューが正常に動作するための最小限のデータです。

---

## コード全体

<img src="/images/todolist/MainStack.png" alt="MainStackの完成イメージ" class="mobile-screenshot" />

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
