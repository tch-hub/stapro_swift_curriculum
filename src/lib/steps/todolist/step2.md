# ステップ2: タスクコンポーネントを作る(ToDoListItem.swift)

### ステップ2終了時の完成イメージ

<img src="/images/todolist/ToDoListItem.png" alt="ToDoListItemの完成イメージ" class="mobile-screenshot-top" />

## 1. 土台の作成

まず、`ToDoListItem.swift` の中身を以下のように書き換えて土台を作ります。

```swif ttitle="Components/ToDoListItem.swift"
import SwiftUI

struct ToDoListItem: View {
    var body: some View {
        Text("Task Item")
    }
}
```

`import SwiftUI`
SwiftUIをよみこむことで、TextやButtonなどの便利な機能を使えるようになります。  
`body`という部分は、画面に何を表示するかを書くところです。
ToDoListItemという構造体を作ります。これはアプリの画面のメイン部分です。Viewというルールに従って作ります。

## 2. プロパティの定義

`struct ToDoListItem: View {` の直下に追加してください。

```swift
// タスク名
let title: String
// 完了状態（trueなら完了、falseなら未完了）
let isCompleted: Bool
// タップされた時に実行する処理
let onToggle: () -> Void
```

このコードでは、`ToDoListItem` という「部品」を動かすために必要な設定項目（プロパティ）を3つ定義しています。

- **`let title: String`**  
  タスクの「名前」を受け取るための定数です。`String` は「文字列」を扱う型です。

- **`let isCompleted: Bool`**  
  タスクが「完了しているかどうか」を受け取るための定数です。`Bool` は `true`（はい/完了）か `false`（いいえ/未完了）のどちらかの値が入る型です。

- **`let onToggle: () -> Void`**  
  ユーザーがこのリスト項目をタップしたときに、「何をするか」という**処理そのもの（アクション）**を受け取るための定数です。
  - `() -> Void` という書き方は、「引数（入力）を受け取らず、戻り値（出力）もない関数」という意味です。
  - 例えば、「完了状態を反転させる」といった処理を、この部品を使う側（親となる画面）から渡してもらう仕組みです。

これらを `let` で定義しているのは、`ToDoListItem` というViewが作られた後に、勝手に中身が変わらないようにするためです。SwiftUIでは、データが変わるとView全体が新しく作り直されるため、Viewの中身自体は定数（`let`）にするのが基本となります。

## 3. UIの実装: ボタンとレイアウト

`body` の中身を書き換えて、要素を横並びにする `HStack` と、全体をタップ可能にする `Button` を配置します。

```swift
    var body: some View {
        Button(action: {
            // アニメーション付きで状態を切り替え
            withAnimation(.spring(response: 0.3, dampingFraction: 0.5)) {
                onToggle()
            }
        }) {
            HStack(spacing: 12) {
                // ここにチェックボックスとテキストを追加します

                Spacer()
            }
            .padding(.vertical, 12)
            // 行全体のどこを押しても反応するようにする背景設定
            .contentShape(Rectangle())
        }
        // ボタンのデフォルトの見た目を無効化（リスト内での強調表示などを防ぐ）
        .buttonStyle(.plain)
    }
```

## 4. UIの実装: チェックボックス

`HStack` の中に、完了状態に応じて見た目が変わるチェックボックス（円）を追加します。以下のコードを `// ここにチェックボックスとテキストを追加します` の部分に記述してください。

<img src="/images/todolist/check.png" alt="ToDoListItemの完成イメージ" class="mobile-screenshot" />

```swift
                // チェックボックス部分
                ZStack {
                    // 未完了時の枠
                    Circle()
                        .stroke(
                            isCompleted ? Color.accentColor : Color.secondary,
                            lineWidth: 2
                        )
                        .frame(width: 24, height: 24)

                    // 完了時のチェックマーク
                    if isCompleted {
                        Image(systemName: "checkmark.circle.fill")
                            .resizable()
                            .frame(width: 24, height: 24)
                            .foregroundStyle(Color.accentColor)
                            // 現れる時のアニメーション
                            .transition(.scale.combined(with: .opacity))
                    }
                }
                .padding(.leading, 4)

```

- `ZStack`: 要素を重ねて表示します。ここでは円の枠の上にチェックマークを重ねています。
- `.stroke(...)`: 円の枠線を描画します。
- `isCompleted` が `true` の時はアクセントカラー(SwiftUI が環境として用意していて、accentColorは何も指定しなければデフォルト値の青が使われる)になります。
- `isCompleted` が`false`の時はセカンダリーカラー(SwiftUI が環境として用意していて、secondaryは何も指定しなければデフォルト値のグレーが使われる)になります。
- `if isCompleted {...}`:もしisCompletedがtrueだったらチェック付き丸アイコンの画像を表示します。この画像はApple が用意している、完了を表すチェック付きの丸アイコン（システム標準アイコン）です。

