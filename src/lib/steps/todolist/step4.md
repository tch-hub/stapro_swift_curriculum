# ステップ16: Alert コンポーネントの実装

<script>
    import {base} from '$app/paths';
</script>

## Alert.swift の作成

`Components/`フォルダに`Alert.swift`を作成します：

```swift
struct DeleteConfirmationModifier: ViewModifier {
    @Binding var isPresented: Bool
    let onDelete: () -> Void

    func body(content: Content) -> some View {
        content
            .confirmationDialog(
                "このタスクを削除しますか？",
                isPresented: $isPresented
            ) {
                Button("削除", role: .destructive) {
                    onDelete()
                }
                Button("キャンセル", role: .cancel) {}
            }
    }
}

#Preview {
    struct PreviewWrapper: View {
        @State private var showDialog = true

        var body: some View {
            Text("長押し or 削除")
                .padding()
                .deleteConfirmation(
                    isPresented: $showDialog,
                    onDelete: {}
                )
        }
    }

    return PreviewWrapper()
}


```

## 各プロパティの説明

| プロパティ            | 説明                                 |
| --------------------- | ------------------------------------ |
| `title`               | アラートのタイトル                   |
| `message`             | アラートの説明メッセージ             |
| `primaryButtonText`   | メインボタンのテキスト               |
| `secondaryButtonText` | キャンセルボタンのテキスト           |
| `primaryAction`       | メインボタンをタップした時の処理     |
| `secondaryAction`     | キャンセルボタンをタップした時の処理 |

