---
title: ステップ14: アプリにデータベースを準備しよう (ToDoListApp.swift)
summary: 「データを保存する場所（データベース）」を作って使えるようにする設定をしていきます。
---

## 1. SwiftDataの設定を追加する

`ToDoListApp.swift` というファイルを開いて、以下のようにコードを書き換えてみましょう。

```swift
import SwiftUI
import SwiftData // データベースを使うための新しい道具（フレームワーク）を読み込む

@main
struct ToDoListApp: App {
    let modelContainer: ModelContainer // データを保存する「大きな箱（データベース）」を入れるための変数を用意

    init() { // init() はアプリが立ち上がった時に、一番最初に1回だけ実行される「準備の処理」

        // ① このアプリで「何のデータを保存するのか」をリストアップして登録する
        let schema = Schema([
            ToDoTask.self, // 「タスク」のデータを保存する
            ToDoTab.self   // 「タブ」のデータを保存する
        ])

        // ② データベースの設定を決める
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false) // isStoredInMemoryOnlyを false にすることで、「アプリを閉じてもデータを消さずに残す」設定になる

        // ③ 登録したリストと設定を使って、実際の「箱」を作る
        do {  // スマホの容量不足などで箱が作れないこともあるので、do-catch を使って失敗した時の動きも書いておく

            modelContainer = try ModelContainer(for: schema, configurations: [modelConfiguration]) // try: 「失敗するかもしれないけど、とりあえず作ってみる！」という合図
        } catch {

            fatalError("データの箱（ModelContainer）が作れませんでした: \(error)") // もし箱の作成に失敗した場合は、アプリが動かせないのでエラーを出して強制終了させる（fatalError）
        }
    }

    var body: some Scene {
        WindowGroup {
            ContentView() // アプリの最初の画面（ContentView）を表示
        }

        // ④ 完成した「データの箱」をアプリのすべての画面で使えるように配給する魔法の言葉！
        .modelContainer(modelContainer)
    }
}
```

**新しく追加したコードの役割:**

| 追加した内容           | 役割                                                           |
| ---------------------- | -------------------------------------------------------------- |
| `modelContainer`       | データを保存する「箱」を入れる変数                             |
| `init()`               | アプリが立ち上がるときに、一番最初に動く「初期設定」の処理     |
| `Schema`               | 「この種類のデータを保存しますよ」と登録するリスト             |
| `ModelConfiguration`   | 「保存したデータをアプリを閉じても残すか？」などの設定         |
| `ModelContainer`       | 実際にデータを保存する「箱（データベース）」そのもの           |
| `.modelContainer(...)` | 作った「箱」を、アプリのどこからでも使えるようにする魔法の言葉 |

---

### 💡 コードの詳しい解説

- **`Schema`（スキーマ：保存するもののリスト）**
  ここでは、「アプリでどんなデータを保存するか」を登録します。今回は、前に作った `ToDoTask`（やるべきこと）と `ToDoTab`（タブ）の2つを「保存するデータだよ！」とリストに登録しています。

- **`ModelConfiguration`（データベースの設定）**
  データベースの動き方を決める設定です。ここで特に重要なのが `isStoredInMemoryOnly`（メモリの中だけに保存するか？）という設定です。
  - **`false`にする（普段はこちら）**: スマホの中にしっかり保存されるので、アプリを閉じてもデータが消えません！
  - **`true`にする（テスト用）**: アプリを閉じるとデータが全部消えてしまう設定です。

- **`ModelContainer`（データベースの本体）**
  実際にデータを保存する「大きな箱」です。これがデータベースそのものです！アプリを立ち上げる `init()` という処理の中で、この大きな箱を組み立てています。

- **`do-catch`（失敗したときの対策）**
  もしスマホの容量がいっぱいで、データを保存する箱が作れなかったらどうなるでしょう？
  そこで、`do` の中で「とりあえずやってみる（`try`）」と書き、もし失敗したときは `catch` に「失敗したときの動き」を書いておきます。今回はデータが保存できないとアプリが機能しないので、`fatalError`（強制終了）を使うようにしています。

- **`.modelContainer(modelContainer)`（みんなで使えるようにする）**
  せっかく「データの箱」を作っても、設定しないと他の画面から使うことができません。この1行を書くことで、アプリのどの画面からでもデータを引き出したり、保存したりできるようになります。

---

### 🔄 アプリが立ち上がるときの流れ

おさらいとして、アプリを開いたときにどんな順番で裏側が動いているか見てみましょう。

1. **アプリ起動！** ➡️ `init()`（準備の処理）がスタートする
2. `Schema` で「保存するデータ」の種類をリストアップ
3. `ModelContainer` でデータを入れる「箱」を作る
4. `.modelContainer()` で、作った「箱」をアプリ全体に配る
5. **完了！** これで、どの画面からでもデータが使えるようになります

---

## コード全体

```swift title="ToDoListApp.swift"
import SwiftUI
import SwiftData

@main
struct ToDoListApp: App {
    let modelContainer: ModelContainer

    init() {
        let schema = Schema([
            ToDoTask.self,
            ToDoTab.self
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
        do {
            modelContainer = try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("データの箱（ModelContainer）が作れませんでした: \(error)")
        }
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(modelContainer)
    }
}
```

---

画面の見た目はまだ変わりませんが、アプリの裏側でデータを保存するための準備をしました。
