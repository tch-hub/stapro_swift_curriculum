# ステップ5: タスク入力バーを作る(InputView.swift)

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

## 3. UIの実装: 入力エリアと背景

`body` の中身を書き換えて、レイアウトの土台を作ります。半透明の背景の上に、要素を横並びにする `HStack` を配置します。

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

- `.background(.ultraThinMaterial)`: iOSのナビゲーションバーなどで使われるような、半透明のガラスのような見た目になります。

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

- `.disabled(!isValid)`: 入力が無効（空など）の場合はボタンを押せないようにして、誤操作を防ぎます。
- `.foregroundStyle`: `isValid` フラグを使って、押せる時だけ青色になるようにしています。

## 6. プレビューの作成

実際に動かして確認するためのプレビューを作成します。`InputView` の外側（ファイルの末尾）に追加してください。

```swift
#Preview {
    struct PreviewWrapper: View {
        @State var text = ""
        @State var tasks: [String] = ["リストアイテム1", "リストアイテム2"]

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

---

## コード全体

<img src="/images/todolist/TaskInputView.png" alt="InputViewの完成イメージ" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

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
        @State var tasks: [String] = ["リストアイテム1", "リストアイテム2"]

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
