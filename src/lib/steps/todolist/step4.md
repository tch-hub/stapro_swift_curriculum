# ステップ4: 削除確認アラートを共通化する

削除前に確認を出せるように、`deleteAlert` という拡張メソッドを作ります。

### 1. 拡張メソッドの作成

```swift
import SwiftUI

// Viewを拡張して、どこからでも呼び出せるメソッドを追加
extension View {
    // 削除確認アラートを表示するメソッド
    // デフォルト引数を使って、呼び出し時は必要な項目だけ指定すれば良いようにする
    func deleteAlert(
        isPresented: Binding<Bool>, // アラートの表示状態を紐付ける
        title: String = "削除確認", // タイトルの初期値
        message: String = "このタスクを完全に削除しますか？", // メッセージの初期値
        deleteText: String = "削除", // 削除ボタンの文言
        cancelText: String = "キャンセル", // キャンセルボタンの文言
        onDelete: @escaping () -> Void // 削除実行時の処理（クロージャ）
    ) -> some View {
        // 標準のalertモディファイアを使用
        self.alert(title, isPresented: isPresented) {
            // 削除ボタン（赤字になる.destructiveスタイル）
            Button(deleteText, role: .destructive) {
                onDelete()
            }
            // キャンセルボタン（.cancelスタイル）
            Button(cancelText, role: .cancel) {}
        } message: {
            // アラートのメッセージ部分
            Text(message)
        }
    }
}
```

SwiftUIの `View` プロトコルを拡張（`extension`）することで、アプリ内のどのビューからでも `.deleteAlert(...)` として呼び出せるようにしています。  
引数にはデフォルト値（`= "削除確認"` など）を設定しているため、利用する際は必要なパラメータだけを指定すれば動作します。  
`isPresented` でアラートの表示・非表示を管理し、削除ボタンが押された時には `onDelete` クロージャが実行される仕組みです。

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
