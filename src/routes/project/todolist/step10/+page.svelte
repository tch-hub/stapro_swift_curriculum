<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ステップ10: UI作成：タスク一覧の見た目を仮データで作る</h1>
	<p class="mb-8 text-lg">
		タスクリストの「行」部分のデザインを作成します。このように、繰り返し使われるUI部品を先に作っておくと、後の作業がとても楽になります。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. TaskRowビューを作成する</h2>
			<p class="mb-4">
				`Components`フォルダの中に、`TaskRow.swift`という名前で新しいSwiftUI Viewファイルを作成します。
			</p>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. TaskRowビューを実装する</h2>
			<p class="mb-4">
				作成した`TaskRow.swift`に、以下のコードを記述します。このビューは、タスク名とチェック状態の2つの情報を受け取って表示します。
			</p>
			<CodeBlock
				title="TaskRow.swift"
				code={`
import SwiftUI

struct TaskRow: View {
    var task: ToDoTask // 表示するタスクのデータ
    var onToggleCompletion: () -> Void // チェックボックスがタップされた時に呼ばれる処理

    var body: some View {
        HStack {
            Button(action: onToggleCompletion) {
                Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                    .resizable()
                    .frame(width: 24, height: 24)
                    .foregroundColor(task.isCompleted ? .green : .gray)
            }
            .buttonStyle(PlainButtonStyle()) // ボタンのデフォルトスタイルを無効化

            Text(task.name)
                .strikethrough(task.isCompleted) // 完了なら取り消し線
                .foregroundColor(task.isCompleted ? .gray : .primary)

            Spacer()
        }
        .padding()
    }
}

#Preview {
    // プレビュー用のダミータスクを作成
    let task1 = ToDoTask(name: "プレビュータスク1")
    let task2 = ToDoTask(name: "プレビュータスク2 (完了)")
    task2.isCompleted = true

    return VStack {
        TaskRow(task: task1, onToggleCompletion: {})
        TaskRow(task: task2, onToggleCompletion: {})
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">3. HomeViewでListを使って表示</h2>
			<p class="mb-4">
				`HomeView.swift`に戻り、`Text("ここにタスクが表示されます")`の部分を`List`に置き換えて、先ほど作った`TaskRow`を仮のデータで表示してみましょう。
			</p>
			<CodeBlock
				title="HomeView.swift (bodyを更新)"
				code={`
    var body: some View {
        VStack {
            if !toDoTabs.isEmpty {
                // ... Pickerの部分は変更なし ...
            }

            // Listを使ってタスク一覧を表示
            List {
                // 仮のタスクデータでTaskRowを表示
                TaskRow(task: ToDoTask(name: "仮タスク1"), onToggleCompletion: {})
                TaskRow(task: ToDoTask(name: "仮タスク2"), onToggleCompletion: {})
            }
            .listStyle(.plain) // リストのスタイルをシンプルに
        }
        .navigationTitle("ホーム")
    }
`}
			/>
		</div>
	</div>

    <div class="mt-12 flex justify-between">
        <a href="../step9" class="btn">前へ</a>
        <a href="../step11" class="btn btn-primary">次へ: タスク表示</a>
    </div>
</div>
