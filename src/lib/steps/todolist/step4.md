---
title: ステップ4: 空の状態を表示するコンポーネントを作る(EmptyStateView.swift)
summary: タスクなし/未選択時の表示を追加します。
---

### ステップ4終了時の完成イメージ

<img src="/images/todolist/EmptyStateView.png" alt="EmptyStateViewの完成イメージ" class="mobile-screenshot-top" />

## 1. 基本的な構造を書く

`Components/EmptyStateView.swift` を開き、以下の基本的な構造を記述します。
外部から「タブが選択されているかどうか」の情報 (`hasSelectedTab`) を受け取るようにします。

```swift
import SwiftUI

struct EmptyStateView: View {
    let hasSelectedTab: Bool

    var body: some View {
        // ここにこれから内容を書いていきます
        Text("Empty State")
    }
}
```

## 2. 条件分岐と画面作成

`body` の中身を書き換えて、タブの選択状態に応じた表示（アイコンとメッセージ）を作ります。

<img src="/images/todolist/4-2.png" alt="HomeViewの完成イメージ" class="mobile-screenshot" />

```swift
var body: some View {
    if hasSelectedTab {
        // タブは選ばれているが、タスクがない場合
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
        // タブ自体が選ばれていない場合
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
```

- `hasSelectedTab` が `true`: 「タスクはまだありません」を表示
- `hasSelectedTab` が `false`: 「タブを選択してください」を表示
- `.frame(maxWidth: .infinity, maxHeight: .infinity)`: 画面いっぱいに広げて、コンテンツを中央に配置します。
- `systemName`はApple が用意している、完了を表すチェック付きの丸アイコンとリストアイコンです。

## 3. プレビュー機能を追加する

最後に、ファイルの末尾にプレビュー用のコードを追加して動作を確認します。

```swift
#Preview {
    EmptyStateView(hasSelectedTab: true)
}
```

- `#Preview`: このブロック内に書いたコードがXcodeのプレビュー画面に表示されます。

  ※ このコードは、実際のアプリ本体には必須ではありませんが、プレビュー上で動作や状態変化を確認するためのテスト用ラッパーとして書かれています。  
  ※ 実行せずに確認できるようにしています。

---

## コード全体

```swift title="Components/EmptyStateView.swift"
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

#Preview {
    EmptyStateView(hasSelectedTab: true)
}
```
