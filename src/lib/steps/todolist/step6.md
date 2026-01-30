# ステップ6: タブ選択ヘッダーを作る

タブの切り替えと管理画面への移動ボタンをまとめたヘッダーコンポーネントを作成します。

### 1. TabHeaderView.swift の作成

`Components` フォルダ内に `TabHeaderView` というファイルを作成し、以下のコードを記述します。

```swift
import SwiftUI

struct TabHeaderView: View {
    // コンポーネント内で使うタブモデル
    struct ToDoTab: Identifiable {
        let id: UUID
        let name: String
    }

    // 表示するタブのデータ一覧
    let tabs: [ToDoTab]
    // 選択中のタブID（親ビューと共有するのでBinding）
    @Binding var selectedTabId: UUID?
    // 「タブ管理」ボタンが押された時のアクション
    let onManageTabs: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            // タブを選択するピッカー
            HStack(spacing: 8) {
                Image(systemName: "list.bullet")
                    .foregroundStyle(.secondary)

                Picker("タブを選択", selection: $selectedTabId) {
                    // タブ一覧をループして選択肢を作成
                    ForEach(tabs) { tab in
                        // tag には Optional(tab.id) を渡す必要がある点に注意
                        Text(tab.name).tag(Optional(tab.id))
                    }
                }
                .pickerStyle(.menu) // メニュースタイルで表示
            }
            .padding(.vertical, 8)
            .padding(.horizontal, 12)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(.secondarySystemBackground))
            )

            Spacer(minLength: 0)

            // タブ管理画面へ移動するボタン
            Button(action: onManageTabs) {
                Label("タブ管理", systemImage: "folder")
                    .padding(.vertical, 8)
                    .padding(.horizontal, 12)
            }
            .buttonStyle(.borderedProminent)
            .tint(.accentColor)
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(.systemBackground))
                .shadow(color: .black.opacity(0.08), radius: 6, x: 0, y: 2)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color(.separator), lineWidth: 1)
        )
        .padding(.bottom, 8) // 下に少し余白を開ける
    }
}

#Preview {
    // プレビュー用のダミー変数
    struct PreviewWrapper: View {
        let tabs: [TabHeaderView.ToDoTab]
        @State var selectedId: UUID?

        init() {
            let previewTabs = [
                TabHeaderView.ToDoTab(id: UUID(), name: "勉強"),
                TabHeaderView.ToDoTab(id: UUID(), name: "やること"),
                TabHeaderView.ToDoTab(id: UUID(), name: "趣味")
            ]
            tabs = previewTabs
            _selectedId = State(initialValue: previewTabs.first?.id)
        }

        var body: some View {
            TabHeaderView(
                tabs: tabs,
                selectedTabId: $selectedId,
                onManageTabs: { print("管理画面へ") }
            )
            .padding()
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
    struct ToDoTab: Identifiable {
        let id: UUID
        let name: String
    }

    let tabs: [ToDoTab]
    @Binding var selectedTabId: UUID?
    let onManageTabs: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            // タブを選択するピッカー
            HStack(spacing: 8) {
                Image(systemName: "list.bullet")
                    .foregroundStyle(.secondary)

                Picker("タブを選択", selection: $selectedTabId) {
                    ForEach(tabs) { tab in
                        Text(tab.name).tag(Optional(tab.id))
                    }
                }
                .pickerStyle(.menu)
            }
            .padding(.vertical, 8)
            .padding(.horizontal, 12)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(.secondarySystemBackground))
            )

            Spacer(minLength: 0)

            Button(action: onManageTabs) {
                Label("タブ管理", systemImage: "folder")
                    .padding(.vertical, 8)
                    .padding(.horizontal, 12)
            }
            .buttonStyle(.borderedProminent)
            .tint(.accentColor)
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(.systemBackground))
                .shadow(color: .black.opacity(0.08), radius: 6, x: 0, y: 2)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color(.separator), lineWidth: 1)
        )
        .padding(.bottom, 8)
    }
}

#Preview {
    struct PreviewWrapper: View {
        let tabs: [TabHeaderView.ToDoTab]
        @State var selectedId: UUID?

        init() {
            let previewTabs = [
                TabHeaderView.ToDoTab(id: UUID(), name: "勉強"),
                TabHeaderView.ToDoTab(id: UUID(), name: "やること"),
                TabHeaderView.ToDoTab(id: UUID(), name: "趣味")
            ]
            tabs = previewTabs
            _selectedId = State(initialValue: previewTabs.first?.id)
        }

        var body: some View {
            TabHeaderView(
                tabs: tabs,
                selectedTabId: $selectedId,
                onManageTabs: { print("管理画面へ") }
            )
            .padding()
        }
    }
    return PreviewWrapper()
}

```
