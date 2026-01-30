# ステップ6: 入力付きアラートを作る

タスク名の編集などで使える、テキスト入力付きアラートを作成します。

### 1. 拡張メソッドの作成

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
            TextField(placeholder, text: text)

            Button("キャンセル", role: .cancel) {
            }

            Button(actionButtonTitle) {
                action()
            }
            .disabled(text.wrappedValue.isEmpty)

        } message: {
            Text(message)
        }
    }
}
```

- `TextField` を alert の中に置くと入力付きアラートになります。
- 入力が空の時はボタンを押せないようにします。

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
