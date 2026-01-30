# ステップ2: ListItemの作成

<script>
    import {base} from '$app/paths';
</script>

```swift
struct ToDoListItem: View {
    let title: String
    let isCompleted: Bool
    let onToggle: () -> Void

    var body: some View {
        Button(action: onToggle) {
            HStack(spacing: 12) {
                Image(systemName: isCompleted
                      ? "checkmark.circle.fill"
                      : "circle")
                    .foregroundColor(isCompleted ? .gray : .accentColor)

                Text(title)
                    .strikethrough(isCompleted)
                    .foregroundColor(isCompleted ? .gray : .primary)

                Spacer()
            }
            .padding(.vertical, 8)
        }
        .buttonStyle(.plain)
    }
}


#Preview {
    struct PreviewWrapper: View {
        @State private var completed = false

        var body: some View {
            List {
                ToDoListItem(
                    title: "タップで状態切り替え",
                    isCompleted: completed
                ) {
                    completed.toggle()
                }
            }
            .listStyle(.plain)
        }
    }

    return PreviewWrapper()
}

```
