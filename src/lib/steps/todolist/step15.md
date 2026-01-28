# ステップ15: コンポーネント化（ToDoListItem）

<script>
    import {base} from '$app/paths';
</script>

## コンポーネント化とは

コードの重複を減らすために、よく使う部品を独立した「コンポーネント」として分割することです。

## ToDoListItem.swift の作成

`Components/`フォルダに`ToDoListItem.swift`を作成します：

```swift
import SwiftUI

struct ToDoListItem: View {
    let task: ToDoTask
    let onToggleCompletion: (ToDoTask) -> Void

    var body: some View {
        HStack {
            Button(action: {
                onToggleCompletion(task)
            }) {
                Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                    .foregroundColor(task.isCompleted ? .green : .gray)
            }
            .buttonStyle(PlainButtonStyle())

            Text(task.title)
                .strikethrough(task.isCompleted)
                .foregroundColor(task.isCompleted ? .gray : .black)

            Spacer()
        }
    }
}

#Preview {
    ToDoListItem(
        task: ToDoTask(title: "サンプルタスク", detail: "", tabId: UUID()),
        onToggleCompletion: { _ in }
    )
}
```

## HomeView での使用

`HomeView`のリスト部分を以下のように修正します：

```swift
List {
    ForEach(filteredTasks) { task in
        ToDoListItem(task: task, onToggleCompletion: toggleTaskCompletion)
    }
    .onDelete(perform: deleteTask)
}
```

## コンポーネント化の利点

1. **再利用性**: 同じコンポーネントを複数の場所で使えます
2. **可読性**: コードが短くて読みやすくなります
3. **保守性**: 修正が必要な場合、1箇所だけ修正すればよいです

## 次のステップへ

次は、カスタムアラートなどの追加コンポーネントを実装します。
