# ステップ9: HomeView の作成（タブ選択）

<script>
    import {base} from '$app/paths';
</script>

## HomeView.swift の作成

`Screens/Views/Main/`フォルダに`HomeView.swift`を作成します：

```swift
import SwiftUI
import SwiftData

struct HomeView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var tabs: [ToDoTab] = []
    @State private var selectedTabId: UUID?
    @Binding var navigationPath: [NavigationItem]

    var body: some View {
        VStack {
            if !tabs.isEmpty {
                Picker("タブを選択", selection: $selectedTabId) {
                    ForEach(tabs) { tab in
                        Text(tab.name).tag(Optional(tab.id))
                    }
                }
                .pickerStyle(.menu)
            }

            VStack {
                Text("タスク一覧がここに表示されます")
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            HStack {
                Button(action: {
                    navigationPath.append(NavigationItem(id: .tabManage))
                }) {
                    Text("タブ管理")
                }
                .padding()
            }
        }
        .padding()
        .navigationTitle("ToDoリスト")
        .onAppear {
            loadTabs()
        }
    }

    private func loadTabs() {
        let descriptor = FetchDescriptor<ToDoTab>()
        tabs = (try? modelContext.fetch(descriptor)) ?? []
        selectedTabId = tabs.first?.id
    }
}
```

## コードの説明

- `@Environment(\.modelContext)`: SwiftDataのコンテキストを取得して、データベースにアクセスします
- `Picker`: タブを選択するドロップダウンメニューです
- `loadTabs()`: アプリ起動時にデータベースからタブを読み込みます

## Pickerの説明

`Picker`は選択肢を提示するUIコンポーネントです。`pickerStyle(.menu)`でメニュー形式で表示されます。

## 次のステップへ

次は、タスク一覧を表示する部分を実装します。
