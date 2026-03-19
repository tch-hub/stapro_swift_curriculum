---
title: ステップ2: ファイル構成を整える
summary: フォルダ・ファイルの骨格を整え、常の画面を表示できる状態にする
---

プロジェクトが作成できたら、フォルダとファイルの骨格を整えましょう。  
自動生成されたファイルを削除して、自分のアプリ用の構成に作り直します。

---

## 1. ファイル構成を整える

自動生成されたファイルを削除して、自分で必要なファイルを作り直します。

> 💡 ヒント: タイマーアプリやToDoリストアプリでも同じ手順でファイルを作りました。  
> 検索バーで「ファイル構造」と検索して確認してみましょう。

### おすすめのフォルダ構成

**ツール・記録系アプリの場合**

```text
あなたのアプリ名/
├── 〇〇App.swift         # エントリーポイント
├── PLAN.md              # 企画書（ステップ1で作ったもの）
├── Views/               # 画面
│   ├── ContentView.swift
│   └── HomeView.swift
├── Models/              # データモデル（SwiftDataを使う場合）
│   └── 〇〇Model.swift
├── Services/            # データ操作ロジック
│   └── 〇〇Service.swift
└── Components/          # 再利用するUI部品
    └── （必要なもの）
```

**ゲーム系アプリの場合**

```text
あなたのアプリ名/
├── 〇〇App.swift         # エントリーポイント
├── PLAN.md              # 企画書（ステップ1で作ったもの）
└── Views/               # 画面
    ├── ContentView.swift
    └── GameView.swift   # ゲームのメイン画面
```

> ⚠️ すべてのフォルダが必要とは限りません。ゲームなら `Views/` だけでも十分です。

---

## 2. エントリーポイントの実装

`〇〇App.swift` に以下を記述します。

```swift
import SwiftUI

@main
struct 〇〇App: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

SwiftDataを使う場合: 検索バーで「ModelContainer」と検索して、ToDoリストアプリの実装を参考にしましょう。

---

## 3. ContentView.swift に仮の画面を作る

まず「表示できる」状態を作ることが大事です。

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("〇〇アプリ、開発中！")
    }
}
```

> 💡 Xcodeのプレビューでテキストが表示されれば成功です！

---

## 🔍 詰まったときの検索キーワード

| 困ったこと                 | 検索キーワード                       |
| -------------------------- | ------------------------------------ |
| ファイルの作り方           | 「ファイルを削除」「フォルダの作成」 |
| エントリーポイントの書き方 | 「@main」「WindowGroup」             |
| SwiftDataを使いたい        | 「ModelContainer」「@Model」         |
