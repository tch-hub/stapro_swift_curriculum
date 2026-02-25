# ステップ21: 発展課題（自分で機能を考えてみよう）

ここまでのステップで、基本的なToDoアプリは完成しました！
このステップでは、**「自分で考えて機能を追加する」** というプログラミングの醍醐味を体験してみましょう。

プログラミングの上達には、説明された通りのコードを書くだけでなく、「こういう機能が欲しいな」→「どうすれば作れるかな？」と自ら考えるプロセスが不可欠です。

いきなり「自由に作って」と言われても難しいかもしれないので、いくつかアイデアとヒントを用意しました。
どれか1つ（または複数）選んで、挑戦してみてください。

> **注意**: 実装の答え（コード例）は、このページの**一番下**にまとめてあります。
> できるだけ答えを見ずに、ヒントを頼りに自分で考えてみましょう！

---

## アイデア1: 完了したタスクを下に移動する (難易度: ★☆☆)

### 目的

現在は追加された順（またはデータベースからの取得順）に並んでいますが、完了したタスクが上に残っていると邪魔に感じるかもしれません。
未完了のタスクを上に、完了したタスクを下に表示するように変更してみましょう。

### 考え方

`loadTasks` メソッドでデータを読み込むとき（または画面に表示するとき）に、リストを **並び替え（ソート）** すれば良さそうです。
Swiftの配列には `sorted` というデータを並び替える便利な機能があります。

### ヒント

- `tasks` 配列を更新する直前で並び替えを行います。
- 条件: `!$0.isCompleted && $1.isCompleted` （未完了が先という意味になります）

