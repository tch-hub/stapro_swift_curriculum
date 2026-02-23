# ステップ10: UI仕上げ・磨き込み

機能が揃い、バグも直ったら、最後の仕上げです。  
「使いやすい」「見た目が良い」アプリに仕上げましょう。

---

## 1. カラーとフォントを整える

### アクセントカラーを統一する

```swift
// 統一したカラーを使う
.foregroundStyle(.accentColor)   // アプリのメインカラー
.foregroundStyle(.primary)       // 通常のテキスト
.foregroundStyle(.secondary)     // サブのテキスト（グレー）
```

### フォントを整える

```swift
Text("タイトル")
    .font(.headline)        // 見出し

Text("説明文")
    .font(.body)            // 本文

Text("補足情報")
    .font(.caption)         // 小さいテキスト
    .foregroundStyle(.secondary)
```

---

## 2. 余白とレイアウトを整える

```swift
VStack(spacing: 12) {      // 要素間のスペース
    // ...
}
.padding(16)               // 外側の余白
.padding(.horizontal, 16)  // 横方向のみ
.padding(.top, 8)          // 上方向のみ
```

---

## 3. 角丸・影でカードっぽくする

```swift
VStack {
    // 内容
}
.padding()
.background(Color(.secondarySystemBackground))
.clipShape(RoundedRectangle(cornerRadius: 12))
.shadow(color: .black.opacity(0.05), radius: 4, y: 2)
```

---

## 4. ダークモード対応を確認する

Xcodeのプレビューで「Dark Mode」に切り替えて確認しましょう。

> 💡 `Color(.systemBackground)` や `.primary` など、システムカラーを使っていれば自動でダークモード対応になります。  
> ピンポイントで色を指定している箇所（`Color.white` など）はダークモードで見えにくくなるかもしれません。

---

## 5. アプリアイコンを設定する（任意）

1. `Assets.xcassets` → `AppIcon` を選択
2. 1024×1024pxの画像をドラッグ＆ドロップ

> 💡 アイコンはシンプルなもので大丈夫です！

---

## 6. 細かい改善アイデア

以下の中から「やれそうなもの」を選んで実装してみましょう。

- **ロード中の表示**: データ取得中に `ProgressView()` を表示する
- **成功フィードバック**: 保存が完了したらHaptic（振動）を出す
- **スクロール**: リストが長い時のスクロール動作を確認する
- **キーボードを閉じる**: 入力後に `resignFirstResponder` でキーボードを閉じる

---

## 🔍 詰まったときの検索キーワード

| 困ったこと | 検索キーワード |
|-----------|--------------|
| 色を設定したい | 「foregroundStyle」「accentColor」「secondary」 |
| 角丸にしたい | 「clipShape」「RoundedRectangle」「cornerRadius」 |
| 影をつけたい | 「shadow」 |
| フォントを変えたい | 「font」「headline」「caption」 |
| ダークモードで確認したい | 「systemBackground」「Color」 |
| ローディング表示したい | 「ProgressView」 |
