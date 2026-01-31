# ステップ4: 空の状態を表示するコンポーネントを作る

タスクがない時や、タブが選択されていない時に表示する「空の状態（Empty State）」の画面を作成します。リストが空っぽの時に真っ白な画面を表示する代わりに、ユーザーに状況を伝えるアイコンやテキストを表示します。

### 1. EmptyStateView.swift の作成

`Components` フォルダ内に `EmptyStateView` というファイルを作成し、以下のコードを記述します。

```swift
import SwiftUI

struct EmptyStateView: View {
    // 選択中のタブがあるかどうかを確認するフラグ
    // trueなら「タスクなし」、falseなら「タブ未選択」を表示
    let hasSelectedTab: Bool

    var body: some View {
        if hasSelectedTab {
            // タブは選ばれているが、タスクがない場合
            VStack {
                Image(systemName: "checkmark.circle") // チェックマークアイコン
                    .font(.system(size: 48))
                    .foregroundColor(.gray)
                Text("タスクはまだありません")
                    .foregroundColor(.gray)
                    .padding(.top, 8)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity) // 画面いっぱいに広げる
        } else {
            // タブ自体が選ばれていない場合
            VStack {
                Image(systemName: "list.bullet") // リストアイコン
                    .font(.system(size: 48))
                    .foregroundColor(.gray)
                Text("タブを選択してください")
                    .foregroundColor(.gray)
                    .padding(.top, 8)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
}

#Preview {
    // プレビューで見た目を確認
    EmptyStateView(hasSelectedTab: true)
}
```

`hasSelectedTab` という変数を受け取り、その値によって表示内容を切り替えます。
`ViewBuilder` などを使わず、シンプルな条件分岐で実装しています。アイコンとテキストを `VStack` で縦に並べ、`.frame(maxWidth: .infinity, maxHeight: .infinity)` をつけることで、親ビューの空きスペース全体に中央揃えで表示されるようにしています。

---

## コード全体

<img src="/images/todolist/EmptyStateView.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
import SwiftUI

struct EmptyStateView: View {
    let hasSelectedTab: Bool

    var body: some View {
        if hasSelectedTab {
            VStack {
                Image(systemName: "checkmark.circle")
                    .font(.system(size: 48))
                    .foregroundColor(.gray)
                Text("タスクはまだありません")
                    .foregroundColor(.gray)
                    .padding(.top, 8)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        } else {
            VStack {
                Image(systemName: "list.bullet")
                    .font(.system(size: 48))
                    .foregroundColor(.gray)
                Text("タブを選択してください")
                    .foregroundColor(.gray)
                    .padding(.top, 8)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
}
```
