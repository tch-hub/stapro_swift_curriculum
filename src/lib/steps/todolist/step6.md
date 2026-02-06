# ステップ6: タブ選択ヘッダーを作る(TabHeaderView.swift)

## 1. 基本構造とデータ型の定義

`Components/TabHeaderView.swift` を開き、まずはタブを表すデータ型とコンポーネントの骨組みを作ります。

```swift
import SwiftUI

struct TabHeaderView: View {
    // タブ1つ分の情報を表す構造体
    struct ToDoTab: Identifiable, Hashable {
        let id: UUID
        let name: String
    }

    // 必要なプロパティ
    let tabs: [ToDoTab]                 // タブのリスト
    @Binding var selectedTabId: UUID?   // 選択中のタブID（親と共有）
    let onManageTabs: () -> Void        // 管理ボタンを押した時の処理

    // 現在選択されているタブの名前を取得するヘルパー
    private var selectedTabName: String {
        tabs.first(where: { $0.id == selectedTabId })?.name ?? "タブを選択"
    }

    var body: some View {
        // ここにレイアウトを書いていきます
        Text("Header")
    }
}
```

- `tabs.first(where: { ... })`: リストの中から、条件（IDが一致するもの）に合う最初のタブを探します。
- `?.name`: タブが見つかればその名前を取得します。
- `?? "タブを選択"`: もしタブが見つからなければ（未選択など）、代わりに "タブを選択" という文字を使います。

## 2. UIの実装: レイアウトの枠組み

````


`body` の中身を実装します。横並びのレイアウトを作り、左側にタブ切り替えメニュー、右側に管理ボタンを配置します。

```swift
    var body: some View {
        HStack(alignment: .center, spacing: 16) {

            // ①ここにタブ切り替えメニューを追加します

            Spacer()

            // ②ここに管理ボタンを追加します

        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color(.systemBackground))
        .overlay(alignment: .bottom) {
             Divider() // 下に境界線を引く
        }
    }
````

## 3. UIの実装: タブ切り替えメニュー

`Menu` と `Picker` を使って、タップすると選択肢が出てくるドロップダウンメニューを作ります。`// ①ここにタブ切り替えメニューを追加します` の部分に記述してください。

```swift
            Menu {
                Picker("タブ", selection: $selectedTabId) {
                    ForEach(tabs) { tab in
                        Text(tab.name)
                            .tag(Optional(tab.id))
                    }
                }
            } label: {
                // メニューの見た目（ラベル）
                HStack(spacing: 6) {
                    Text(selectedTabName)
                        .font(.title3)
                        .fontWeight(.bold)
                        .foregroundStyle(.primary)

                    Image(systemName: "chevron.down")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .contentShape(Rectangle()) // タップ領域を確保
            }
```

- `Menu`: タップするとメニューを開きます。
- `Picker`: メニューの中身として、タブの選択肢を表示します。
- `label`: メニューが閉じている時の見た目を定義します。現在のタブ名と下向き矢印を表示します。

## 4. UIの実装: 管理ボタン

ヘッダーの右端に、タブ追加などの管理画面へ移動するためのボタンを配置します。`// ②ここに管理ボタンを追加します` の部分です。

```swift
            Button(action: onManageTabs) {
                Image(systemName: "slider.horizontal.3")
                    .font(.system(size: 20))
                    .foregroundStyle(.primary)
                    .padding(8)
                    .background(
                        Circle()
                            .fill(Color(.secondarySystemBackground))
                    )
            }
```

## 5. プレビューの作成

動作確認用のプレビューを追加します。ダミーデータを作って表示します。

```swift
#Preview {
    struct PreviewWrapper: View {
        // ダミーデータの作成
        let tabs = [
            TabHeaderView.ToDoTab(id: UUID(), name: "勉強"),
            TabHeaderView.ToDoTab(id: UUID(), name: "買い物"),
            TabHeaderView.ToDoTab(id: UUID(), name: "プロジェクトA")
        ]
        @State var selectedId: UUID?

        // 初期選択状態を設定
        init() {
            _selectedId = State(initialValue: tabs.first?.id)
        }

        var body: some View {
            VStack(spacing: 0) {
                TabHeaderView(
                    tabs: tabs,
                    selectedTabId: $selectedId,
                    onManageTabs: { print("管理画面へ") }
                )

                // コンテンツ部分のダミー
                Color(.secondarySystemBackground)
                    .overlay {
                        Text("リストの中身")
                            .foregroundStyle(.secondary)
                    }
            }
        }
    }
    return PreviewWrapper()
}
```

---

## コード全体

<img src="/images/todolist/TabHeaderView.png" alt="TabHeaderViewの完成イメージ" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

### Components/TabHeaderView.swift

```swift
import SwiftUI

struct TabHeaderView: View {
    struct ToDoTab: Identifiable, Hashable {
        let id: UUID
        let name: String
    }

    let tabs: [ToDoTab]
    @Binding var selectedTabId: UUID?
    let onManageTabs: () -> Void

    private var selectedTabName: String {
        tabs.first(where: { $0.id == selectedTabId })?.name ?? "タブを選択"
    }

    var body: some View {
        HStack(alignment: .center, spacing: 16) {
            // MARK: - タブ切り替えメニュー
            Menu {
                Picker("タブ", selection: $selectedTabId) {
                    ForEach(tabs) { tab in
                        Text(tab.name)
                            .tag(Optional(tab.id))
                    }
                }
            } label: {
                HStack(spacing: 6) {
                    Text(selectedTabName)
                        .font(.title3)
                        .fontWeight(.bold)
                        .foregroundStyle(.primary)

                    Image(systemName: "chevron.down")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .contentShape(Rectangle())
            }

            Spacer()

            // MARK: - 管理ボタン
            Button(action: onManageTabs) {
                Image(systemName: "slider.horizontal.3")
                    .font(.system(size: 20))
                    .foregroundStyle(.primary)
                    .padding(8)
                    .background(
                        Circle()
                            .fill(Color(.secondarySystemBackground))
                    )
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color(.systemBackground))
        .overlay(alignment: .bottom) {
             Divider()
        }
    }
}

#Preview {
    struct PreviewWrapper: View {
        let tabs = [
            TabHeaderView.ToDoTab(id: UUID(), name: "勉強"),
            TabHeaderView.ToDoTab(id: UUID(), name: "買い物"),
            TabHeaderView.ToDoTab(id: UUID(), name: "プロジェクトA")
        ]
        @State var selectedId: UUID?

        init() {
            _selectedId = State(initialValue: tabs.first?.id)
        }

        var body: some View {
            VStack(spacing: 0) {
                TabHeaderView(
                    tabs: tabs,
                    selectedTabId: $selectedId,
                    onManageTabs: { print("管理画面へ") }
                )
                Color(.secondarySystemBackground)
                    .overlay {
                        Text("リストの中身")
                            .foregroundStyle(.secondary)
                    }
            }
        }
    }
    return PreviewWrapper()
}
```