👉 **[実装例1へ移動](#solution1)**

---

## アイデア2: タスク検索機能 (難易度: ★★☆)

### 目的

タスクが増えてきたときに、タスクの名前で検索できるようにします。

### 考え方

1. 検索ワードを入力する `TextField` が必要です。
2. 入力された検索ワードを一時的に保存しておく変数（`@State`）が必要です。
3. リストを画面に表示するときに、検索ワードが空でなければ **フィルタリング（条件に合うものだけの絞り込み）** をして表示します。

### ヒント

- `TextField("検索", text: $searchText)` を画面の上部付近に追加します。
- `CustomList` に渡すタスク一覧（`items`）を、`tasks` そのままではなく、計算によって絞り込んだ結果を返すプロパティ（Computed Property）を経由させるとスマートです。

👉 **[実装例2へ移動](#solution2)**

---

## アイデア3: タスク削除時の確認アラート (難易度: ★★☆)

### 目的

現在のスワイプ削除ではいきなりデータが消えてしまうため、間違ってスワイプしたときに困ります。
「本当に削除しますか？」という確認メッセージ（アラート）を出してみましょう。

### 考え方

1. 削除処理（`handleDeleteTask`）が呼ばれたとき、すぐに削除を実行するのではなく、「削除対象のタスク」を一時保存し、「アラートを表示するためのスイッチ」をONにします。
2. アラート画面の「削除」ボタンが押されたら、実際にデータベースからの削除を実行します。

### ヒント

- `@State private var showDeleteAlert = false` （画面を表示するかどうかのスイッチ）
- `@State private var taskToDelete: ToDoTask?` （削除予定のタスクを一時保存する変数）
- `.alert` モディファイアを使って画面にアラートを表示します。

👉 **[実装例3へ移動](#solution3)**

---

## その他のアイデア（上級編）

もっと挑戦したい人は、以下のような機能も考えてみてください。

- **期限日の追加**: `ToDoTask` のデータモデルに `dueDate: Date` を追加し、登録画面で `DatePicker`（日付選択カレンダー）を使うようにする（※データモデルの変更時は、シミュレーターから一度アプリを削除するなどの対応が必要です）。
- **ダークモード対応**: 背景や文字の配色を調整して、iPhoneのダークモード設定でも見やすくする。

失敗しても全く問題ありません。うまくいかなくても、「どこで詰まったか」を考えることが一番の勉強になります。
**「自分の手でアプリがもっと便利になった！」** というプログラミングの楽しさをぜひ味わってください。

<br>
<br>
<br>
<br>
<br>
<br>

---

# 実装例（解答コーナー）

ここから先はネタバレになります。まずは自分の力で試した後で確認しましょう！

<a id="solution1"></a>

## 実装例1: 完了したタスクを下に移動

`loadTasks` メソッドの一部を変更します。

```swift title="Views/HomeView.swift"
    private func loadTasks() {
        guard let tabId = selectedTabId else {
            tasks = []
            return
        }

        let descriptor = FetchDescriptor<ToDoTask>(
            predicate: #Predicate { $0.tabId == tabId }
        )
        // 取得したタスクをまずは定数に入れる
        let fetchedTasks = (try? modelContext.fetch(descriptor)) ?? []

        // 未完了(isCompletedがfalse)を先に、完了(true)を後になるよう並び替えてから tasks に入れる
        tasks = fetchedTasks.sorted { !$0.isCompleted && $1.isCompleted }
    }
```

<a id="solution2"></a>

## 実装例2: タスク検索機能

まず、検索ワードを保存するための変数を追加します。

```swift title="Views/HomeView.swift"
    @State private var searchText = ""
```

次に、検索ワードに応じてフィルタリング（絞り込み）されたタスクのリストを返す計算プロパティを作ります。

```swift title="Views/HomeView.swift"
    var filteredTasks: [ToDoTask] {
        if searchText.isEmpty {
            // 検索ワードが空なら全て表示
            return tasks
        } else {
            // 文字が含まれているものだけを残す
            return tasks.filter { $0.title.localizedStandardContains(searchText) }
        }
    }
```

最後に、画面部分（`body`）に検索窓を追加し、リストに渡すデータを `filteredTasks` に変更します。

```swift title="Views/HomeView.swift"
    // bodyの中、タブヘッダーの下あたりに追加
    TextField("検索...", text: $searchText)
        .textFieldStyle(.roundedBorder)
        .padding(.horizontal)

    // リストの表示条件と渡すデータを filteredTasks に変更する
    if selectedTabId != nil && !filteredTasks.isEmpty {
        CustomList(items: filteredTasks, onDelete: handleDeleteTask) { task in
            ToDoListItem(
                title: task.title,
                isCompleted: task.isCompleted
            ) {
                toggleTaskCompletion(task)
            }
        }
    }
```

<a id="solution3"></a>

## 実装例3: タスク削除時の確認アラート

削除する仕組み（ロジック）を変更します。既存の `handleDeleteTask` を書き換えるか、新しいメソッドを作ります。

```swift title="Views/HomeView.swift"
    // アラート表示用のスイッチと一時保存用の変数
    @State private var showDeleteAlert = false
    @State private var taskToDelete: ToDoTask?

    // スワイプ時に呼ばれる新しい削除リクエストメソッド
    private func handleDeleteRequest(_ offsets: IndexSet) {
        if let index = offsets.first {
            // 削除対象を一時保存してアラートを表示する
            taskToDelete = tasks[index]
            showDeleteAlert = true
        }
    }

    // アラートで「削除」が押された時の本当の削除実行メソッド
    private func confirmDelete() {
        if let task = taskToDelete {
            ToDoTaskService.deleteTask(task, from: modelContext)
            loadTasks()
        }
        // 使い終わったら一時保存を空に戻す
        taskToDelete = nil
    }
```

画面（View）側の修正です。スワイプ時の動作の変更と、アラートの追加を行います。

```swift title="Views/HomeView.swift"
    // onDelete には新しく作った requestメソッドを指定する
    CustomList(items: tasks, onDelete: handleDeleteRequest) { task in 
        // ...
    }

    // ---------- CustomListのブロック終わり ----------

    // bodyの一番最後の部分などにアラートの設定を追加する
    .alert("削除の確認", isPresented: $showDeleteAlert) {
        Button("キャンセル", role: .cancel) { }
        Button("削除", role: .destructive) {
            confirmDelete() // 本当の削除処理を実行
        }
    } message: {
        Text("このタスクを削除してもよろしいですか？")
    }
```

これで全てのステップが完了です！改めてお疲れ様でした！
