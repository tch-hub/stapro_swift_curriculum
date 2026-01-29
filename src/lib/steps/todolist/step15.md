# ステップ15: コンポーネント化（ListItem）

<script>
    import {base} from '$app/paths';
</script>

## コンポーネント化とは

コードの重複を減らすために、よく使う部品を独立した「コンポーネント」として分割することです。

## ListItem.swift の作成

`Components/`フォルダに`ListItem.swift`を作成します：

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
                Image(systemName: isCompleted ? "checkmark.square.fill" : "square")
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
    VStack {
        // 未完了パターン
        ListItem(title: "牛乳を買う", isCompleted: false, onToggle: {})
        
        // 完了パターン
        ListItem(title: "部屋の掃除", isCompleted: true, onToggle: {})
    }
    .padding()
}
```

## HomeView での使用

`HomeView`のリスト部分を以下のように修正します：

```swift
List {
    ForEach(filteredTasks) { task in
        ListItem(task: task, onToggleCompletion: toggleTaskCompletion)
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
