# ステップ5: タスク入力バーを作る

画面下部に、新しいタスクを追加するための入力フィールドとボタンをまとめたコンポーネントを作成します。

このコンポーネントは汎用的に設計されており、タスク追加だけでなくタブ追加など、様々な入力シーンで使用できます。

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
import SwiftUI

struct InputView: View {
    @Binding var text: String
    let onAdd: () -> Void
    
    // カスタマイズ可能なプロパティ
    let placeholder: String
    let buttonIcon: String
    
    // デフォルト値を持つイニシャライザ
    init(
        text: Binding<String>,
        placeholder: String = "新しいタスクを追加...",
        buttonIcon: String = "arrow.up.circle.fill",
        onAdd: @escaping () -> Void
    ) {
        self._text = text
        self.placeholder = placeholder
        self.buttonIcon = buttonIcon
        self.onAdd = onAdd
    }

    // キーボードのフォーカス制御
    @FocusState private var isFocused: Bool

    // 入力値が空でないかどうかの判定（トリミング済み）
    private var isValid: Bool {
        !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    var body: some View {
        HStack(alignment: .bottom, spacing: 12) {
            // MARK: - テキスト入力エリア
            TextField(placeholder, text: $text, axis: .vertical) // axis: .verticalで複数行対応
                .focused($isFocused)
                .padding(.vertical, 10)
                .padding(.horizontal, 16)
                .background(
                    Capsule() // 丸みを帯びた背景
                        .fill(Color(.secondarySystemBackground))
                )
                // キーボードの改行で追加する場合
                .onSubmit {
                    handleSubmit()
                }
                // 送信ボタンのラベル（青い「完了」など）
                .submitLabel(.send)

            // MARK: - 送信ボタン（アイコン化）
            Button(action: handleSubmit) {
                Image(systemName: buttonIcon)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 32, height: 32)
                    // 入力状態に応じて色と透明度を変更
                    .foregroundStyle(isValid ? Color.accentColor : Color(.systemGray4))
                    // 少しアニメーションさせる
                    .scaleEffect(isValid ? 1.0 : 0.9)
                    .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isValid)
            }
            .disabled(!isValid)
            .padding(.bottom, 4) // テキストフィールドとの高さ合わせ
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        // 背景素材（Material）
        .background(.ultraThinMaterial)
        // 上部に境界線を追加（コンテンツとの分離）
        .overlay(alignment: .top) {
            Divider()
        }
    }

    // 追加処理のロジック
    private func handleSubmit() {
        guard isValid else { return }
        
        onAdd()
        
        // 追加後も入力を続けたい場合はコメントアウトを外す
        // isFocused = true 
    }
}

// MARK: - Preview
#Preview {
    struct PreviewWrapper: View {
        @State var text = ""
        // リスト表示のダミーデータ
        @State var tasks: [String] = ["牛乳を買う", "メールを返す"]

        var body: some View {
            ZStack(alignment: .bottom) {
                // 背景のリスト部分
                List {
                    ForEach(tasks, id: \.self) { task in
                        Text(task)
                    }
                }
                .contentMargins(.bottom, 80, for: .scrollContent) // 入力欄の下に隠れないように余白確保

                // 入力コンポーネント
                InputView(text: $text) {
                    print("追加: \(text)")
                    withAnimation {
                        tasks.append(text)
                        text = ""
                    }
                }
            }
        }
    }
    return PreviewWrapper()
}
```
