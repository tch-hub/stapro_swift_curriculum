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
        // 【追加】左右に標準的な余白を入れる（これで見切れを防ぐ）
        .padding(.horizontal, 16)
        // 【追加】背景色を白（ダークモード対応）にして、裏透けを防ぐ
        .background(Color(.systemBackground))
        .contentShape(Rectangle())
        .onTapGesture {
            onToggle()
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
