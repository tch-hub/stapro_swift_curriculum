# ステップ4: Alert コンポーネントの実装

<script>
    import {base} from '$app/paths';
</script>

## Alert.swift の作成

`Components/`フォルダに`Alert.swift`を作成します：

```swift
import SwiftUI

extension View {
    func deleteAlert(
        isPresented: Binding<Bool>,
        title: String = "削除確認",
        message: String = "このタスクを完全に削除しますか？",
        deleteText: String = "削除",
        cancelText: String = "キャンセル",
        onDelete: @escaping () -> Void
    ) -> some View {
        self.alert(title, isPresented: isPresented) {
            Button(deleteText, role: .destructive) {
                onDelete()
            }
            Button(cancelText, role: .cancel) {}
        } message: {
            Text(message)
        }
    }
}

// --- 使い方 ---

#Preview {
    struct PreviewWrapper: View {
        @State private var showSheet = false
        @State private var showAlert = false

        var body: some View {
            VStack(spacing: 40) {

                // パターンB: 中央に出る（iPadでもキャンセルボタン有り）
                Button("パターンB: アラートで確認") { showAlert = true }
                    .deleteAlert(
                        isPresented: $showAlert,
                        deleteText: "実行",
                        onDelete: {
                            print("アラートで削除")
                        }
                    )
            }
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

