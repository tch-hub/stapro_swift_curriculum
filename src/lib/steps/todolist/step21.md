# ステップ21: 発展課題（もっと便利にするアイデア）

ここからは発展課題です。必要に応じて追加してください。

---

## 1. 検索機能

タスクを検索できるようにします。

```swift
import SwiftUI

struct HomeView: View {
   @State private var tasks: [ToDoTask] = []
   @State private var searchText = ""

   var filteredTasks: [ToDoTask] {
      if searchText.isEmpty {
         return tasks
      }
      return tasks.filter { $0.title.localizedCaseInsensitiveContains(searchText) }
   }

   var body: some View {
      VStack(spacing: 12) {
         TextField("検索", text: $searchText)
            .textFieldStyle(.roundedBorder)

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

---

## 2. ソート機能（完了/未完了の順）

```swift
import SwiftUI

struct HomeView: View {
   @State private var tasks: [ToDoTask] = []
   @State private var sortCompletedFirst = false

   var sortedTasks: [ToDoTask] {
      if sortCompletedFirst {
         return tasks.sorted { $0.isCompleted && !$1.isCompleted }
      }
      return tasks
   }

   var body: some View {
      VStack(spacing: 12) {
         Toggle("完了を先に表示", isOn: $sortCompletedFirst)

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

---

## 3. 期限日の表示（簡易版）

```swift
import SwiftUI

struct ToDoListItem: View {
   let title: String
   let isCompleted: Bool
   let dueDateText: String
   let onToggle: () -> Void

   var body: some View {
      HStack {
         VStack(alignment: .leading, spacing: 4) {
            Text(title)
               .font(.headline)
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