---
title: ステップ7: データの更新・削除（Update / Delete）
summary: スワイプ削除・状態切り替え・確認アラートを実装する
---

追加したデータを「変更する」「消す」機能を実装します。  
これで基本的なCRUD（Create・Read・Update・Delete）が揃います！

---

## 1. スワイプ削除

リストでスワイプして削除する最もシンプルな方法です。

```swift
List(items) { item in
    Text(item.title)
}
.onDelete { offsets in
    for index in offsets {
        let item = items[index]
        〇〇Service.delete(item, from: modelContext)
    }
    loadItems()
}
```

> 💡 ヒント: ToDoリストアプリの `handleDeleteTask` と同じパターンです。  
> 検索バーで「onDelete」「handleDeleteTask」と検索して確認しましょう。

---

## 2. 削除確認アラート（推奨）

大事なデータを誤って消さないように、確認ダイアログを出しましょう。

```swift
@State private var showDeleteAlert = false
@State private var itemToDelete: 〇〇Model?

// 削除ボタンが押されたとき
private func requestDelete(_ item: 〇〇Model) {
    itemToDelete = item
    showDeleteAlert = true
}

// アラートを追加
.alert("削除の確認", isPresented: $showDeleteAlert) {
    Button("キャンセル", role: .cancel) { }
    Button("削除", role: .destructive) {
        if let item = itemToDelete {
            〇〇Service.delete(item, from: modelContext)
            loadItems()
        }
    }
} message: {
    Text("このデータを削除してもよろしいですか？")
}
```

> 💡 検索バーで「alert」「showDeleteAlert」と検索すると実装例が見つかります。

---

## 3. データの更新（プロパティを変更する）

```swift
// 例: 完了状態を切り替える
private func toggleCompletion(_ item: 〇〇Model) {
    item.isCompleted.toggle()
    〇〇Service.update(modelContext: modelContext)
    loadItems()
}
```

> 💡 ヒント: ToDoリストアプリの `toggleTaskCompletion` と同じパターンです。  
> 検索バーで「toggleTaskCompletion」「toggle()」と検索して確認しましょう。

---

## 4. 編集画面で更新する

既存データの値を書き換えて保存する場合：

```swift
struct EditView: View {
    @Bindable var item: 〇〇Model   // @Bindableで直接変更できる
    var onSave: () -> Void

    var body: some View {
        Form {
            TextField("タイトル", text: $item.title)
        }
        .toolbar {
            Button("保存") {
                onSave()
            }
        }
    }
}
```

> 💡 `@Bindable` はSwiftDataのモデルを直接編集するための書き方です。

---

## 🔍 詰まったときの検索キーワード

| 困ったこと                   | 検索キーワード                       |
| ---------------------------- | ------------------------------------ |
| スワイプで削除したい         | 「onDelete」「IndexSet」             |
| 削除確認ダイアログを出したい | 「alert」「role: .destructive」      |
| タップで状態を切り替えたい   | 「toggle()」「toggleTaskCompletion」 |
| データを更新・保存したい     | 「modelContext.save」「updateTask」  |
| 編集画面で直接変更したい     | 「@Bindable」                        |

---

## 💬 先生への確認ポイント

- 削除・更新の操作は直感的に使えるか？
- 大事なデータを誤削除するリスクはないか？
