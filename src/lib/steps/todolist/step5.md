# ステップ5: タスク入力バーを作る(InputView.swift)

## このステップで学ぶこと

画面下部に、新しいタスクを追加するための入力フィールドとボタンをまとめたコンポーネントを作成します。

メッセージアプリでテキストを入力して送信する画面を想像してください。このステップでは、それと同じような入力バーを作ります。このコンポーネントは汎用的に設計されており、タスク追加だけでなくタブ追加など、様々な入力シーンで使用できます。

### 1. ファイルを開く

ステップ1で作成した `Components/TaskInputView.swift` を開いてください。ここにコードを書いていきます。

### 2. 基本的な構造を書く

それでは、一つずつコードを書いていきましょう。

#### 📦 手順① import文とViewの骨組みを書く

まず、必要な部品を読み込んで、基本的な構造を作ります。

```swift
import SwiftUI

struct InputView: View {
    @Binding var text: String
    let onAdd: () -> Void

    let placeholder: String
    let buttonIcon: String

    var body: some View {
        // ここにこれから内容を書いていきます
    }
}
```

**各部分の説明：**

- **`@Binding var text: String`**: 親から受け取った文字列を、この画面でも編集できるようにします
  - `@Binding` をつけると、親と子で同じデータを共有できます
- **`let onAdd: () -> Void`**: ボタンが押された時に実行する処理を、外から受け取ります
- **`let placeholder: String`**: 入力欄に表示するヒント文字（「新しいタスクを追加...」など）
- **`let buttonIcon: String`**: ボタンに表示するアイコンの名前

#### 🎨 手順② イニシャライザを追加する

**`let buttonIcon: String` の下**に、初期値を設定するためのコードを追加します。

```swift
// デフォルト値を持つイニシャライザ
init(
    text: Binding<String>,
    placeholder: String = "新しいタスクを追加...",
    buttonIcon: String = "arrow.up.circle.fill",
    onAdd: @escaping () -> Void
) {
    self._text = text
    self.placeholder = placeholder
    self.buttonIcon = buttonIcon
    self.onAdd = onAdd
}
```

**イニシャライザの説明：**

- **`init`**: この部品を使う時の初期設定を行います
- **`= "新しいタスクを追加..."`**: デフォルト値を設定しています（省略可能）
- **`@escaping`**: 後から実行される関数であることを示します
- **`self._text = text`**: `@Binding` のデータを受け取る特別な書き方です

#### 🎯 手順③ フォーカスと入力チェックのプロパティを追加する

**`init` の閉じ括弧 `}` の下**に、キーボードの表示制御と入力チェック用のコードを追加します。

```swift
// キーボードのフォーカス制御
@FocusState private var isFocused: Bool

// 入力値が空でないかどうかの判定（トリミング済み）
private var isValid: Bool {
    !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
}
```

**各部分の説明：**

- **`@FocusState`**: キーボードが表示されているかどうかを管理します
- **`private var isValid`**: 入力が有効かどうかをチェックします
- **`trimmingCharacters`**: 前後の空白や改行を削除して、空っぽじゃないか確認します

#### 📱 手順④ 画面のレイアウトを作る

**`var body: some View { }` の中**にコードを書きます。コメントの部分を以下のコードに置き換えてください。

```swift
HStack(alignment: .bottom, spacing: 12) {
    // テキスト入力エリア
    TextField(placeholder, text: $text, axis: .vertical)
        .focused($isFocused)
        .padding(.vertical, 10)
        .padding(.horizontal, 16)
        .background(
            Capsule()
                .fill(Color(.secondarySystemBackground))
        )
        .onSubmit {
            handleSubmit()
        }
        .submitLabel(.send)

    // 送信ボタン
    Button(action: handleSubmit) {
        Image(systemName: buttonIcon)
            .resizable()
            .aspectRatio(contentMode: .fit)
            .frame(width: 32, height: 32)
            .foregroundStyle(isValid ? Color.accentColor : Color(.systemGray4))
            .scaleEffect(isValid ? 1.0 : 0.9)
            .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isValid)
    }
    .disabled(!isValid)
    .padding(.bottom, 4)
}
.padding(.horizontal, 16)
.padding(.vertical, 12)
.background(.ultraThinMaterial)
.overlay(alignment: .top) {
    Divider()
}
```

**各部分の詳しい説明：**

**テキスト入力部分：**

- **`HStack`**: 横並びのレイアウト（入力欄とボタンを横に並べる）
- **`TextField`**: 文字を入力する欄
  - **`axis: .vertical`**: 複数行の入力に対応
  - **`$text`**: `$` をつけることで、入力内容を `text` 変数に反映します
- **`.focused($isFocused)`**: キーボードの表示状態を管理
- **`.padding`**: 余白を追加
- **`Capsule()`**: 角が丸い背景を作ります（メッセージアプリのような見た目）
- **`.onSubmit`**: キーボードの改行ボタンを押した時の処理
- **`.submitLabel(.send)`**: キーボードのボタンを「送信」にします

**送信ボタン部分：**

- **`Button`**: ボタンを作ります
- **`Image(systemName: buttonIcon)`**: アイコン画像を表示
- **`.resizable()`**: サイズを変更可能にします
- **`.frame(width: 32, height: 32)`**: ボタンのサイズを32×32ポイントに設定
- **`isValid ? Color.accentColor : Color(.systemGray4)`**: 入力が有効なら青色、無効ならグレーに
- **`.scaleEffect`**: サイズを少し変えてアニメーション効果
- **`.animation`**: 滑らかなアニメーション
- **`.disabled(!isValid)`**: 入力が空の時はボタンを無効化

**全体のスタイル：**

- **`.background(.ultraThinMaterial)`**: 背景を半透明にします（iOS標準のぼかし効果）
- **`Divider()`**: 上部に細い線を引いて、コンテンツと分離します

