<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">
		ステップ17: 機能追加：「削除」ボタンでタスクをデータから消す
	</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/todolist/step16" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/todolist/step18" class="btn btn-primary">次のステップ →</a>
	</div>

	<p class="mb-8 text-lg">
		いよいよ削除機能の完成です。ユーザーがスワイプして「削除」をタップしたタスクを、`ToDoTaskService`を通じてデータベースから完全に消去します。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. ToDoTaskServiceに`delete`メソッドを実装</h2>
			<p class="mb-4">
				`ToDoTaskService.swift`に、指定された`ToDoTask`オブジェクトをデータベースから削除するメソッドを追加します。
			</p>
			<CodeBlock
				title="ToDoTaskService.swift (メソッド追加)"
				code={`
    /// タスクを削除する
    func delete(task: ToDoTask) throws {
        modelContext.delete(task)
        try modelContext.save()
    }
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. HomeViewの`deleteTask`メソッドを更新</h2>
			<p class="mb-4">
				`HomeView.swift`の`deleteTask(at offsets:
				IndexSet)`メソッドを更新し、`ToDoTaskService`の`delete`メソッドを呼び出すように変更します。複数のタスクが同時に削除される可能性も考慮して、ループ処理を入れています。
			</p>
			<CodeBlock
				title="HomeView.swift (メソッド更新)"
				code={`
    /// タスクを削除する
    private func deleteTask(at offsets: IndexSet) {
        let tasksToDelete = offsets.map { filteredTasks[$0] }

        tasksToDelete.forEach { task in
            do {
                try todoTaskService.delete(task: task)
            } catch {
                print("タスクの削除に失敗しました: \\(error)")
            }
        }
    }
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">動作を確認しよう</h2>
			<p>これでタスクのCRUD（作成・読み取り・更新・削除）機能がすべて実装できました！</p>
			<p>
				アプリを実行し、タスクをスワイプして削除すると、リストから消え、アプリを再起動してもそのタスクは表示されないはずです。これにより、データの永続的な削除が機能していることが確認できます。
			</p>
		</div>
	</div>

	<div class="mt-12 flex justify-between">
		<a href="../step16" class="btn">前へ</a>
		<a href="../step18" class="btn btn-primary">次へ: タブ管理画面作成</a>
	</div>
</div>
