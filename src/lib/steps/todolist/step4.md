# ステップ4: 空の状態を表示するコンポーネントを作る

## このステップで学ぶこと

タスクがない時や、タブが選択されていない時に表示する「空の状態（Empty State）」の画面を作成します。

LINEやTwitterなどのアプリでも、メッセージがない時に「メッセージがありません」といったメッセージが表示されますよね。このように、リストが空っぽの時に真っ白な画面を表示するのではなく、ユーザーに状況を伝えるアイコンやテキストを表示すると、より親切なアプリになります。

### 1. 新しいファイルを作成する

まず、`Components` フォルダ内に `EmptyStateView.swift` という新しいファイルを作成しましょう。

### 2. 基本的な構造を書く

それでは、一つずつコードを書いていきましょう。

#### 📦 手順① import文とViewの骨組みを書く

まず、必要な部品を読み込んで、基本的な構造を作ります。

```swift
import SwiftUI

struct EmptyStateView: View {
    let hasSelectedTab: Bool

    var body: some View {
        // ここにこれから内容を書いていきます
    }
}
```

**各部分の説明：**

- **`import SwiftUI`**: SwiftUIという画面を作るための道具箱を使えるようにします
- **`struct EmptyStateView: View`**: 新しいビュー（画面の部品）を作る宣言です
- **`let hasSelectedTab: Bool`**: この部品を使う時に、外から「タブが選択されているかどうか」の情報を受け取ります
  - `Bool` は真偽値（`true` か `false`）を表す型です
- **`var body: some View`**: 実際に表示する内容をここに書きます

#### 🔀 手順② 条件分岐を追加する

次に、**`var body: some View { }` の中**に条件分岐を書きます。コメントの部分を以下のコードに置き換えてください。

```swift
if hasSelectedTab {
    // タブが選択されている時の表示（これから書きます）
} else {
    // タブが選択されていない時の表示（これから書きます）
}
```

**条件分岐の説明：**

- `hasSelectedTab` の値によって、表示する内容を切り替えています
- `true` の場合：「タスクはまだありません」を表示
- `false` の場合：「タブを選択してください」を表示

#### 📱 手順③ タブが選択されている時の画面を作る

**`if hasSelectedTab { }` の中**にコードを書きます。コメントの部分を以下のコードに置き換えてください。

```swift
// タブは選ばれているが、タスクがない場合
VStack {
    Image(systemName: "checkmark.circle")
        .font(.system(size: 48))
        .foregroundColor(.gray)
    Text("タスクはまだありません")
        .foregroundColor(.gray)
        .padding(.top, 8)
}
.frame(maxWidth: .infinity, maxHeight: .infinity)
```

**各部分の説明：**

- **`VStack`**: 「Vertical Stack（縦方向のスタック）」の略で、中身を縦に並べる箱のようなものです
- **`Image(systemName: "checkmark.circle")`**: Appleが用意しているチェックマークのアイコンを表示します
- **`.font(.system(size: 48))`**: アイコンのサイズを48ポイントに設定します（大きめのサイズ）
- **`.foregroundColor(.gray)`**: アイコンの色をグレーにします
- **`Text("タスクはまだありません")`**: 文字を表示します
- **`.padding(.top, 8)`**: 上に8ポイントの余白を追加します（アイコンとテキストの間に少し隙間を作る）
- **`.frame(maxWidth: .infinity, maxHeight: .infinity)`**: 画面いっぱいに広げて、中央に配置します

#### 📋 手順④ タブが未選択の時の画面を作る

**`else { }` の中**にコードを書きます。コメントの部分を以下のコードに置き換えてください。

```swift
// タブ自体が選ばれていない場合
VStack {
    Image(systemName: "list.bullet")
        .font(.system(size: 48))
        .foregroundColor(.gray)
    Text("タブを選択してください")
        .foregroundColor(.gray)
        .padding(.top, 8)
}
.frame(maxWidth: .infinity, maxHeight: .infinity)
```

`if` の時とほとんど同じ構造ですが、アイコンとテキストが違います：

- **`Image(systemName: "list.bullet")`**: リストのアイコンを表示
- **`Text("タブを選択してください")`**: ユーザーに次の行動を促すメッセージ

#### 👀 手順⑤ プレビュー機能を追加する

最後に、**`EmptyStateView` の構造体の下**（閉じ括弧 `}` の後）に、プレビュー用のコードを追加します。

```swift
#Preview {
    EmptyStateView(hasSelectedTab: true)
}
```

**プレビューの説明：**

- `#Preview` の中に書いたビューが、Xcodeのプレビュー画面に表示されます
- `hasSelectedTab: true` を指定しているので、「タスクはまだありません」の方が表示されます
- `false` に変えると、「タブを選択してください」の方を確認できます

これで `EmptyStateView.swift` が完成しました！🎉

---

## なぜこのような構成にするのか

このコンポーネントは2つの状態を表示できるように設計されています：

1. **タブが選択されていない場合**（アプリを開いたばかり）
   - リストアイコンと「タブを選択してください」を表示
   - ユーザーに次の行動（タブを選ぶ）を促します

2. **タブは選択されているがタスクがない場合**
   - チェックマークアイコンと「タスクはまだありません」を表示
   - タブは選ばれているけど、まだタスクが追加されていない状態を伝えます

このように、状況に応じて適切なメッセージを表示することで、ユーザーが迷わずにアプリを使えるようになります。

---

## 完成したコード全体

<img src="/images/todolist/EmptyStateView.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
import SwiftUI

struct EmptyStateView: View {
    let hasSelectedTab: Bool

    var body: some View {
        if hasSelectedTab {
            VStack {
                Image(systemName: "checkmark.circle")
                    .font(.system(size: 48))
                    .foregroundColor(.gray)
                Text("タスクはまだありません")
                    .foregroundColor(.gray)
                    .padding(.top, 8)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        } else {
            VStack {
                Image(systemName: "list.bullet")
                    .font(.system(size: 48))
                    .foregroundColor(.gray)
                Text("タブを選択してください")
                    .foregroundColor(.gray)
                    .padding(.top, 8)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
}

#Preview {
    // プレビューで見た目を確認
    EmptyStateView(hasSelectedTab: true)
}
```
