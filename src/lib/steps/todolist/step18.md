# ステップ18: TextFieldAlertModifier の実装

<script>
    import {base} from '$app/paths';
</script>

## TextFieldAlertModifier.swift の作成

`Components/`フォルダに`TextFieldAlertModifier.swift`を作成します：

```swift
import SwiftUI

struct TextFieldAlert: ViewModifier {
    @Binding var isPresented: Bool
    let title: String
    let message: String
    @Binding var text: String
    let placeholder: String
    let onConfirm: () -> Void

    func body(content: Content) -> some View {
        content
            .sheet(isPresented: $isPresented) {
                VStack(spacing: 16) {
                    Text(title)
                        .font(.headline)
                        .fontWeight(.bold)

                    Text(message)
                        .font(.body)
                        .foregroundColor(.gray)

                    TextField(placeholder, text: $text)
                        .textFieldStyle(.roundedBorder)
                        .padding(.vertical, 8)

                    HStack(spacing: 12) {
                        Button("キャンセル") {
                            isPresented = false
                            text = ""
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .border(Color.gray)
                        .foregroundColor(.gray)

                        Button("確認") {
                            onConfirm()
                            isPresented = false
                            text = ""
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .disabled(text.isEmpty)
                    }
                }
                .padding()
            }
    }
}

extension View {
    func textFieldAlert(
        isPresented: Binding<Bool>,
        title: String,
        message: String,
        text: Binding<String>,
        placeholder: String = "",
        onConfirm: @escaping () -> Void
    ) -> some View {
        self.modifier(TextFieldAlert(
            isPresented: isPresented,
            title: title,
            message: message,
            text: text,
            placeholder: placeholder,
            onConfirm: onConfirm
        ))
    }
}

#Preview {
    Text("プレビュー")
        .textFieldAlert(
            isPresented: .constant(true),
            title: "タブ名を変更",
            message: "新しいタブ名を入力してください",
            text: .constant(""),
            placeholder: "タブ名",
            onConfirm: { }
        )
}
```

## ViewModifier について

ViewModifierは、既存のビューに機能を追加するための仕組みです。このモディファイアは、テキスト入力を伴うアラートを簡単に表示できます。

## 使用例

```swift
@State private var showingRenameTab = false
@State private var newTabName = ""

// ビュー内
.textFieldAlert(
    isPresented: $showingRenameTab,
    title: "タブ名を変更",
    message: "新しいタブ名を入力してください",
    text: $newTabName,
    placeholder: "タブ名",
    onConfirm: {
        // タブ名更新処理
    }
)
```

## 次のステップへ

次は、これまで実装したコンポーネントを統合して、全体を整えます。
