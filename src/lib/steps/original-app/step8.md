# ステップ8: UI部品を整える・機能を追加する

基本機能（CRUD）が揃ったら、使いやすく・見やすくするためのUI改善と機能拡張を行います。  
あなたのアプリに合った機能を選んで実装しましょう。

---

## 機能メニュー（必要なものを選んで実装）

### 🔍 A. 検索・フィルタ機能

```swift
@State private var searchText = ""

var filteredItems: [〇〇Model] {
    if searchText.isEmpty { return items }
    return items.filter { $0.title.localizedStandardContains(searchText) }
}

// bodyに追加
.searchable(text: $searchText, prompt: "検索...")
```

> 💡 検索バーで「filteredTasks」「localizedStandardContains」と検索して確認しましょう。

---

### 📅 B. 並び替え機能

```swift
// 例: 作成日の新しい順に並び替え
var sortedItems: [〇〇Model] {
    items.sorted { $0.createdAt > $1.createdAt }
}

// 例: 未完了を上に
var sortedItems: [〇〇Model] {
    items.sorted { !$0.isCompleted && $1.isCompleted }
}
```

> 💡 検索バーで「sorted」と検索すると並び替えの実装例があります。

---

### ✨ C. アニメーション追加

```swift
// タップ時のアニメーション
withAnimation(.spring(response: 0.3, dampingFraction: 0.5)) {
    isCompleted.toggle()
}

// 要素の出現アニメーション
.transition(.scale.combined(with: .opacity))
```

> 💡 検索バーで「withAnimation」「spring」と検索して確認しましょう。

---

### 📋 D. カスタムリスト行（UIを整える）

```swift
struct ItemRow: View {
    let item: 〇〇Model

    var body: some View {
        HStack {
            Image(systemName: item.isCompleted ? "checkmark.circle.fill" : "circle")
                .foregroundStyle(item.isCompleted ? .accentColor : .secondary)
            VStack(alignment: .leading) {
                Text(item.title)
                    .font(.body)
                Text(item.createdAt.formatted(date: .abbreviated, time: .omitted))
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
    }
}
```

---

### 🗓 E. 日付入力（DatePicker）

```swift
@State private var selectedDate = Date()

DatePicker("期限", selection: $selectedDate, displayedComponents: .date)
```

---

### 🔢 F. 数値・スライダー入力

```swift
@State private var rating = 3

Stepper("評価: \(rating)", value: $rating, in: 1...5)
// または
Slider(value: $progress, in: 0...1)
```

> 💡 検索バーで「Slider」「Stepper」と検索して確認しましょう。

---

## 🔍 詰まったときの検索キーワード

| 困ったこと | 検索キーワード |
|-----------|--------------|
| 検索機能を追加したい | 「searchable」「filteredTasks」 |
| 並び替えたい | 「sorted」「sort」 |
| アニメーションをつけたい | 「withAnimation」「spring」「transition」 |
| 日付を入力させたい | 「DatePicker」 |
| 数値を入力させたい | 「Stepper」「Slider」 |
| アイコンを表示したい | 「systemName」「Image」 |
