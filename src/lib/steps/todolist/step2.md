# ステップ2: ListItemの作成

<script>
    import {base} from '$app/paths';
</script>



```swift
import SwiftUI

struct ToDoListItem: View {
    let title: String
    let isCompleted: Bool
    let onToggle: () -> Void

    var body: some View {
        HStack {
            Button(action: onToggle) {
                Image(systemName: isCompleted ? "checkmark.square.fill" : "square")
                    .resizable()
                    .frame(width: 24, height: 24)
                    .foregroundColor(isCompleted ? .gray : .blue)
            }
            .buttonStyle(PlainButtonStyle())

            Text(title)
                .font(.body)
                .foregroundColor(isCompleted ? .gray : .primary)
                .strikethrough(isCompleted)
            
            Spacer()
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 16) // 【重要】手動で左右の余白をつける（復活）
        .frame(maxWidth: .infinity, alignment: .leading) // 【新規追加】横幅を画面いっぱいに確保する
        .background(Color(.systemBackground)) // 背景色
        .contentShape(Rectangle())
        .onTapGesture {
            onToggle()
        }
    }
}

// #Preview はそのままでOK

// #Preview はそのままでOK

// プレビューで見た目を確認
#Preview {
    // プレビュー用に一時的な「状態」を持つ親ビューを作る
    struct PreviewWrapper: View {
        @State private var isCompleted = false
        
        var body: some View {
            ListItem(
                title: "タップして状態切り替え",
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
