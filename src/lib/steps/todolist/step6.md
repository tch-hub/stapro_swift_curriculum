# ステップ6: 入力付きアラートを作る

タスク名の編集などで使える、テキスト入力付きアラートを作成します。

### 1. 拡張メソッドの作成

```swift
import SwiftUI

// Viewを拡張して、テキスト入力付きのアラートを使えるようにする
extension View {
    // テキストフィールド付きアラートを表示するメソッド
    func textFieldAlert(
        isPresented: Binding<Bool>,  // アラートの表示/非表示の管理
        title: String,               // アラートのタイトル
        message: String,             // アラートの説明文
        text: Binding<String>,       // 入力されたテキストを紐付ける変数
        placeholder: String = "",    // プレースホルダー（入力のヒント）
        actionButtonTitle: String = "確認", // 実行ボタンのラベル
        action: @escaping () -> Void // 実行ボタンを押した時の処理
    ) -> some View {
        // 標準のalertの中にTextFieldを配置する
        self.alert(title, isPresented: isPresented) {
            // テキスト入力フィールド
            TextField(placeholder, text: text)

            // キャンセルボタン（role: .cancelを指定すると左側に配置される）
            Button("キャンセル", role: .cancel) {
                // キャンセル時は何もしない（自動的に閉じる）
            }

            // 実行ボタン
            Button(actionButtonTitle) {
                action()
            }
            // 入力が空っぽの場合はボタンを押せないように無効化する
            .disabled(text.wrappedValue.isEmpty)

        } message: {
            // メッセージ本文
            Text(message)
        }
    }
}
```

通常の `.alert` モディファイアの中に `TextField` を配置することで、OS標準のスタイルに沿ったテキスト入力付きアラートを作成しています。  
バインディングされた `text` 変数を通じて入力内容を受け取り、`.disabled(text.wrappedValue.isEmpty)` を設定することで、何も入力されていない状態では実行ボタンが押せないように制御しています。

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
import SwiftUI

extension View {
    func textFieldAlert(
        isPresented: Binding<Bool>,
        title: String,
        message: String,
        text: Binding<String>,
        placeholder: String = "",
        actionButtonTitle: String = "確認",
        action: @escaping () -> Void
    ) -> some View {
        self.alert(title, isPresented: isPresented) {
            // ここにTextFieldを配置するだけで、OS標準の入力付きアラートになる
            TextField(placeholder, text: text)

            // キャンセルボタン（自動的に閉じる）
            Button("キャンセル", role: .cancel) {
                // キャンセル時の処理があればここに書く
                // text.wrappedValue = "" // 必要ならクリアする
            }

            // 実行ボタン
            Button(actionButtonTitle) {
                action()
            }
            .disabled(text.wrappedValue.isEmpty) // 入力が空なら押せないようにする

        } message: {
            Text(message)
        }
    }
}

// --- 使い方 ---

#Preview {
    struct PreviewWrapper: View {
        @State private var showDialog = false
        @State private var inputText = ""
        @State private var displayString = "ここが変わります"

        var body: some View {
            VStack(spacing: 20) {
                Text(displayString)
                    .font(.title)

                Button("名前を変更") {
                    inputText = "" // 開く前に初期化
                    showDialog = true
                }
                .buttonStyle(.borderedProminent)
            }
            .textFieldAlert(
                isPresented: $showDialog,
                title: "名前の変更",
                message: "新しい名前を入力してください。",
                text: $inputText,
                placeholder: "例: タスクA",
                action: {
                    displayString = inputText
                }
            )
        }
    }
    return PreviewWrapper()
}
```
