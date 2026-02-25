# ステップ13: ホーム画面の枠を作る(HomeView.swift)

### ステップ13終了時の完成イメージ

<img src="/images/todolist/Homeview.png" alt="HomeViewの完成イメージ" class="mobile-screenshot-top" />


## 1. 画面の土台作成

`Views/HomeView.swift` を開き、ホーム画面の土台を作成します。
現時点ではまだタスクリストなどは表示せず、シンプルなテキストのみを配置して画面遷移のテストができるようにします（後のステップで機能を実装します）。

```swift
import SwiftUI

/// ホーム画面（枠だけ作成）
struct HomeView: View {
    var body: some View {
        VStack(spacing: 12) {
            // 仮のテキスト表示
            Text("ここにタスク一覧を表示します")
                .foregroundColor(.gray)
        }
        .padding()
        .navigationTitle("ToDoリスト")
    }
}

#Preview {
    NavigationStack {
        HomeView()
    }
}
```

- `NavigationStack`: 画面間の遷移や階層的なナビゲーションを管理するためにSwiftUIで用意されている仕組みです。`navigationTitle`などのナビゲーション関連の修飾子を適用するために必要です。

- `#Preview`: このブロック内に書いたコードがXcodeのプレビュー画面に表示されます。

  ※ このコードは、実際のアプリ本体には必須ではありませんが、プレビュー上で動作や状態変化を確認するためのテスト用ラッパーとして書かれています。  
  ※ 実行せずに確認できるようにしています。


---

## コード全体

```swift title="Views/HomeView.swift"
import SwiftUI

/// ホーム画面（枠だけ作成）
struct HomeView: View {
    var body: some View {
        VStack(spacing: 12) {
            Text("ここにタスク一覧を表示します")
                .foregroundColor(.gray)
        }
        .padding()
        .navigationTitle("ToDoリスト")
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        HomeView()
    }
}
```
