# ステップ21: 発展課題（もっと便利にするアイデア）

ここからは発展課題です。必要に応じて追加してください。

---

## 1. 検索機能

タスクを検索できるようにします。

```swift
import SwiftUI

struct HomeView: View {
   // タスク一覧（データベースから読み込んだ全件）
   @State private var tasks: [ToDoTask] = []
   // 検索ボックスに入力された文字列
   @State private var searchText = ""

   // 検索条件に基づいてフィルタリングされたタスクリスト
   var filteredTasks: [ToDoTask] {
      // 検索ワードが空なら全件を表示
      if searchText.isEmpty {
         return tasks
      }
      // タイトルに検索ワードが含まれているタスクだけを抽出（大文字小文字を区別しない）
      return tasks.filter { $0.title.localizedCaseInsensitiveContains(searchText) }
   }

   var body: some View {
      VStack(spacing: 12) {
         // 検索窓の表示
         TextField("検索", text: $searchText)
            .textFieldStyle(.roundedBorder)

         // フィルタリング済みのタスクをリスト表示
         CustomList(items: filteredTasks) { task in
            ToDoListItem(
               title: task.title,
               isCompleted: task.isCompleted
            ) {
               // 完了切り替えは既存の処理を使う
            }
         }
      }
      .padding()
   }
}
```

検索欄に入力された文字を使って、タスクリストをフィルタリングする方法です。  
`filteredTasks` という計算プロパティ（Computed Property）を作ることで、入力が変わるたびに自動的に絞り込み結果がリストに反映されるようになります。

---

## 2. ソート機能（完了/未完了の順）

```swift
import SwiftUI

struct HomeView: View {
   @State private var tasks: [ToDoTask] = []
   // ソート順を切り替えるフラグ
   @State private var sortCompletedFirst = false

   // フラグに応じて並び替えたタスクリスト
   var sortedTasks: [ToDoTask] {
      if sortCompletedFirst {
         // 完了しているものを先頭に持ってくる並び替えロジック
         return tasks.sorted { $0.isCompleted && !$1.isCompleted }
      }
      // フラグがオフなら元の順序のまま
      return tasks
   }

   var body: some View {
      VStack(spacing: 12) {
         // ソート機能のオンオフ切り替えスイッチ
         Toggle("完了を先に表示", isOn: $sortCompletedFirst)

         // 並び替えたタスクをリスト表示
         CustomList(items: sortedTasks) { task in
            ToDoListItem(
               title: task.title,
               isCompleted: task.isCompleted
            ) {
               // 完了切り替えは既存の処理を使う
            }
         }
      }
      .padding()
   }
}
```

`Toggle` スイッチを使って並び替えモードを切り替える例です。  
`.sorted` メソッドを使うことで、自分好みの順序（完了済みが上、日付順など）でリストを表示することができます。

---

## 3. 期限日の表示（簡易版）

```swift
import SwiftUI

struct ToDoListItem: View {
   let title: String
   let isCompleted: Bool
   // 追加：期限日を表示するためのテキスト
   let dueDateText: String
   let onToggle: () -> Void

   var body: some View {
      HStack {
         // タイトルと日付を縦に並べる
         VStack(alignment: .leading, spacing: 4) {
            Text(title)
               .font(.headline)
            // 日付を小さくグレーで表示
            Text(dueDateText)
               .font(.caption)
               .foregroundColor(.gray)
         }

         Spacer()

         Button(action: {
            onToggle()
         }) {
            Image(systemName: isCompleted ? "checkmark.circle.fill" : "circle")
               .font(.title2)
         }
      }
   }
}
```

---

## 4. タブにアイコンを付ける

```swift
import SwiftUI

struct TabLabel: View {
   let name: String
   let systemImageName: String

   var body: some View {
      Label(name, systemImage: systemImageName)
   }
}
```

---

## 5. ダークモード対応（色の使い分け）

```swift
import SwiftUI

struct ThemeSampleView: View {
   var body: some View {
      VStack(spacing: 12) {
         Text("ダークモード対応")
            .font(.title2)
         RoundedRectangle(cornerRadius: 12)
            .fill(Color.primary.opacity(0.1))
            .frame(height: 80)
      }
      .padding()
   }
}
```
