# ステップ6: タブ選択ヘッダーを作る

## このステップで学ぶこと

タブの切り替えと管理画面への移動ボタンをまとめたヘッダーコンポーネントを作成します。

Webブラウザのタブや、設定アプリのカテゴリ選択を想像してください。このステップでは、複数のタブから1つを選んで切り替えるUIを作ります。また、タブを追加・削除するための「管理」ボタンも配置します。

### 1. 新しいファイルを作成する

まず、`Components` フォルダ内に `TabHeaderView.swift` という新しいファイルを作成しましょう。

### 2. 基本的な構造を書く

それでは、一つずつコードを書いていきましょう。

#### 📦 手順① import文とViewの骨組みを書く

まず、必要な部品を読み込んで、基本的な構造を作ります。

```swift
import SwiftUI

struct TabHeaderView: View {
    var body: some View {
        // ここにこれから内容を書いていきます
    }
}
```

#### 📋 手順② タブのデータ構造を定義する

**`struct TabHeaderView: View {` の直下**に、タブを表すデータ構造を追加します。

```swift
struct ToDoTab: Identifiable, Hashable {
    let id: UUID
    let name: String
}
```

**データ構造の説明：**

- **`struct ToDoTab`**: タブ1つ分の情報を表す構造体
- **`Identifiable`**: リストで使うために、一意のIDを持つことを示します
- **`Hashable`**: Pickerで使うために必要な機能
- **`let id: UUID`**: タブを識別するための一意のID
- **`let name: String`**: タブの名前（「勉強」「買い物」など）

#### 🎯 手順③ プロパティを追加する

**`struct ToDoTab` の閉じ括弧 `}` の下**に、このビューで使うプロパティを追加します。

```swift
let tabs: [ToDoTab]
@Binding var selectedTabId: UUID?
let onManageTabs: () -> Void
```

**プロパティの説明：**

- **`let tabs: [ToDoTab]`**: 全てのタブのリスト（配列）
- **`@Binding var selectedTabId: UUID?`**: 現在選択されているタブのID
  - `@Binding` をつけることで、親ビューと同期します
  - `?` がついているので、何も選択されていない状態もあります
- **`let onManageTabs: () -> Void`**: 管理ボタンが押された時に実行する処理

#### 🔍 手順④ 選択中のタブ名を取得するヘルパーを追加する

**`let onManageTabs` の下**に、現在選択されているタブの名前を取得する便利な機能を追加します。

```swift
// 現在選択されているタブの名前を取得するヘルパー
private var selectedTabName: String {
    tabs.first(where: { $0.id == selectedTabId })?.name ?? "タブを選択"
}
```

**ヘルパーの説明：**

- **`private var selectedTabName`**: 選択中のタブ名を取得します
- **`tabs.first(where: { ... })`**: タブのリストから、IDが一致するものを探します
- **`?.name`**: 見つかったタブの名前を取得（見つからない場合は `nil`）
- **`?? "タブを選択"`**: 見つからない場合は「タブを選択」と表示します

#### 📱 手順⑤ 画面のレイアウトを作る（メインの構造）

**`var body: some View { }` の中**にコードを書きます。コメントの部分を以下のコードに置き換えてください。

```swift
HStack(alignment: .center, spacing: 16) {
    // タブ切り替えメニュー（これから書きます）

    Spacer()

    // 管理ボタン（これから書きます）
}
.padding(.horizontal, 16)
.padding(.vertical, 12)
.background(Color(.systemBackground))
.overlay(alignment: .bottom) {
    Divider()
}
```

**レイアウトの説明：**

- **`HStack`**: 横並びのレイアウト
- **`Spacer()`**: 左右の要素の間に空きスペースを作ります
- **`.padding`**: 余白を追加
- **`.background`**: 背景色を設定
- **`Divider()`**: 下部に境界線を追加

#### 🔽 手順⑥ タブ切り替えメニューを作る

**`HStack` の中の「タブ切り替えメニュー（これから書きます）」のコメント部分**を、以下のコードに置き換えてください。

```swift
Menu {
    Picker("タブ", selection: $selectedTabId) {
        ForEach(tabs) { tab in
            HStack {
                Text(tab.name)
            }
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
.accessibilityLabel("タブを選択: 現在は\(selectedTabName)")
```

**タブメニューの詳しい説明：**

**Menuの仕組み：**

- **`Menu { ... } label: { ... }`**: メニュー（ドロップダウン）を作ります
  - `Menu` の中身：タップした時に表示される選択肢
  - `label` の中身：通常時に表示される見た目

**Pickerの部分：**

- **`Picker("タブ", selection: $selectedTabId)`**: 選択肢を表示
  - `selection: $selectedTabId`: 選ばれたIDを `selectedTabId` に反映
- **`ForEach(tabs)`**: 全てのタブをループで表示
- **`.tag(Optional(tab.id))`**: この選択肢が選ばれた時に設定される値

**ラベルの部分（通常時の見た目）：**

- **`Text(selectedTabName)`**: 現在選択されているタブ名を表示
- **`.font(.title3)`**: 見出しサイズにします
- **`.fontWeight(.bold)`**: 太字にします
- **`Image(systemName: "chevron.down")`**: 下向きの矢印アイコン
- **`.contentShape(Rectangle())`**: タップできる範囲を広げます
- **`.accessibilityLabel`**: 視覚障害者向けの読み上げテキスト

#### ⚙️ 手順⑦ 管理ボタンを作る

**`Spacer()` の下の「管理ボタン（これから書きます）」のコメント部分**を、以下のコードに置き換えてください。

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
.accessibilityLabel("タブの管理")
```

**管理ボタンの説明：**

- **`Button(action: onManageTabs)`**: ボタンを押すと `onManageTabs` が実行されます
- **`Image(systemName: "slider.horizontal.3")`**: スライダーのアイコン（設定を連想させる）
- **`.font(.system(size: 20))`**: アイコンのサイズを20ポイントに
- **`.padding(8)`**: アイコンの周りに余白を追加
- **`Circle()`**: 円形の背景を作ります
- **`.fill(Color(.secondarySystemBackground))`**: グレーの背景色を設定

#### 👀 手順⑧ プレビュー機能を追加する

最後に、**`TabHeaderView` の構造体の下**（閉じ括弧 `}` の後）に、プレビュー用のコードを追加します。

```swift
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

**プレビューの説明：**

- **`let tabs`**: サンプルのタブを3つ用意
- **`@State var selectedId`**: 選択中のタブIDを管理
- **`init()`**: 最初のタブを選択した状態で開始
- **`VStack`**: ヘッダーとコンテンツを縦に並べる
- **`Color(.secondarySystemBackground)`**: ダミーのコンテンツ領域

これで `TabHeaderView.swift` が完成しました！🎉

---

## なぜこのような構成にするのか

このヘッダーコンポーネントは、以下の点で工夫されています：

1. **MenuとPickerの組み合わせ**: タップするとメニューが開き、タブを選択できます
2. **視覚的に分かりやすい**: 現在のタブ名が大きく表示され、下向き矢印で「タップできる」ことを示します
3. **管理機能の分離**: タブの切り替えと管理を別のボタンにすることで、誤操作を防ぎます
4. **アクセシビリティ対応**: 視覚障害者向けの読み上げテキストを設定しています

---

## 完成したコード全体

<img src="/images/todolist/TabHeaderView.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

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
