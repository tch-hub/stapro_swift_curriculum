# ステップ6: データの追加（Create）

新しいデータを入力してデータベースに保存する機能を実装します。  
ユーザーが情報を入力してアプリに追加できる「入口」を作りましょう。

---

## 1. 入力方法を選ぶ

| 入力方法 | 向いているケース |
|---------|---------------|
| 画面下部の入力バー | 短いテキスト1つだけの追加（チャット・ToDo風） |
| シート（下から出てくる） | 複数の項目を入力するフォーム |
| 専用の入力画面 | 項目が多い・詳細な入力が必要 |

> 💡 ToDoリストアプリでは「画面下部の入力バー」(`InputView`) を使いました。  
> 検索バーで「InputView」または「safeAreaInset」と検索して確認しましょう。

---

## 2a. 入力バー方式（短い入力）

```swift
// State変数を追加
@State private var newTitle = ""

// bodyに追加
.safeAreaInset(edge: .bottom) {
    HStack {
        TextField("追加する内容", text: $newTitle)
            .textFieldStyle(.roundedBorder)
        Button("追加") {
            addItem()
        }
        .disabled(newTitle.isEmpty)
    }
    .padding()
}

// メソッド
private func addItem() {
    guard !newTitle.isEmpty else { return }
    let newItem = 〇〇Model(title: newTitle)
    〇〇Service.add(newItem, to: modelContext)
    newTitle = ""
    loadItems()
}
```

---

## 2b. シート方式（複数項目の入力）

```swift
// State変数を追加
@State private var showAddSheet = false

// bodyに追加
.toolbar {
    Button {
        showAddSheet = true
    } label: {
        Image(systemName: "plus")
    }
}
.sheet(isPresented: $showAddSheet) {
    AddItemView { title in
        let newItem = 〇〇Model(title: title)
        〇〇Service.add(newItem, to: modelContext)
        loadItems()
    }
}
```

> 💡 検索バーで「sheet」と検索すると使い方が見つかります。

---

## 3. バリデーション（入力チェック）

```swift
// 入力が有効かどうかを確認する
private var isValid: Bool {
    !newTitle.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
}

// ボタンを無効化
Button("追加") {
    addItem()
}
.disabled(!isValid)
```

> 💡 ヒント: `InputView` の中で `isValid` という変数を使っていました。  
> 検索バーで「isValid」「trimmingCharacters」と検索してみましょう。

---

## 🔍 詰まったときの検索キーワード

| 困ったこと | 検索キーワード |
|-----------|--------------|
| 入力バーを画面下部に固定したい | 「safeAreaInset」 |
| 下からシートを出したい | 「sheet」「isPresented」 |
| テキスト入力欄を作りたい | 「TextField」「Binding」 |
| 保存ボタンを実装したい | 「modelContext.insert」「save」 |
| 空入力を弾きたい | 「isValid」「trimmingCharacters」「disabled」 |
| ツールバーにボタンを追加したい | 「toolbar」「ToolbarItem」 |
