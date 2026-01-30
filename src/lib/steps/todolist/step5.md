# ステップ5: タスク入力バーを作る

画面下部に、新しいタスクを追加するための入力フィールドとボタンをまとめたコンポーネントを作成します。

### 1. TaskInputView.swift の作成

`Components` フォルダ内に `TaskInputView` というファイルを作成し、以下のコードを記述します。

```swift
import SwiftUI

struct TaskInputView: View {
    // 入力中のテキスト（親ビューと共有するのでBinding）
    @Binding var text: String
    // 追加ボタンが押された時のアクション
    let onAdd: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            // テキスト入力フィールド
            TextField("新しいタスク", text: $text)
                .textFieldStyle(.roundedBorder)
                .submitLabel(.done) // キーボードの改行ボタンを「完了」にする
                .onSubmit {
                    // キーボードで完了を押した時も追加を実行
                    if !text.isEmpty {
                        onAdd()
                    }
                }

            // 追加ボタン
            Button("追加") {
                onAdd()
            }
            .buttonStyle(.borderedProminent)
            // 空白のみや空文字の場合はボタンを押せないようにする
            .disabled(text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(.ultraThinMaterial) // すりガラスのような背景
    }
}

#Preview {
    // プレビュー用のダミー変数
    struct PreviewWrapper: View {
        @State var text = ""
        var body: some View {
            ZStack {
                Color.gray.ignoresSafeArea()
                VStack {
                    Spacer()
                    TaskInputView(text: $text) {
                        print("追加ボタンが押されました")
                        text = "" // 追加後にクリアする動作のシミュレーション
                    }
                }
            }
        }
    }
    return PreviewWrapper()
}
```

`@Binding` を使って、入力されたテキストの状態管理を親ビュー（呼び出し元）に任せています。これにより、HomeView などの親側で「追加ボタンが押されたらデータベースに保存してテキストをクリアする」といった制御が可能になります。
`.background(.ultraThinMaterial)` を使うことで、背景が少し透けて見えるモダンなデザインに仕上げています。

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
import SwiftUI

struct TaskInputView: View {
    @Binding var text: String
    let onAdd: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            TextField("新しいタスク", text: $text)
                .textFieldStyle(.roundedBorder)
                .submitLabel(.done)
                .onSubmit {
                    if !text.isEmpty {
                        onAdd()
                    }
                }

            Button("追加") {
                onAdd()
            }
            .buttonStyle(.borderedProminent)
            .disabled(text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(.ultraThinMaterial)
    }
}
```
