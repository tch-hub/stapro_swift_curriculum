<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ステップ13: 機能追加：入力した新しいタスクを保存する</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/todolist/step12" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/todolist/step14" class="btn btn-primary">次のステップ →</a>
	</div>

	<p class="mb-8 text-lg">
		UI（見た目）とロジック（機能）を結びつけます。ユーザーが入力したタスク名を、`ToDoTaskService`を使ってデータベースに保存し、リストに新しいタスクが即座に表示されるようにします。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. ToDoTaskServiceに`add`メソッドを実装</h2>
			<p class="mb-4">
				まず、`ToDoTaskService.swift`に、新しいタスクを追加するための具体的な処理を書きます。どのタブに所属するタスクかも分かるように、`tabId`も引数で受け取ります。
			</p>
			<CodeBlock
				title="ToDoTaskService.swift (更新)"
				code={`
import Foundation
import SwiftData

@MainActor
class ToDoTaskService {
    private let modelContext: ModelContext
    // ... init() ...

    /// タスクを追加する
    func add(name: String, tabId: UUID) throws {
        // 関連づけるタブを取得
        let fetchDescriptor = FetchDescriptor<ToDoTab>(predicate: #Predicate { $0.id == tabId })
        guard let toDoTab = try modelContext.fetch(fetchDescriptor).first else {
            // タブが見つからなかった場合はエラー
            throw NSError(domain: "ToDoAppError", code: 1, userInfo: [NSLocalizedDescriptionKey: "指定されたタブが見つかりません"])
        }

        // 新しいタスクを作成
        let newTask = ToDoTask(name: name)
        newTask.todoTab = toDoTab // タスクをタブに関連付け

        modelContext.insert(newTask) // データベースへの追加を予約
        try modelContext.save() // 変更を保存
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. HomeViewからServiceを呼び出す</h2>
			<p class="mb-4">
				`HomeView.swift`で、`AddTaskView`の`onAdd`クロージャの中から、今作った`ToDoTaskService`の`add`メソッドを呼び出します。
			</p>
			<CodeBlock
				title="HomeView.swift (更新)"
				code={`
struct HomeView: View {
    // ... @Query, @Stateなど ...
    private let todoTaskService = ToDoTaskService() // Serviceのインスタンスを作成

    var body: some View {
        // ... ZStack, Buttonなど ...
        .sheet(isPresented: $isAddTaskPresented) {
            AddTaskView(
                onAdd: { name in
                    addTask(name: name) // 新しいメソッドを呼び出す
                    isAddTaskPresented = false
                },
                onCancel: {
                    isAddTaskPresented = false
                }
            )
        }
    }

    /// タスクを追加するプライベートメソッド
    private func addTask(name: String) {
        // 現在選択されているタブを取得
        guard toDoTabs.indices.contains(selectedTabIndex) else { return }
        let selectedTab = toDoTabs[selectedTabIndex]

        do {
            try todoTaskService.add(name: name, tabId: selectedTab.id)
        } catch {
            // エラーハンドリング（今回はシンプルにprint）
            print("タスクの追加に失敗しました: \\(error)")
        }
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">動作を確認しよう</h2>
			<p>
				これで、アプリを実行（またはプレビュー）し、「＋」ボタンから新しいタスクを追加すると、リストに即座に反映されるようになります。SwiftUIとSwiftDataが連携し、データが更新されると自動的にUIも更新される様子が確認できます。
			</p>
		</div>
	</div>

	<div class="mt-12 flex justify-between">
		<a href="../step12" class="btn">前へ</a>
		<a href="../step14" class="btn btn-primary">次へ: 完了機能UI</a>
	</div>
</div>
