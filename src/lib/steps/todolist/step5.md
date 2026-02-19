# ステップ5: タスク入力バーを作る(InputView.swift)

### ステップ5終了時の完成イメージ

<img src="/images/todolist/TaskInputView.png" alt="InputViewの完成イメージ" class="mobile-screenshot-top" />

## 1. 基本構造の作成

`Components/InputView.swift` を開き、中身を以下のように書き換えて、タスク追加などを行うための汎用的な入力バーの土台を作ります。

```swift
import SwiftUI

struct InputView: View {
    @Binding var text: String       // 入力中のテキスト（親と共有）
    let onAdd: () -> Void           // ボタンを押した時の処理

    // カスタマイズ可能な設定（デフォルト値あり）
    var placeholder: String = "新しいタスクを追加..."
    var buttonIcon: String = "arrow.up.circle.fill"

    var body: some View {
        // レイアウトの実装をここに書きます
        Text("Input Bar")
    }
}
```

このコンポーネントで定義している4つのプロパティについて解説します。

- **`@Binding var text: String`**
  親ビュー（この部品を使う側）とテキストデータを共有するためのプロパティです。`@State` ではなく `@Binding` を使うことで、入力された文字が親ビューの変数にもリアルタイムで反映されるようになります。  
  データベースに値(タスク内容など)を保存するために`@Binding`を使います。

- **`let onAdd: () -> Void`**
  ボタンが押された時に実行したい「処理」を受け取るためのプロパティです。データの保存処理などをここに入れます。

- **`var placeholder: String = ...`**
  入力欄に表示するプレイスホルダーです。初期値（デフォルト値）を設定しているため、親ビューから指定せずに省略することも可能です。

- **`var buttonIcon: String = ...`**
  送信ボタンのアイコン名です。こちらも初期値を設定しており、必要に応じて変更できるようにしています。

## 2. 入力チェックとフォーカス制御

入力が空でないかをチェックする機能と、キーボードのフォーカス制御を追加します。`struct InputView: View {` の中に追加してください。

```swift
// キーボードのフォーカス状態を管理
@FocusState private var isFocused: Bool

// 入力が空でないか判定（空白のみは無効）
private var isValid: Bool {
    !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
}

// 送信時の処理
private func handleSubmit() {
    guard isValid else { return } // 無効なら何もしない
    onAdd()
}
```

ここで行っている3つの処理について解説します。

- **`@FocusState private var isFocused: Bool`**
  入力中かどうかを管理する変数です。
  - 後ほど `TextField` に `.focused($isFocused)` と紐付けることで、プログラムからキーボードを閉じたり開いたりできるようになります。

- **`private var isValid: Bool`**
  「入力内容が有効かどうか」を判定する変数です。
  - `trimmingCharacters` を使って、スペースや改行だけの入力を「無効（空）」とみなすようにしています。これにより、空のタスクが作られるのを防ぎます。
  - `whitespacesAndNewlines`でスペースと改行を削除しています。
  - `!text.isEmpty`で入力欄が空かどうかを判定しています。

- **`private func handleSubmit()`**
  送信ボタンが押されたり、Enterキーが押されたりした時に呼ぶ関数です。
  - `guard isValid else { return }` というのは、「もし無効なら、ここで帰る（何もしない）」というガード（門番）の役割です。有効な場合だけ `onAdd()` を実行します。
- 入力欄からスペースなどを削除した後に空かどうかを判定することでスペースだけの入力値にならないようにしています。

## 3. UIの実装: 入力エリアと背景

`body` の中身を書き換えて、レイアウトの土台を作ります。半透明の背景の上に、入力欄と送信ボタンを横並びにする `HStack` を配置します。

```swift
    var body: some View {
        HStack(alignment: .bottom, spacing: 12) {

            // ①ここにテキスト入力欄を追加します

            // ②ここに送信ボタンを追加します

        }
        .padding(16)
        .background(.ultraThinMaterial) // 半透明の背景（すりガラス効果）
    }
```

## 4. UIの実装: テキスト入力欄

`HStack` の中にテキスト入力欄（TextField）を追加します。`// ①ここにテキスト入力欄を追加します` の部分です。

```swift
            // テキスト入力エリア
            TextField(placeholder, text: $text, axis: .vertical)
                .focused($isFocused)
                .padding(.vertical, 10)
                .padding(.horizontal, 16)
                .background(
                    Capsule() // 丸みを帯びた背景
                        .fill(Color(.secondarySystemBackground))
                )
                .onSubmit { handleSubmit() } // キーボードのEnterキーで送信
```

