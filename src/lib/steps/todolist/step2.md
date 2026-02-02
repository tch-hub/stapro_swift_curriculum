# ステップ2: タスクコンポーネントを作る(ToDoListItem.swift)

## 1. 土台の作成

まず、`ToDoListItem.swift` の中身を以下のように書き換えて土台を作ります。

```swift
import SwiftUI

struct ToDoListItem: View {
    var body: some View {
        Text("Task Item")
    }
}
```

## 2. プロパティの定義

タスクを表示するために必要な情報（タイトル、完了状態）と、操作時のアクション（完了切り替え）を受け取れるように変数を定義します。

`struct ToDoListItem: View {` の直下に追加してください。

```swift
    // タスク名
    let title: String
    // 完了状態（trueなら完了、falseなら未完了）
    let isCompleted: Bool
    // タップされた時に実行する処理
    let onToggle: () -> Void
```

## 3. UIの実装: ボタンとレイアウト

`body` の中身を書き換えて、要素を横並びにする `HStack` と、全体をタップ可能にする `Button` を配置します。

```swift
    var body: some View {
        Button(action: {
            // アニメーション付きで状態を切り替え
            withAnimation(.spring(response: 0.3, dampingFraction: 0.5)) {
                onToggle()
            }
        }) {
            HStack(spacing: 12) {
                // ここにチェックボックスとテキストを追加します
                
                Spacer()
            }
            .padding(.vertical, 12)
            // 行全体のどこを押しても反応するようにする背景設定
            .contentShape(Rectangle())
        }
        // ボタンのデフォルトの見た目を無効化（リスト内での強調表示などを防ぐ）
        .buttonStyle(.plain) 
    }
```

- `HStack(spacing: 12)`: 要素を横一列に並べます。要素間のスペースを12に設定しています。
- `Spacer()`: 左寄せにするために、右側に残りのスペースを埋める要素です。

## 4. UIの実装: チェックボックス

`HStack` の中に、完了状態に応じて見た目が変わるチェックボックス（円）を追加します。以下のコードを `// ここにチェックボックスとテキストを追加します` の部分に記述してください。

```swift
                // チェックボックス部分
                ZStack {
                    // 未完了時の枠
                    Circle()
                        .stroke(
                            isCompleted ? Color.accentColor : Color.secondary,
                            lineWidth: 2
                        )
                        .frame(width: 24, height: 24)

                    // 完了時のチェックマーク
                    if isCompleted {
                        Image(systemName: "checkmark.circle.fill")
                            .resizable()
                            .frame(width: 24, height: 24)
                            .foregroundStyle(Color.accentColor)
                            // 現れる時のアニメーション
                            .transition(.scale.combined(with: .opacity))
                    }
                }
                .padding(.leading, 4)
```

- `ZStack`: 要素を重ねて表示します。ここでは円の枠の上にチェックマークを重ねています。
- `.stroke(...)`: 円の枠線を描画します。`isCompleted` が `true` の時はアクセントカラーになります。

## 5. UIの実装: テキスト

チェックボックスの右側にタスク名を表示させます。`ZStack` の閉じ括弧 `}` の後ろに追加してください。

```swift
                // タスク名のテキスト
                Text(title)
                    .font(.body)
                    // 完了時は色を薄くする
                    .foregroundStyle(isCompleted ? .secondary : .primary)
                    // 完了時は打ち消し線を入れる
                    .strikethrough(isCompleted, color: .secondary)
                    // テキストの変化を滑らかに
                    .contentTransition(.opacity)
```

- `.strikethrough(...)`: 文字に取り消し線を引きます。完了時のみ有効にします。
- `.foregroundStyle(...)`: 文字の色を指定します。完了時は薄い色（secondary）にします。

## 6. プレビューの作成

Xcodeのキャンバスで動作確認ができるように、プレビュー用のコードを追加します。ファイルの末尾に追加してください。

```swift
#Preview {
    // 状態変化を確認するためのラッパー
    struct PreviewWrapper: View {
        @State private var items = [
            (id: UUID(), title: "タップで状態切り替え", isCompleted: false),
            (id: UUID(), title: "完了したタスク", isCompleted: true),
            (id: UUID(), title: "長いタスク名の場合の表示確認テスト", isCompleted: false)
        ]

        var body: some View {
            List {
                ForEach(items.indices, id: \.self) { index in
                    ToDoListItem(
                        title: items[index].title,
                        isCompleted: items[index].isCompleted
                    ) {
                        items[index].isCompleted.toggle()
                    }
                }
            }
            .listStyle(.plain)
        }
    }

    return PreviewWrapper()
}
```

- `#Preview`: このブロック内に書いたコードがXcodeのプレビュー画面に表示されます。
- `PreviewWrapper`: `ToDoListItem` だけでは状態（完了/未完了）を保持できないため、プレビュー用に仮の状態管理を行うビューを作っています。

---

## コード全体

<img src="/images/todolist/ToDoListItem.png" alt="ToDoListItemの完成イメージ" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

### Components/ToDoListItem.swift

```swift
import SwiftUI

struct ToDoListItem: View {
    let title: String
    let isCompleted: Bool
    let onToggle: () -> Void

    var body: some View {
        Button(action: {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.5)) {
                onToggle()
            }
        }) {
            HStack(spacing: 12) {
                // MARK: - チェックボックス
                ZStack {
                    Circle()
                        .stroke(
                            isCompleted ? Color.accentColor : Color.secondary,
                            lineWidth: 2
                        )
                        .frame(width: 24, height: 24)

                    if isCompleted {
                        Image(systemName: "checkmark.circle.fill")
                            .resizable()
                            .frame(width: 24, height: 24)
                            .foregroundStyle(Color.accentColor)
                            .transition(.scale.combined(with: .opacity))
                    }
                }
                .padding(.leading, 4)

                // MARK: - テキスト
                Text(title)
                    .font(.body)
                    .foregroundStyle(isCompleted ? .secondary : .primary)
                    .strikethrough(isCompleted, color: .secondary)
                    .contentTransition(.opacity)

                Spacer()
            }
            .padding(.vertical, 12)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Preview
#Preview {
    struct PreviewWrapper: View {
        @State private var items = [
            (id: UUID(), title: "タップで状態切り替え", isCompleted: false),
            (id: UUID(), title: "開発チームに連絡する", isCompleted: true),
            (id: UUID(), title: "ジムに行く", isCompleted: false)
        ]

        var body: some View {
            List {
                ForEach(items.indices, id: \.self) { index in
                    ToDoListItem(
                        title: items[index].title,
                        isCompleted: items[index].isCompleted
                    ) {
                        items[index].isCompleted.toggle()
                    }
                }
            }
            .listStyle(.plain)
        }
    }

    return PreviewWrapper()
}
```
