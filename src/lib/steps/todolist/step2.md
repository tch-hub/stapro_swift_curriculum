# ステップ2: ListItemの作成

<script>
    import {base} from '$app/paths';
</script>



```swift
import SwiftUI

struct ListItem: View {
    let title: String       // タスクのタイトル
    let isCompleted: Bool   // 完了しているかどうか
    let onToggle: () -> Void // チェックボックスが押された時の処理

    var body: some View {
        HStack {
            // チェックボックスボタン
            Button(action: onToggle) {
                Image(systemName: isCompleted ? "checkmark.square.fill" : "cicle")
                    .resizable()
                    .frame(width: 24, height: 24)
                    .foregroundColor(isCompleted ? .gray : .blue) // 完了ならグレー、未完了なら青
            }
            .buttonStyle(PlainButtonStyle()) // リスト内でのボタン反応範囲を制御

            // タスク名
            Text(title)
                .font(.body)
                .foregroundColor(isCompleted ? .gray : .primary) // 完了なら文字もグレー
                .strikethrough(isCompleted) // 完了なら取り消し線
            
            Spacer()
        }
        .padding(.vertical, 8) // 上下の余白
        .contentShape(Rectangle()) // タップ領域を行全体に広げる
        .onTapGesture {
            onToggle() // 行のどこを押してもチェックが切り替わるようにする
        }
    }
}

// プレビューで見た目を確認
#Preview {
    // プレビュー用に一時的な「状態」を持つ親ビューを作る
    struct PreviewWrapper: View {
        @State private var isCompleted = false
        
        var body: some View {
            ListItem(
                title: "タップして動作確認",
                isCompleted: isCompleted,
                onToggle: {
                    // タップされたら状態を反転させる
                    isCompleted.toggle()
                }
            )
        }
    }
    
    return PreviewWrapper()
        .padding()
}
```
