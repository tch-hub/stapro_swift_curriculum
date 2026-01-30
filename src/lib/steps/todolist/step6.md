# ステップ6: タブ選択ヘッダーを作る

タブの切り替えと管理画面への移動ボタンをまとめたヘッダーコンポーネントを作成します。

### 1. TabHeaderView.swift の作成

`Components` フォルダ内に `TabHeaderView` というファイルを作成し、以下のコードを記述します。

```swift
import SwiftUI

struct TabHeaderView: View {
    struct ToDoTab: Identifiable, Hashable { // Hashableを追加（Picker/Menuの制御に有利）
        let id: UUID
        let name: String
    }

    let tabs: [ToDoTab]
    @Binding var selectedTabId: UUID?
    let onManageTabs: () -> Void

    // 現在選択されているタブの名前を取得するヘルパー
    private var selectedTabName: String {
        tabs.first(where: { $0.id == selectedTabId })?.name ?? "タブを選択"
    }

    var body: some View {
        HStack(alignment: .center, spacing: 16) {
            // MARK: - タブ切り替えエリア (メインアクション)
            Menu {
                // セクション分けすることで、選択肢と管理機能を分離することも可能
                Picker("タブ", selection: $selectedTabId) {
                    ForEach(tabs) { tab in
                        HStack {
                            Text(tab.name)
                            // 選択中の項目にチェックマークが付くのはシステムの標準挙動
                        }
                        .tag(Optional(tab.id))
                    }
                }
            } label: {
                // カスタムラベルでタップ領域を明確化
                HStack(spacing: 6) {
                    Text(selectedTabName)
                        .font(.title3) // サイズを大きくして見出しらしく
                        .fontWeight(.bold)
                        .foregroundStyle(.primary)
                    
                    Image(systemName: "chevron.down")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .contentShape(Rectangle()) // タップ領域を確保
            }
            .accessibilityLabel("タブを選択: 現在は\(selectedTabName)")

            Spacer()

            // MARK: - 管理ボタン (サブアクション)
            // 視覚的な重みを減らし、アイコンメインにする
            Button(action: onManageTabs) {
                Image(systemName: "slider.horizontal.3") // または "folder.badge.gear" など
                    .font(.system(size: 20))
                    .foregroundStyle(.primary)
                    .padding(8)
                    .background(
                        Circle()
                            .fill(Color(.secondarySystemBackground))
                    )
            }
            .accessibilityLabel("タブの管理")
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        // 外枠を削除し、背景色やDividerで区切るスタイルへ変更
        .background(Color(.systemBackground))
        .overlay(alignment: .bottom) {
             Divider() // コンテンツとの境界線
        }
    }
}

// MARK: - Preview
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
                
                // 下部のコンテンツエリア（ダミー）
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

`Picker` を使うことで、複数のタブから1つを選択するUIを簡単に作れます。選択されたIDは `$selectedTabId` を通じて親ビューに伝わります。
右側には「タブ管理」ボタンを配置し、押されたら `onManageTabs` クロージャを実行します。

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
import SwiftUI

struct TabHeaderView: View {
    struct ToDoTab: Identifiable, Hashable { // Hashableを追加（Picker/Menuの制御に有利）
        let id: UUID
        let name: String
    }

    let tabs: [ToDoTab]
    @Binding var selectedTabId: UUID?
    let onManageTabs: () -> Void

    // 現在選択されているタブの名前を取得するヘルパー
    private var selectedTabName: String {
        tabs.first(where: { $0.id == selectedTabId })?.name ?? "タブを選択"
    }

    var body: some View {
        HStack(alignment: .center, spacing: 16) {
            // MARK: - タブ切り替えエリア (メインアクション)
            Menu {
                // セクション分けすることで、選択肢と管理機能を分離することも可能
                Picker("タブ", selection: $selectedTabId) {
                    ForEach(tabs) { tab in
                        HStack {
                            Text(tab.name)
                            // 選択中の項目にチェックマークが付くのはシステムの標準挙動
                        }
                        .tag(Optional(tab.id))
                    }
                }
            } label: {
                // カスタムラベルでタップ領域を明確化
                HStack(spacing: 6) {
                    Text(selectedTabName)
                        .font(.title3) // サイズを大きくして見出しらしく
                        .fontWeight(.bold)
                        .foregroundStyle(.primary)
                    
                    Image(systemName: "chevron.down")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .contentShape(Rectangle()) // タップ領域を確保
            }
            .accessibilityLabel("タブを選択: 現在は\(selectedTabName)")

            Spacer()

            // MARK: - 管理ボタン (サブアクション)
            // 視覚的な重みを減らし、アイコンメインにする
            Button(action: onManageTabs) {
                Image(systemName: "slider.horizontal.3") // または "folder.badge.gear" など
                    .font(.system(size: 20))
                    .foregroundStyle(.primary)
                    .padding(8)
                    .background(
                        Circle()
                            .fill(Color(.secondarySystemBackground))
                    )
            }
            .accessibilityLabel("タブの管理")
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        // 外枠を削除し、背景色やDividerで区切るスタイルへ変更
        .background(Color(.systemBackground))
        .overlay(alignment: .bottom) {
             Divider() // コンテンツとの境界線
        }
    }
}

// MARK: - Preview
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
                
                // 下部のコンテンツエリア（ダミー）
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
