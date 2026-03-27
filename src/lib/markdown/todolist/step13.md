---
title: ステップ13: ホーム画面の枠を作る(HomeView.swift)
summary: ホーム画面の土台を作成します。
---

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

## 練習問題

![完成イメージ](/images/todolist/p13.png)

このステップで学んだ **`NavigationStack` / `.navigationTitle` / `VStack`** を使って、プロフィール画面の枠を作ってみましょう。

Xcodeで新規アプリ制作（App）を作成し、`ProfileView.swift` を作成して以下の条件を満たすコードを実装してください。

1. **`ProfileView` の作成**  
   `var body: some View` の中に `VStack` を配置し、以下のテキストを表示してください。  
   - `Text("ここにプロフィールを表示します")` を `.foregroundColor(.gray)` で表示

2. **ナビゲーションタイトル**  
   `.navigationTitle("プロフィール")` を適用してください。

3. **プレビュー**  
   `#Preview` の中で `NavigationStack` でラップした `ProfileView` を表示してください。

### 解答例

```swift title="ContentView.swift"
import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationStack {
            VStack(spacing: 12) {
                Text("ここにプロフィールを表示します")
                    .foregroundColor(.gray)
            }
            .padding()
            .navigationTitle("プロフィール")
        }
    }
}

#Preview {
    ContentView()
}
```
