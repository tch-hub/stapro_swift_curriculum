# ステップ4: 削除確認アラートを共通化する

削除前に確認を出せるように、`deleteAlert` という拡張メソッドを作ります。

### 1. 拡張メソッドの作成

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
```

- どの画面でも使えるように `View` を拡張します。
- `deleteText` は削除ボタンの文字を変更できます。
- `onDelete` に削除の実処理を渡します。

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

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
        @State private var showAlert = false

        var body: some View {
            VStack(spacing: 40) {
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
