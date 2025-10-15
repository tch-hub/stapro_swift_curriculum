<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">
		ステップ16: 機能追加：タスクをスワイプして「削除」ボタンを表示する
	</h1>
	<p class="mb-8 text-lg">
		iPhoneアプリでよく見かける、リストの項目をスワイプして削除する機能を実装します。SwiftUIの`List`では、この機能が驚くほど簡単に実装できます。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. Listに`.onDelete`モディファイアを追加</h2>
			<p class="mb-4">
				`HomeView.swift`の`List`に、`.onDelete`というモディファイア（修飾子）を追加します。これだけで、`ForEach`で表示している各行がスワイプ可能になります。
			</p>
			<CodeBlock
				title="HomeView.swift (Listを更新)"
				code={`
            List {
                ForEach(filteredTasks) { task in
                    TaskRow(task: task, onToggleCompletion: {
                        toggleCompletion(for: task)
                    })
                }
                .onDelete(perform: deleteTask) // この行を追加
            }
            .listStyle(.plain)
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. 削除処理メソッドの仮実装</h2>
			<p class="mb-4">
				`.onDelete`が呼び出す`deleteTask`メソッドを`HomeView`に作成します。`IndexSet`は、スワイプされた行が「何番目か」という情報を持っています。
			</p>
			<CodeBlock
				title="HomeView.swift (メソッド追加)"
				code={`
    /// タスクを削除する（UIからの呼び出し）
    private func deleteTask(at offsets: IndexSet) {
        // offsetsには削除したい行のインデックス（番号）が入っている
        // ForEachのfilteredTasksから、該当するタスクを見つけ出す
        let tasksToDelete = offsets.map { filteredTasks[$0] }

        // 実際の削除処理は次のステップ
        print("削除対象のタスク: \\(tasksToDelete.map { $0.name })")
    }
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">コードの解説</h2>
			<ul class="mb-4 list-inside list-disc space-y-2 rounded-md bg-base-200 p-4">
				<li>
					<strong>`.onDelete(perform: deleteTask)`:</strong> `List`内の`ForEach`に対してこのモディファイアを追加すると、各行がスワイプ可能になります。スワイプ後に「削除」ボタンがタップされると、`perform`で指定した`deleteTask`メソッドが呼び出されます。
				</li>
				<li>
					<strong>`at offsets: IndexSet`:</strong> `.onDelete`から呼び出されるメソッドは、必ずこの引数を受け取ります。`IndexSet`は、どの行が削除対象として選ばれたかの情報（インデックスの集まり）です。
				</li>
				<li>
					<strong>`offsets.map {filteredTasks[$0]}`:</strong> `filteredTasks`（画面に表示されているタスクの配列）の中から、スワイプされた行のインデックスに該当する`ToDoTask`オブジェクトを取り出しています。
				</li>
			</ul>
			<p>
				これでUIの準備は完了です。アプリを実行し、タスクの行を左にスワイプすると「削除」ボタンが表示されることを確認してください。
			</p>
		</div>
	</div>

	<div class="mt-12 flex justify-between">
		<a href="../step15" class="btn">前へ</a>
		<a href="../step17" class="btn btn-primary">次へ: タスクのデータ削除</a>
	</div>
</div>
