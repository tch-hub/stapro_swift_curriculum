# ステップ16: CustomAlert コンポーネントの実装

<script>
    import {base} from '$app/paths';
</script>

## CustomAlert.swift の作成

`Components/`フォルダに`CustomAlert.swift`を作成します：

```swift
import SwiftUI

struct CustomAlert: View {
    let title: String
    let message: String
    let primaryButtonText: String
    let secondaryButtonText: String?
    let primaryAction: () -> Void
    let secondaryAction: (() -> Void)?

    var body: some View {
        VStack(spacing: 16) {
            Text(title)
                .font(.headline)
                .fontWeight(.bold)

            Text(message)
                .font(.body)
                .foregroundColor(.gray)

            HStack(spacing: 12) {
                if let secondaryButtonText = secondaryButtonText, let secondaryAction = secondaryAction {
                    Button(action: secondaryAction) {
                        Text(secondaryButtonText)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .border(Color.blue)
                    }
                    .foregroundColor(.blue)
                }

                Button(action: primaryAction) {
                    Text(primaryButtonText)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                }
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(12)
        .shadow(radius: 10)
    }
}

#Preview {
    CustomAlert(
        title: "確認",
        message: "このタスクを削除しますか？",
        primaryButtonText: "削除",
        secondaryButtonText: "キャンセル",
        primaryAction: { },
        secondaryAction: { }
    )
}
```

## CustomAlert の使用例

```swift
@State private var showConfirmAlert = false

// ビュー内
if showConfirmAlert {
    CustomAlert(
        title: "削除確認",
        message: "このタスクを削除してもよろしいですか？",
        primaryButtonText: "削除",
        secondaryButtonText: "キャンセル",
        primaryAction: {
            // 削除処理
            showConfirmAlert = false
        },
        secondaryAction: {
            showConfirmAlert = false
        }
    )
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

## 次のステップへ

次は、FloatingButton（フローティングアクションボタン）を実装します。
