---
title: ステップ3: メイン画面の骨格を作る
summary: ダミーデータを使って画面のレイアウト・画面遷移の構造を確認する
---

画面の「枠」だけを先に作って、アプリ全体の構造を確認します。  
この段階では見た目はシンプルでOK。「どんな画面があるか」を形にすることが目標です。

---

## 1. 画面の種類と対応するコンポーネントを確認する

よく使う画面パターンと、それに対応するSwiftUIの書き方を確認しましょう。

| 画面パターン             | 使うコンポーネント   | 検索キーワード                        |
| ------------------------ | -------------------- | ------------------------------------- |
| リスト表示               | `List` / `ForEach`   | 「List」「ForEach」                   |
| タブ切り替え             | `TabView`            | 「TabView」                           |
| 画面遷移（戻る/進む）    | `NavigationStack`    | 「NavigationStack」「NavigationLink」 |
| シート（下から出てくる） | `.sheet()`           | 「sheet」                             |
| フォーム入力             | `Form` / `TextField` | 「TextField」「Form」                 |

> 💡 ヒント: ToDoリストアプリでは `NavigationStack` と `navigationDestination` で画面遷移を実装しました。  
> 検索バーで「NavigationStack」と検索して確認しましょう。

---

## 2. メイン画面の骨格を実装する

まずダミーデータを使って画面を作ります。データの保存は後のステップで実装します。

### リスト表示の例

```swift
struct HomeView: View {
    // ダミーデータ（後でデータベースに切り替える）
    let items = ["アイテム1", "アイテム2", "アイテム3"]

    var body: some View {
        List(items, id: \.self) { item in
            Text(item)
        }
        .navigationTitle("ホーム")
    }
}
```

---

## 3. 画面遷移の骨格を作る

複数の画面がある場合は、まず遷移の骨格だけ作りましょう。

```swift
// ContentView.swift（ルートのビュー）
struct ContentView: View {
    var body: some View {
        NavigationStack {
            HomeView()
        }
    }
}
```

> 💡 タブで画面を切り替えたい場合は `TabView` を使います。  
> 検索バーで「TabView」と検索してみましょう。

---

## 4. 新しい画面を追加するとき

```swift
// 遷移先の画面
struct DetailView: View {
    var body: some View {
        Text("詳細画面")
            .navigationTitle("詳細")
    }
}

// 遷移元（HomeViewなど）に追加
NavigationLink("詳細へ") {
    DetailView()
}
```

---

## 🔍 詰まったときの検索キーワード

| 困ったこと             | 検索キーワード                        |
| ---------------------- | ------------------------------------- |
| リストを表示したい     | 「List」「ForEach」                   |
| 画面を切り替えたい     | 「NavigationStack」「NavigationLink」 |
| タブで切り替えたい     | 「TabView」                           |
| 下から画面を出したい   | 「sheet」                             |
| ボタンを押して別画面へ | 「navigationPath」「append」          |

---

## 💬 先生への確認ポイント

この段階で先生に見せて確認してもらいましょう：

- 画面の数と遷移の流れは適切か？
- 作ろうとしている機能は11回で実現できそうか？
