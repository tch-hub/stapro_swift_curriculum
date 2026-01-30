## タスクコンポーネントを作る

ここでは、タスクを表示するための `ToDoListItem` を作成します。
タップで完了/未完了を切り替えられるようにします。

### 1. swiftUIの基本構造

```swift
import SwiftUI

struct ToDoListItem: View {
    var body: some View {
    }
}
```

### 2. 変数の定義

struct ToDoListItem: View {} 内に追加

```swift
// タスク名
let title: String
// 完了状態（trueなら完了、falseなら未完了）
let isCompleted: Bool
// タップされた時に実行する処理
let onToggle: () -> Void
```

ここでは、タスクのタイトルとなる `title`、完了しているかどうかを管理する `isCompleted`、そしてタップされた時の動作を決める `onToggle` を定義しています。

### 3. UIの作成

var body: some View {} 内に追加

```swift
// タップした時の動作を指定してボタンを作成
Button(action: onToggle) {
    // 部品を横並びにする（間隔を12空ける）
    HStack(spacing: 12) {
        // 完了状態に応じてアイコンを切り替え
        Image(systemName: isCompleted
              ? "checkmark.circle.fill" // 完了時：チェックマーク付きの丸
              : "circle")              // 未完了時：空の丸
            // 完了時はグレー、未完了時はアクセントカラー（青など）にする
            .foregroundColor(isCompleted ? .gray : .accentColor)

        // タスク名を表示
        Text(title)
            // 完了時に打ち消し線を引く
            .strikethrough(isCompleted)
            // 完了時は文字色をグレーにする
            .foregroundColor(isCompleted ? .gray : .primary)

        // 右側に余白を作り、要素を左寄せにする
        Spacer()
    }
    // 上下の余白を少し追加
    .padding(.vertical, 8)
}
// iOS標準のリストスタイルに馴染むボタンスタイルを適用
.buttonStyle(.plain)
```

全体を `Button` で囲むことで行全体をタップ可能にしています。  
`HStack` を使ってアイコンとテキストを横並びに配置し、`Spacer()` を最後に入れることで左寄せのレイアウトを作っています。  
また、アイコンやテキストは三項演算子（`条件 ? 真の場合 : 偽の場合`）を使って、完了状態 (`isCompleted`) に応じて見た目が変わるようにしています。

### Canvasプレビューの設定

struct ToDoListItem: View {}の下に追加

```swift
// Xcodeのプレビュー機能用コード
#Preview {
    // プレビュー用に一時的なビュー構造体を作る
    struct PreviewWrapper: View {
        // プレビュー内での状態変化を管理する変数
        @State private var completed = false

        var body: some View {
            // 本番と同じようにリスト形式で表示
            List {
                // 作成したコンポーネントを表示テスト
                ToDoListItem(
                    title: "タップで状態切り替え",
                    isCompleted: completed
                ) {
                    // タップされたら状態を反転させる
                    completed.toggle()
                }
            }
            // リストのスタイルを標準的なものに設定
            .listStyle(.plain)
        }
    }

    // 作成したプレビュー用ビューを返す
    return PreviewWrapper()
}
```

`#Preview` は、いま作っている画面を確認するための特別なブロックです。  
ここでは `PreviewWrapper` という仮の入れ物を作り、その中で `@State` を使って変数を管理することで、プレビュー画面上でもタップしてチェックマークが付くかどうかの動作確認ができるようにしています。  
`List` で囲っているのは、実際の画面と同じような見た目で確認するためです。  
`#Preview`を書かなくてもアプリは動きますが、こまめに確認することでミスに早く気づけるようになります。  
もしCanvasが表示されていない場合は、Xcode右上の「Canvas」ボタンを押して表示してください。

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
import SwiftUI

struct RefinedToDoListItem: View {
    let title: String
    let isCompleted: Bool
    let onToggle: () -> Void

    var body: some View {
        Button(action: {
            // アクション実行
            triggerHapticFeedback()
            // アニメーション付きでトグルを実行
            withAnimation(.spring(response: 0.3, dampingFraction: 0.5)) {
                onToggle()
            }
        }) {
            HStack(spacing: 12) {
                // MARK: - チェックボックス
                ZStack {
                    // 未完了時の枠
                    Circle()
                        .stroke(
                            isCompleted ? Color.accentColor : Color.secondary,
                            lineWidth: 2
                        )
                        .frame(width: 24, height: 24)

                    // 完了時の塗りつぶし（アニメーション用）
                    if isCompleted {
                        Image(systemName: "checkmark.circle.fill")
                            .resizable()
                            .frame(width: 24, height: 24)
                            .foregroundStyle(Color.accentColor)
                            // 完了時に少し拡大してから戻る「弾む」アニメーション
                            .transition(.scale.combined(with: .opacity))
                    }
                }
                .padding(.leading, 4) // 左端の余白調整

                // MARK: - テキスト
                Text(title)
                    .font(.body)
                    // 完了時は文字色を薄くする
                    .foregroundStyle(isCompleted ? .secondary : .primary)
                    // 打ち消し線のアニメーション
                    .strikethrough(isCompleted, color: .secondary)
                    // コンテンツの変更を滑らかに
                    .contentTransition(.opacity)

                Spacer()
            }
            .padding(.vertical, 12)
            // 行のどこをタップしても反応するようにする（重要）
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain) // リスト内でのデフォルトのハイライト効果を消す
    }

    // MARK: - 触覚フィードバックのヘルパー
    private func triggerHapticFeedback() {
        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.prepare() // 遅延を減らすための事前準備
        generator.impactOccurred()
    }
}

// MARK: - Preview
#Preview {
    struct PreviewWrapper: View {
        @State private var items = [
            (id: UUID(), title: "牛乳を買う", isCompleted: false),
            (id: UUID(), title: "開発チームに連絡する", isCompleted: true),
            (id: UUID(), title: "ジムに行く", isCompleted: false)
        ]

        var body: some View {
            List {
                ForEach(items.indices, id: \.self) { index in
                    RefinedToDoListItem(
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
