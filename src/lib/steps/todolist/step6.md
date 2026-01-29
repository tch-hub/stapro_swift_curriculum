# ステップ18: TextFieldAlertModifier の実装

<script>
    import {base} from '$app/paths';
</script>

## TextFieldAlertModifier.swift の作成

`Components/`フォルダに`TextFieldAlertModifier.swift`を作成します：

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
