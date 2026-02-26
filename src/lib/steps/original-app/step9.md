---
title: ステップ9: デバッグ・バグ修正
summary: 全機能の動作確認・よくあるバグの原因と対処法
---

機能が揃ったら、きちんと動くかを丁寧に確認します。  
バグを見つけて直すスキルは、プログラマーとして最も重要なスキルの一つです。

---

## 1. 基本動作の確認リスト

以下を実際に操作して確認しましょう。

| 操作                     | 確認すること                                 |
| ------------------------ | -------------------------------------------- |
| データを追加する         | リストに正しく表示されるか                   |
| アプリを再起動する       | データが消えていないか                       |
| データを削除する         | リストから消えるか                           |
| データを更新する         | 変更が画面に反映されるか                     |
| 空のまま保存しようとする | ボタンが無効になっているか・エラーが出ないか |
| 素早く連打する           | クラッシュしないか                           |

---

## 2. よくあるバグと対処法

### ❌ データを追加したのにリストに反映されない

```swift
// ✅ 保存後に必ず loadItems() を呼ぶ
private func addItem() {
    let newItem = 〇〇Model(title: newTitle)
    〇〇Service.add(newItem, to: modelContext)
    newTitle = ""
    loadItems()  // ← これを忘れずに！
}
```

---

### ❌ アプリを再起動するとデータが消える

`〇〇App.swift` の `ModelContainer` 設定で `isStoredInMemoryOnly` が `true` になっていないか確認。

```swift
// ❌ これだとデータが消える（テスト用）
let config = ModelConfiguration(isStoredInMemoryOnly: true)

// ✅ これが正しい（本番用）
let config = ModelConfiguration(isStoredInMemoryOnly: false)
```

> 💡 検索バーで「isStoredInMemoryOnly」と検索して確認しましょう。

---

### ❌ クラッシュする

クラッシュが起きたらXcodeのコンソール（下部の黒いエリア）にエラーメッセージが表示されます。  
エラーメッセージをよく読んで、何が問題かを特定しましょう。

よくある原因：

- 配列の範囲外アクセス（`Index out of range`）
- オプショナルの強制アンラップ（`!`）が失敗している
- `modelContext` が正しく設定されていない

---

### ❌ Xcodeのエラー・警告が消えない

- 🔴 **赤いエラー**: コンパイルエラー。エラー内容を読んでコードを修正する。
- 🟡 **黄色の警告**: 動くけど改善した方がいい箇所。無視できるものもある。
- エラーの意味が分からない場合は、エラーメッセージを先生に見せましょう。

---

## 3. print文でデバッグする

動作を確認したい箇所に `print` を入れると、コンソールで値を確認できます。

```swift
private func addItem() {
    print("addItem called, title: \(newTitle)")  // ← ここに追加
    let newItem = 〇〇Model(title: newTitle)
    〇〇Service.add(newItem, to: modelContext)
    loadItems()
    print("items count: \(items.count)")  // ← ここに追加
}
```

---

## 🔍 詰まったときの検索キーワード

| 困ったこと                     | 検索キーワード                         |
| ------------------------------ | -------------------------------------- |
| データが画面に反映されない     | 「loadTasks」「loadItems」「onAppear」 |
| データが再起動後に消える       | 「isStoredInMemoryOnly」               |
| 配列の扱い方を確認したい       | 「ForEach」「indices」                 |
| オプショナルの扱いに困っている | 「guard let」「if let」「??」          |
