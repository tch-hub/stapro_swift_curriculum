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

## 練習問題

![完成イメージ](/images/todolist/p4.png)

このステップで学んだ **`if / else` による条件分岐** と **`VStack` / `Image(systemName:)` / `.frame(maxWidth: .infinity, maxHeight: .infinity)`** を使って、ネットワーク接続状態に応じた表示を切り替えてみましょう。

Xcodeで新規アプリ制作（App）を作成し、`ContentView.swift` に以下の条件を満たすコードを実装してください。

1. **プロパティの定義**  
   `NetworkStatusView` という構造体に `let isConnected: Bool` プロパティを定義してください。

2. **接続中の表示**  
   `isConnected` が `true` の場合、`wifi` アイコンとテキスト「接続中」を `VStack` で縦に並べて表示してください。  
   アイコンは `.font(.system(size: 48))`、テキストは `.padding(.top, 8)` を適用してください。

3. **未接続の表示**  
   `isConnected` が `false` の場合、`wifi.slash` アイコンとテキスト「オフラインです」を表示してください。  
   アイコンの色は `.foregroundColor(.red)` にしてください。

4. **画面いっぱいに広げる**  
   両方の `VStack` に `.frame(maxWidth: .infinity, maxHeight: .infinity)` を適用して、中央に表示されるようにしてください。

5. **プレビューで確認**  
   `#Preview` で `isConnected: false` の状態を確認できるようにしてください。

### 解答例

```swift title="ContentView.swift"
import SwiftUI

struct ContentView: View {
    @State var isConnected: Bool = false

    var body: some View {
        VStack {
            if isConnected {
                VStack {
                    Image(systemName: "wifi")
                        .font(.system(size: 48))
                        .foregroundColor(.green)
                    Text("接続中")
                        .foregroundColor(.green)
                        .padding(.top, 8)
                }
            } else {
                VStack {
                    Image(systemName: "wifi.slash")
                        .font(.system(size: 48))
                        .foregroundColor(.red)
                    Text("オフラインです")
                        .foregroundColor(.gray)
                        .padding(.top, 8)
                }
            }
            
            Button("切り替えテスト") {
                isConnected.toggle()
            }
            .padding(.top, 32)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

#Preview {
    ContentView()
}
```
