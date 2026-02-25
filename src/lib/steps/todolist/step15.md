# ステップ15: 画面を切り替える準備をしよう (MainStack.swift)

### ステップ15終了時の完成イメージ
<img src="/images/todolist/MainStack.png" alt="MainStackの完成イメージ" class="mobile-screenshot-top" />

## 1. 画面の名前を決めよう

まずは `Views/MainStack.swift` を開いて、アプリの中にある画面に名前（ID）をつけていきましょう。
`import` 文の下に、以下のコードを追加します。

```swift
import SwiftUI
import SwiftData

// アプリにある画面の名前をリストアップします
enum ScreenID: String {
    case home      // ホーム画面
    case tabManage // タブ管理画面
}
```

- **`enum` (列挙型)**
  アプリ内で使用する「画面の種類」などを、あらかじめリストの形にまとめて定義しておくための仕組みです。
  「ホーム画面」や「タブ管理画面」を単なる文字列（`"home"` など）で記述するよりも、`enum` を使うことで、もし入力ミス（例: `tabmanage`）があった場合にXcodeがすぐにエラーとして教えてくれるようになり、ミスやバグを未然に防ぐことができます。

---

## 2. 画面を移動する動作を定義しよう

次に、先ほど書いたコードの下に、画面を移動するための`NavigationItem`を作ります。

```swift
// 画面の移動動作を管理するための構造体
struct NavigationItem: Hashable {
    let id: ScreenID
}
```

- **`NavigationItem`**
  画面を切り替える際に、「次はどの画面に遷移するか」という画面情報を保持するための構造体です。
- **`Hashable` (ハッシュアブル)**
  システム側（iPhone）が「それぞれの `NavigationItem` は別々のものである」と正確に区別できるようにするための仕組みです。画面の遷移履歴を正しく管理するために必要な設定と考えましょう。

---

## 3. 画面の切り替えを管理する「メイン画面」を作ろう

いよいよ画面の切り替えをコントロールする `MainStack` を作ります。
先ほどのコードの下に、以下のコードを書いてください（最初からある `MainStack` があれば、それを書き換えてください）。

```swift
// 👇 NavigationItemの下に追加
struct MainStack: View {
    // 画面の移動履歴をメモしておく配列（リスト）
    @State private var navigationPath: [NavigationItem] = []

    var body: some View {
        
        NavigationStack(path: $navigationPath) {// 画面の重なりを管理する箱
            HomeView(navigationPath: $navigationPath) // 最初に表示する画面（ホーム画面）
                // 渡されたNavigationItemに応じて、どの画面を表示するか決めるルール
                .navigationDestination(for: NavigationItem.self) { item in
                    switch item.id {
                    case .tabManage:
                        TabManageView() // タブ管理画面へ移動
                    default:
                        EmptyView()     // それ以外は何も表示しない
                    }
                }
        }
    }
}
```

- **`@State private var navigationPath: [NavigationItem] = []`**
  これは「今までどの画面を見てきたか」という画面遷移の履歴を記録しておく配列です。Webブラウザの「戻る」ボタンの履歴のような役割を果たします。
  - `[]` 空の状態だと、「ホーム画面」が表示されます。
  - この履歴に新しい `NavigationItem` が追加されると、設定したルールに従って自動的に次の画面へ切り替わります。
- **`NavigationStack(path: ...)`**
  画面をトランプのように上に重ねて切り替えていくための、UIを管理する仕組みです。
- **`.navigationDestination(...)`**
  「もし『タブ管理画面への移動指示』が来たら、対象の画面を表示する」というルールを決めている部分です。

---

## 4. ホーム画面も書き換えよう

メイン画面で「移動履歴（`navigationPath`）」ができたので、それを「ホーム画面（`HomeView`）」でも使えるようにします。
`Views/HomeView.swift` を開いてください。

### ① 移動履歴を受け取る準備
`struct HomeView: View {` のすぐ下に、新しい変数を追加します。

```swift
struct HomeView: View {
    @Binding var navigationPath: [NavigationItem]

    var body: some View {
        // ...
```

### ② プレビューエラーを直す
①のコードを追加すると、ファイルの一番下にあるプレビューでエラーが出るはずです。以下のように修正しましょう。

```swift
#Preview {
    NavigationStack {
        // 👇 引数にダミーのデータ（.constant([])）を渡してエラーを消します
        HomeView(navigationPath: .constant([]))
    }
}
```

- `#Preview`: このブロック内に書いたコードがXcodeのプレビュー画面に表示されます。

  ※ このコードは、実際のアプリ本体には必須ではありませんが、プレビュー上で動作や状態変化を確認するためのテスト用ラッパーとして書かれています。  
  ※ 実行せずに確認できるようにしています。

---

## コード全体の確認

<img src="/images/todolist/MainStack.png" alt="MainStackの完成イメージ" class="mobile-screenshot" />

```swift title="Views/MainStack.swift"
import SwiftUI
import SwiftData

enum ScreenID: String {
    case home      
    case tabManage 
}

struct NavigationItem: Hashable {
    let id: ScreenID
}
struct MainStack: View {
    @State private var navigationPath: [NavigationItem] = []

    var body: some View {
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
    }
}

#Preview {
    MainStack()
        .modelContainer(for: [ToDoTab.self, ToDoTask.self], inMemory: true)
}
```

```swift title="Views/HomeView.swift"
import SwiftUI

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
