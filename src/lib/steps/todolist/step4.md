# ステップ16: Alert コンポーネントの実装

<script>
    import {base} from '$app/paths';
</script>

## Alert.swift の作成

`Components/`フォルダに`Alert.swift`を作成します：

```swift
import SwiftUI

extension View {
    /// 削除確認ダイアログを表示する
    func deleteConfirmation(
        isPresented: Binding<Bool>,
        title: String = "このタスクを削除しますか？", // デフォルト値を設定
        deleteButtonText: String = "削除",
        cancelButtonText: String = "キャンセル",
        onDelete: @escaping () -> Void
    ) -> some View {
        self.confirmationDialog(
            title,
            isPresented: isPresented,
            titleVisibility: .visible
        ) {
            Button(deleteButtonText, role: .destructive) {
                onDelete()
            }
            Button(cancelButtonText, role: .cancel) { }
        }
    }
}

// --- 使い方 ---

#Preview {
    struct PreviewWrapper: View {
        @State private var showDefault = false
        @State private var showCustom = false

        var body: some View {
            VStack(spacing: 20) {
                // パターン1: デフォルトの文言で使用
                Button("デフォルト設定") {
                    showDefault = true
                }
                .deleteConfirmation(isPresented: $showDefault) {
                    print("デフォルトの削除実行")
                }

                // パターン2: 引数で文言をカスタマイズ
                Button("カスタム設定") {
                    showCustom = true
                }
                .deleteConfirmation(
                    isPresented: $showCustom,
                    title: "データを完全に消去しますか？",
                    deleteButtonText: "今すぐ消す",
                    cancelButtonText: "戻る"
                ) {
                    print("カスタムの削除実行")
                }
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