- `TextField(axis: .vertical)`テキストが長くなって複数行になった場合に入力欄の高さを自動で調整します。
- `Capsule()`: メッセージアプリのように、入力欄の背景を丸くしています。
- `.onSubmit`: ソフトウェアキーボードの「確定」ボタンが押された時の動作を指定します。

## 5. UIの実装: 送信ボタン

入力欄の右隣に送信ボタンを追加します。`// ②ここに送信ボタンを追加します` の部分です。

```swift
            // 送信ボタン
            Button(action: handleSubmit) {
                Image(systemName: buttonIcon)
                    .resizable()
                    .frame(width: 32, height: 32)
                    // 入力が有効なら青、無効ならグレー
                    .foregroundStyle(isValid ? Color.accentColor : Color(.systemGray4))
            }
            .disabled(!isValid) // 入力が空の時は押せないようにする
            .padding(.bottom, 4) // 入力欄と高さを合わせるための微調整
```

送信ボタンの実装について解説します。

- **`Button(action: handleSubmit)`**
  ボタンが押された時に、先ほど定義した `handleSubmit` メソッドを実行するように指定しています。

- **`.foregroundStyle(...)` / 三項演算子 (`? :`)**
  ボタンの色を `isValid` の状態によって切り替えています。
  - `isValid` が `true`（入力あり）なら `Color.accentColor`（青色など）
  - `false`（入力なし）なら `Color(.systemGray4)`（グレー）
    このようにすることで、ユーザーに「今は押せない」ということを視覚的に伝えます。

- **`.disabled(!isValid)`**
  見た目だけでなく、機能としてもボタンを押せないようにします。
  - `!isValid` は「有効ではない（＝無効）」という意味です。
  - これにより、グレーの状態でボタンを連打されても、空のタスクが登録されることはありません。

- **`.padding(.bottom, 4)`**
  隣にあるテキスト入力欄と高さを揃えるための微調整です。`HStack(alignment: .bottom)` を使っているため、アイコンの位置を少し持ち上げることでバランスを取っています。

## 6. プレビューの作成

実際に動かして確認するためのプレビューを作成します。`InputView` の外側（ファイルの末尾）に追加してください。

```swift
#Preview {
    struct PreviewWrapper: View {
        @State var text = ""
        @State var tasks: [String] = ["入力欄にテキストを入力すると", "リストにアイテムを追加できます"]

        var body: some View {
            ZStack(alignment: .bottom) {
                List(tasks, id: \.self) { task in
                    Text(task)
                }

                InputView(text: $text) {
                    tasks.append(text)
                    text = "" // 送信後にクリア
                }
            }
        }
    }
    return PreviewWrapper()
}
```

- `#Preview`: このブロック内に書いたコードがXcodeのプレビュー画面に表示されます。

  ※ このコードは、実際のアプリ本体には必須ではありませんが、プレビュー上で動作や状態変化を確認するためのテスト用ラッパーとして書かれています。  
  ※ 実行せずに確認できるようにしています。

---

## コード全体

<img src="/images/todolist/TaskInputView.png" alt="InputViewの完成イメージ" class="mobile-screenshot" />

### Components/InputView.swift

```swift
import SwiftUI

struct InputView: View {
    @Binding var text: String
    let onAdd: () -> Void

    var placeholder: String = "新しいタスクを追加..."
    var buttonIcon: String = "arrow.up.circle.fill"

    @FocusState private var isFocused: Bool

    private var isValid: Bool {
        !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    var body: some View {
        HStack(alignment: .bottom, spacing: 12) {
            TextField(placeholder, text: $text, axis: .vertical)
                .focused($isFocused)
                .padding(.vertical, 10)
                .padding(.horizontal, 16)
                .background(
                    Capsule()
                        .fill(Color(.secondarySystemBackground))
                )
                .onSubmit { handleSubmit() }

            Button(action: handleSubmit) {
                Image(systemName: buttonIcon)
                    .resizable()
                    .frame(width: 32, height: 32)
                    .foregroundStyle(isValid ? Color.accentColor : Color(.systemGray4))
                    .scaleEffect(isValid ? 1.0 : 0.9)
                    .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isValid)
            }
            .disabled(!isValid)
            .padding(.bottom, 4)
        }
        .padding(16)
        .background(.ultraThinMaterial)
    }

    private func handleSubmit() {
        guard isValid else { return }
        onAdd()
    }
}

#Preview {
    struct PreviewWrapper: View {
        @State var text = ""
        @State var tasks: [String] = ["入力欄にテキストを入力すると", "リストにアイテムを追加できます"]

        var body: some View {
            ZStack(alignment: .bottom) {
                List(tasks, id: \.self) { task in
                    Text(task)
                }

                InputView(text: $text) {
                    tasks.append(text)
                    text = ""
                }
            }
        }
    }
    return PreviewWrapper()
}
```
