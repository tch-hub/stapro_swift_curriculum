# ステップ14: TabManageView の作成（基本構造）

<script>
    import {base} from '$app/paths';
</script>

## TabManageView.swift の作成

`Screens/Views/Main/`フォルダに`TabManageView.swift`を作成します：

```swift
import SwiftUI
import SwiftData

/// タブ管理画面
struct TabManageView: View {
    // データの取得は @Query を使って簡潔にする
    @Query(sort: \ToDoTab.createdAt) private var toDoTabs: [ToDoTab]

    @Environment(\.dismiss) private var dismiss
    
    // アラート制御用
    @State private var isAddTabPresented = false
    @State private var isEditTabPresented = false
    @State private var alertInfo: AlertInfo?
    @State private var selectedToDoTab: ToDoTab?

    private let todoTabService = ToDoTabService()

    var body: some View {
        // Listの代わりにCustomListを使用
        CustomList(items: toDoTabs, onDelete: onDeleteButtonTapped) { toDoTab in
            Text(toDoTab.name)
                .padding(.vertical, 8)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
                .contentShape(Rectangle())
                .onTapGesture {
                    selectedToDoTab = toDoTab
                    isEditTabPresented = true
                }
        }
        .contentMargins(.top, 30)

        // ナビゲーションバー設定（Component化されている場合）
        .navigationBarSetting(title: "タブ管理", isVisible: true)
        .navigationBarIconSetting(name: "plus", isEnabled: true, action: onTabAddIconTapped)

        // 画面スタイル
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color("BgColor")) // アセットで定義した色

        // アラートコンポーネントの使用
        .textFieldAlert(isPresented: $isAddTabPresented,
                        title: "タブ追加",
                        message: "追加するタブ名を入力してください\n(20文字以内)",
                        placeholder: "例）勉強",
                        defaultText: "",
                        maxLength: 20,
                        onConfirm: addTab)
        .textFieldAlert(isPresented: $isEditTabPresented,
                        title: "タブ修正",
                        message: "修正するタブ名を入力してください\n(20文字以内)",
                        placeholder: "例）勉強",
                        defaultText: selectedToDoTab?.name ?? "",
                        maxLength: 20,
                        onConfirm: editTab)
        .customAlert(alertInfo: $alertInfo)
    }

    /// タブ追加アイコンタップ時
    private func onTabAddIconTapped() {
        isAddTabPresented = true
    }

    /// 削除ボタンタップ時
    private func onDeleteButtonTapped(toDoTab: ToDoTab) {
        do {
            try todoTabService.delete(tabId: toDoTab.id)
        } catch {
            alertInfo = .init(title: "エラー", message: "タブの削除に失敗しました")
        }
    }

    /// タブ追加処理
    private func addTab(text: String) {
        do {
            _ = try todoTabService.add(name: text)
        } catch {
            alertInfo = .init(title: "エラー", message: "タブの追加に失敗しました")
        }
    }

    /// タブ修正処理
    private func editTab(text: String) {
        guard let toDoTab = selectedToDoTab else { return }
        do {
            try todoTabService.edit(tabId: toDoTab.id, name: text)
        } catch {
            alertInfo = .init(title: "エラー", message: "タブの修正に失敗しました")
        }
    }
}

#Preview {
    NavigationView {
        TabManageView()
            // プレビュー用のコンテナ設定が必要ならここに追加
             .modelContainer(SwiftDataService.shared.getModelContainer()) 
    }
}
```

## 各要素の説明

- `loadTabs()`: データベースからすべてのタブを読み込みます
- `addTab()`: 新しいタブを追加します
- `deleteTab()`: タブを削除します（関連するタスクも削除されます）
- `@Environment(\.dismiss)`: 前の画面に戻るために使用します

## 次のステップへ

次は、このビューをより整えて、エラーハンドリングを追加します。