## 5. UIの実装: テキスト

チェックボックスの右側にタスク名を表示させます。`ZStack` の閉じ括弧 `}` の後ろに追加してください。この画像のようにタスク名を表示させる箇所です。
<img src="/images/todolist/2-5.png" alt="ToDoListItemの完成イメージ" class="mobile-screenshot" />

```swift
                // タスク名のテキスト
                Text(title)
                    .font(.body)
                    // 完了時は色を薄くする
                    .foregroundStyle(isCompleted ? .secondary : .primary)
                    // 完了時は打ち消し線を入れる
                    .strikethrough(isCompleted, color: .secondary)
                    // テキストの変化を滑らかに
                    .contentTransition(.opacity)
```

- **`.foregroundStyle(isCompleted ? .secondary : .primary)`**
  文字の色を指定します。このモディファイアは「色」そのものを要求するため、`? :`（三項演算子）を使って、「完了なら薄い色、そうでなければ通常色」というふうに**渡す色を切り替えて**います。

- **`.strikethrough(isCompleted, color: .secondary)`**
  文字に取り消し線を引きます。このモディファイアは、最初の設定として「有効にするかどうか（`Boolean`）」を受け取る設計になっています。そのため、`isCompleted` をそのまま渡すだけで、自動的にオン/オフが切り替わります。

## 6. プレビューの作成

Xcodeのキャンバスで動作確認ができるように、プレビュー用のコードを追加します。ファイルの末尾に追加してください。

```swift
#Preview {
    // 状態変化を確認するためのラッパー
    struct PreviewWrapper: View {
        @State private var items = [
            (id: UUID(), title: "タップで状態切り替え", isCompleted: false)
        ]

        var body: some View {
            List {
                ForEach(items.indices, id: \.self) { index in
                    ToDoListItem(
                        title: items[index].title,
                        isCompleted: items[index].isCompleted
                    ) {
                        items[index].isCompleted.toggle()
                    }
                }
            }
            .listStyle(.plain)
        }
    }

    return PreviewWrapper()
}
```

- `#Preview`: このブロック内に書いたコードがXcodeのプレビュー画面に表示されます。
- `PreviewWrapper`: `ToDoListItem` だけでは状態（完了/未完了）を保持できないため、プレビュー用に仮の状態管理を行うビューを作っています。  
  ※ このコードは、実際のアプリ本体には必須ではありませんが、プレビュー上で動作や状態変化を確認するためのテスト用ラッパーとして書かれています。  
  ※ サンプルのタスクデータを用意し、リスト表示やチェック状態の切り替えが正しく動くかを、実行せずに確認できるようにしています。

---

## コード全体

```swift title="Components/ToDoListItem.swift"
import SwiftUI

struct ToDoListItem: View {
    let title: String
    let isCompleted: Bool
    let onToggle: () -> Void

    var body: some View {
        Button(action: {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.5)) {
                onToggle()
            }
        }) {
            HStack(spacing: 12) {
                // MARK: - チェックボックス
                ZStack {
                    Circle()
                        .stroke(
                            isCompleted ? Color.accentColor : Color.secondary,
                            lineWidth: 2
                        )
                        .frame(width: 24, height: 24)

                    if isCompleted {
                        Image(systemName: "checkmark.circle.fill")
                            .resizable()
                            .frame(width: 24, height: 24)
                            .foregroundStyle(Color.accentColor)
                            .transition(.scale.combined(with: .opacity))
                    }
                }
                .padding(.leading, 4)

                // MARK: - テキスト
                Text(title)
                    .font(.body)
                    .foregroundStyle(isCompleted ? .secondary : .primary)
                    .strikethrough(isCompleted, color: .secondary)
                    .contentTransition(.opacity)

                Spacer()
            }
            .padding(.vertical, 12)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Preview
#Preview {
    struct PreviewWrapper: View {
        @State private var items = [
            (id: UUID(), title: "タップで状態切り替え", isCompleted: false)
        ]

        var body: some View {
            List {
                ForEach(items.indices, id: \.self) { index in
                    ToDoListItem(
                        title: items[index].title,
                        isCompleted: items[index].isCompleted
                    ) {
                        items[index].isCompleted.toggle()
                    }
                }
            }
            .listStyle(.plain)
        }
    }

    return PreviewWrapper()
}
```
