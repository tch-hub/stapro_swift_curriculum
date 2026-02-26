---
title: ステップ5: データの表示（Read）
summary: データベースからデータを取得してリスト表示する
---

データベースからデータを取得して、画面に一覧表示する機能を実装します。  
「読み込んで表示する」ができれば、アプリらしい動きになります。

---

## 1. データベースに接続する

画面のビューに以下を追加します。

```swift
struct HomeView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var items: [〇〇Model] = []

    var body: some View {
        // ...
    }
}
```

---

## 2. データを取得して表示する

```swift
var body: some View {
    List(items) { item in
        Text(item.title)
    }
    .onAppear {
        loadItems()
    }
}

private func loadItems() {
    let descriptor = FetchDescriptor<〇〇Model>()
    items = (try? modelContext.fetch(descriptor)) ?? []
}
```

> 💡 ヒント: ToDoリストアプリの `loadTasks()` と同じパターンです。  
> 検索バーで「FetchDescriptor」と検索して確認しましょう。

---

## 3. 条件でフィルタリングして取得する

特定の条件に合うデータだけ取得したい場合：

```swift
// 例: isPinnedがtrueのものだけ
let descriptor = FetchDescriptor<〇〇Model>(
    predicate: #Predicate { $0.isPinned == true }
)
```

> 💡 検索バーで「#Predicate」と検索すると実装例が見つかります。

---

## 4. データが0件のときの表示

```swift
var body: some View {
    if items.isEmpty {
        // 空の状態の表示
        VStack {
            Image(systemName: "tray")
                .font(.system(size: 48))
                .foregroundColor(.gray)
            Text("まだデータがありません")
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    } else {
        List(items) { item in
            Text(item.title)
        }
    }
}
```

> 💡 ヒント: ToDoリストアプリの `EmptyStateView` と同じパターンです。  
> 検索バーで「EmptyStateView」と検索して確認しましょう。

---

## 🔍 詰まったときの検索キーワード

| 困ったこと                         | 検索キーワード                            |
| ---------------------------------- | ----------------------------------------- |
| データの取得方法                   | 「FetchDescriptor」「modelContext.fetch」 |
| データベース接続                   | 「@Environment」「modelContext」          |
| リスト表示                         | 「List」「ForEach」                       |
| 条件で絞り込みたい                 | 「#Predicate」「predicate」               |
| 画面が開いたタイミングで処理したい | 「onAppear」                              |
| 空の状態を表示したい               | 「EmptyStateView」「isEmpty」             |
