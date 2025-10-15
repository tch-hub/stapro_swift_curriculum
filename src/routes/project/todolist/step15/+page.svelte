<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ステップ15: 機能追加：チェックボックスの状態をデータに保存する</h1>
	<p class="mb-8 text-lg">
		見た目の変更を、実際のデータに反映させます。チェックボックスタップ時に`ToDoTaskService`を呼び出し、タスクの完了状態（`isCompleted`）を`true`と`false`で切り替える処理を実装します。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. ToDoTaskServiceに`toggleCompletion`メソッドを実装</h2>
			<p class="mb-4">
				`ToDoTaskService.swift`に、指定されたタスクの`isCompleted`プロパティを反転させる（`true`なら`false`に、`false`なら`true`にする）メソッドを追加します。
			</p>
			<CodeBlock
				title="ToDoTaskService.swift (メソッド追加)"
				code={`
    /// タスクの完了フラグを反転させる
    func toggleCompletion(task: ToDoTask) throws {
        // isCompletedの値を反転させる
        task.isCompleted.toggle()

        // 変更を保存
        try modelContext.save()
    }
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. HomeViewからServiceを呼び出す</h2>
			<p class="mb-4">
				`HomeView.swift`の`List`内で`TaskRow`を呼び出している部分を更新します。`onToggleCompletion`クロージャの中から、`ToDoTaskService`の`toggleCompletion`メソッドを呼び出します。
			</p>
			<CodeBlock
				title="HomeView.swift (List内を更新)"
				code={`
            List {
                ForEach(filteredTasks) { task in
                    TaskRow(task: task, onToggleCompletion: {
                        toggleCompletion(for: task)
                    })
                }
            }
`}
			/>
			<p class="mt-4">
				`HomeView`に、`toggleCompletion`を呼び出すためのプライベートメソッドも追加します。
			</p>
			<CodeBlock
				title="HomeView.swift (メソッド追加)"
				code={`
    /// タスクの完了状態を切り替える
    private func toggleCompletion(for task: ToDoTask) {
        do {
            try todoTaskService.toggleCompletion(task: task)
        } catch {
            print("タスクの更新に失敗しました: \\(error)")
        }
    }
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">動作を確認しよう</h2>
			<p>
				アプリを再度実行し、タスクのチェックボックスをタップしてみましょう。チェックの状態が変わり、取り消し線が引かれるはずです。SwiftDataが変更を保存しているので、一度アプリを終了して再起動しても、チェックの状態は保たれます。
			</p>
		</div>
	</div>

    <div class="mt-12 flex justify-between">
        <a href="../step14" class="btn">前へ</a>
        <a href="../step16" class="btn btn-primary">次へ: スワイプ削除UI</a>
    </div>
</div>
