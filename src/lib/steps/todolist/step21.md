# ステップ21: 発展課題（自分で機能を考えてみよう）

ここまでのステップで、基本的なToDoアプリは完成しました。
このステップでは、**「自分で考えて機能を追加する」** という体験をしてみましょう。
プログラミングの上達には、言われた通りのコードを書くだけでなく、「こういう機能が欲しいな」→「どうすれば作れるかな？」と考えるプロセスが不可欠です。

いきなり「自由に作って」と言われても難しいかもしれないので、いくつかアイデアとヒントを用意しました。
どれか1つ（または複数）選んで、挑戦してみてください！

> **注意**: 実装の答え（コード例）は、このページの**一番下**にまとめてあります。
> できるだけ答えを見ずに、ヒントを頼りに自分で考えてみましょう！

---

## アイデア1: 完了したタスクを下に移動する (難易度: ★☆☆)

### 目的

現在は追加順（またはデータ取得順）に並んでいますが、完了したタスクが上にあると邪魔かもしれません。
未完了のタスクを上に、完了したタスクを下に表示するように変更してみましょう。

### 考え方

`loadTasks` メソッドでデータを読み込むとき（または表示するとき）に、リストを **並び替え（ソート）** すれば良さそうです。
Swiftの配列には `sorted` という便利な機能があります。

### ヒント

- `tasks` 配列を更新する直前で並び替えを行います。
- 条件: `!$0.isCompleted && $1.isCompleted` （未完了が先）

👉 **[実装例1へ移動](#solution1)**

---

## アイデア2: タスク検索機能 (難易度: ★★☆)

### 目的

タスクが増えてきたときに、名前で検索できるようにします。

### 考え方

1. 検索ワードを入力する `TextField` が必要です。
2. 入力されたワードを保存する変数（`@State`）が必要です。
3. リストを表示するときに、検索ワードが空でなければ **フィルタリング（絞り込み）** して表示します。

### ヒント

- `TextField("検索", text: $searchText)` を画面上部に追加。
- リストに渡す `items` を、`tasks` そのものではなく、計算プロパティ（Computed Property）経由にするのがスマートです。

👉 **[実装例2へ移動](#solution2)**

---

## アイデア3: タスク削除時の確認アラート (難易度: ★★☆)

### 目的

スワイプ削除でいきなり消えると、間違って消したときに困ります。
「本当に削除しますか？」と確認を出してみましょう。

### 考え方

1. 削除処理（`handleDeleteTask`）が呼ばれたとき、すぐ消すのではなく、「削除対象のタスク」を一時保存し、「アラートを表示するフラグ」をONにします。
2. アラートの「削除」ボタンが押されたら、実際に削除を実行します。

### ヒント

- `@State private var showDeleteAlert = false`
- `@State private var taskToDelete: ToDoTask?`
- `.alert` モディファイアを使います。

👉 **[実装例3へ移動](#solution3)**

---

## その他のアイデア（上級編）

もっと挑戦したい人は、以下のような機能も考えてみてください。

- **期限日の追加**: `ToDoTask` モデルに `dueDate: Date` を追加し、登録画面で `DatePicker` を使う（※モデル変更時はアプリのアンインストールやマイグレーションが必要です）。
- **ダークモード対応**: 配色を調整して、ダークモードでも見やすくする。

失敗しても大丈夫です。うまくいかなくても、どこで詰まったかを考えることが一番の勉強になります。
**「自分の手でアプリが便利になった！」** という感覚を楽しんでください。

<br>
<br>
<br>
<br>
<br>

---

# 実装例（解答コーナー）

ここから先はネタバレになります。自分の力で試した後で確認しましょう。

<a id="solution1"></a>

## 実装例1: 完了したタスクを下に移動

`loadTasks` メソッドの一部を変更します。

```swift
    private func loadTasks() {
        guard let tabId = selectedTabId else {
            tasks = []
            return
        }

        let descriptor = FetchDescriptor<ToDoTask>(
            predicate: #Predicate { $0.tabId == tabId }
        )
        // 取得したタスクを並び替える
        let fetchedTasks = (try? modelContext.fetch(descriptor)) ?? []

        // 未完了(false)を先に、完了(true)を後にする
        tasks = fetchedTasks.sorted { !$0.isCompleted && $1.isCompleted }
    }
```

<a id="solution2"></a>

## 実装例2: タスク検索機能

まず、検索ワード用の変数を追加します。

```swift
    @State private var searchText = ""
```

次に、フィルタリング済みのタスクを返す計算プロパティを作ります。

```swift
    var filteredTasks: [ToDoTask] {
        if searchText.isEmpty {
            return tasks
        } else {
            return tasks.filter { $0.title.localizedStandardContains(searchText) }
        }
    }
```

最後に、`CustomList` に渡すデータを `filteredTasks` に変更し、検索窓も追加します。

```swift
    // bodyの中
    TextField("検索...", text: $searchText)
        .textFieldStyle(.roundedBorder)
        .padding(.horizontal)

    if selectedTabId != nil && !filteredTasks.isEmpty {
        // itemsに filteredTasks を渡す
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

ロジックの変更（既存の `handleDeleteTask` を書き換えるか、新しいメソッドを作ります）:

```swift
    // アラート用State
    @State private var showDeleteAlert = false
    @State private var taskToDelete: ToDoTask?

    // 削除リクエスト（スワイプ時に呼ばれる）
    private func handleDeleteRequest(_ offsets: IndexSet) {
        if let index = offsets.first {
            taskToDelete = tasks[index]
            showDeleteAlert = true
        }
    }

    // 本当の削除実行
    private func confirmDelete() {
        if let task = taskToDelete {
            ToDoTaskService.deleteTask(task, from: modelContext)
            loadTasks()
        }
        taskToDelete = nil
    }
```

View側での修正:

```swift
    // onDelete には requestメソッドを指定
    CustomList(items: tasks, onDelete: handleDeleteRequest)

    // ... CustomListのブロック終わり ...

    // bodyの最後にアラートを追加
    .alert("削除の確認", isPresented: $showDeleteAlert) {
        Button("キャンセル", role: .cancel) { }
        Button("削除", role: .destructive) {
            confirmDelete()
        }
    } message: {
        Text("このタスクを削除してもよろしいですか？")
    }
```