#### ⚙️ 手順⑤ 送信処理の関数を追加する

最後に、**`var body: some View { }` の閉じ括弧 `}` の下**に、送信処理を行う関数を追加します。

```swift
// 追加処理のロジック
private func handleSubmit() {
    guard isValid else { return }

    onAdd()

    // 追加後も入力を続けたい場合はコメントアウトを外す
    // isFocused = true
}
```

**関数の説明：**

- **`private func handleSubmit()`**: 送信ボタンを押した時の処理
- **`guard isValid else { return }`**: 入力が空の場合は何もしない
- **`onAdd()`**: 親から受け取った処理を実行（タスクを追加するなど）
- **`// isFocused = true`**: コメントを外すと、追加後もキーボードが開いたまま

#### 👀 手順⑥ プレビュー機能を追加する

**`InputView` の構造体の下**（閉じ括弧 `}` の後）に、プレビュー用のコードを追加します。

```swift
// MARK: - Preview
#Preview {
    struct PreviewWrapper: View {
        @State var text = ""
        @State var tasks: [String] = ["リストにアイテムを追加できます"]

        var body: some View {
            ZStack(alignment: .bottom) {
                List {
                    ForEach(tasks, id: \.self) { task in
                        Text(task)
                    }
                }
                .contentMargins(.bottom, 80, for: .scrollContent)

                InputView(text: $text) {
                    print("追加: \(text)")
                    withAnimation {
                        tasks.append(text)
                        text = ""
                    }
                }
            }
        }
    }
    return PreviewWrapper()
}
```

**プレビューの説明：**

- **`PreviewWrapper`**: プレビュー用の一時的なビューを作ります
- **`@State var tasks`**: サンプルのタスクリストを用意
- **`ZStack`**: 背景のリストと入力欄を重ねて表示
- **`List`**: タスクのリスト表示
- **`.contentMargins`**: 入力欄の下に隠れないように余白を確保
- **`withAnimation`**: タスク追加時にアニメーションをつける

これで `InputView.swift` が完成しました！🎉

---

## なぜこのような構成にするのか

この入力コンポーネントは、以下の点で工夫されています：

1. **再利用可能な設計**: タスク追加だけでなく、タブ追加など様々な場面で使えます
2. **入力チェック**: 空の入力を防ぐため、ボタンの有効/無効を切り替えます
3. **視覚的なフィードバック**: ボタンの色やサイズが変わることで、操作可能かどうかが分かります
4. **使いやすいUI**: メッセージアプリのような馴染みのあるデザインにしています

---

## 完成したコード全体

<img src="/images/todolist/TaskInputView.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
import SwiftUI

struct InputView: View {
    @Binding var text: String
    let onAdd: () -> Void

    // カスタマイズ可能なプロパティ
    let placeholder: String
    let buttonIcon: String

    // デフォルト値を持つイニシャライザ
    init(
        text: Binding<String>,
        placeholder: String = "新しいタスクを追加...",
        buttonIcon: String = "arrow.up.circle.fill",
        onAdd: @escaping () -> Void
    ) {
        self._text = text
        self.placeholder = placeholder
        self.buttonIcon = buttonIcon
        self.onAdd = onAdd
    }

    // キーボードのフォーカス制御
    @FocusState private var isFocused: Bool

    // 入力値が空でないかどうかの判定（トリミング済み）
    private var isValid: Bool {
        !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    var body: some View {
        HStack(alignment: .bottom, spacing: 12) {
            // MARK: - テキスト入力エリア
            TextField(placeholder, text: $text, axis: .vertical) // axis: .verticalで複数行対応
                .focused($isFocused)
                .padding(.vertical, 10)
                .padding(.horizontal, 16)
                .background(
                    Capsule() // 丸みを帯びた背景
                        .fill(Color(.secondarySystemBackground))
                )
                // キーボードの改行で追加する場合
                .onSubmit {
                    handleSubmit()
                }
                // 送信ボタンのラベル（青い「完了」など）
                .submitLabel(.send)

            // MARK: - 送信ボタン（アイコン化）
            Button(action: handleSubmit) {
                Image(systemName: buttonIcon)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 32, height: 32)
                    // 入力状態に応じて色と透明度を変更
                    .foregroundStyle(isValid ? Color.accentColor : Color(.systemGray4))
                    // 少しアニメーションさせる
                    .scaleEffect(isValid ? 1.0 : 0.9)
                    .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isValid)
            }
            .disabled(!isValid)
            .padding(.bottom, 4) // テキストフィールドとの高さ合わせ
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        // 背景素材（Material）
        .background(.ultraThinMaterial)
        // 上部に境界線を追加（コンテンツとの分離）
        .overlay(alignment: .top) {
            Divider()
        }
    }

    // 追加処理のロジック
    private func handleSubmit() {
        guard isValid else { return }

        onAdd()

        // 追加後も入力を続けたい場合はコメントアウトを外す
        // isFocused = true
    }
}

// MARK: - Preview
#Preview {
    struct PreviewWrapper: View {
        @State var text = ""
        // リスト表示のダミーデータ
        @State var tasks: [String] = ["リストにアイテムを追加できます"]

        var body: some View {
            ZStack(alignment: .bottom) {
                // 背景のリスト部分
                List {
                    ForEach(tasks, id: \.self) { task in
                        Text(task)
                    }
                }
                .contentMargins(.bottom, 80, for: .scrollContent) // 入力欄の下に隠れないように余白確保

                // 入力コンポーネント
                InputView(text: $text) {
                    print("追加: \(text)")
                    withAnimation {
                        tasks.append(text)
                        text = ""
                    }
                }
            }
        }
    }
    return PreviewWrapper()
}
```
