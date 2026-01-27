# ステップ19: CustomList コンポーネントの実装

<script>
    import {base} from '$app/paths';
</script>

## CustomList.swift の作成

`Components/`フォルダに`CustomList.swift`を作成します。このコンポーネントは、スタイルをカスタマイズしたリストを提供します：

```swift
import SwiftUI

struct CustomList<Content: View>: View {
    @ViewBuilder let content: Content

    var body: some View {
        List {
            content
        }
        .listStyle(.plain)
        .scrollContentBackground(.hidden)
    }
}

#Preview {
    CustomList {
        ForEach(0..<5, id: \.self) { index in
            Text("アイテム \(index)")
        }
    }
}
```

## CustomListの特徴

- `@ViewBuilder`: 複数の子ビューを受け入れるための仕組みです
- `.listStyle(.plain)`: デフォルトのListスタイルを削除
- `.scrollContentBackground(.hidden)`: スクロール背景を非表示

## HomeView の修正

`List`を`CustomList`に置き換えます：

```swift
CustomList {
    ForEach(filteredTasks) { task in
        ToDoListItem(task: task, onToggleCompletion: toggleTaskCompletion)
    }
    .onDelete(perform: deleteTask)
}
```

## 利点

1. **統一されたスタイル**: アプリ全体で同じリストスタイルを使用
2. **カスタマイズが容易**: 見た目の変更が必要な場合、1箇所だけ修正すればよい
3. **再利用性**: 複数の画面でリストを使う際に便利

## 次のステップへ

次は、アプリの初期データ設定と最終調整を行います。
