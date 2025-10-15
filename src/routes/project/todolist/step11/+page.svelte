<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ステップ11: データ連携：選択したタブに対応するタスクを一覧表示する</h1>
	<p class="mb-8 text-lg">
		いよいよホーム画面のメイン機能です。UI（`List`と`TaskRow`）とデータ（`ToDoTask`）を結びつけ、選択されたタブに所属するタスクだけを絞り込んで表示します。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. 全てのタスクを取得する</h2>
			<p class="mb-4">
				まず、`HomeView`で`@Query`を使って、`ToDoTask`の全データを取得できるようにします。
			</p>
			<CodeBlock
				title="HomeView.swift (更新)"
				code={`
import SwiftUI
import SwiftData

struct HomeView: View {
    @Query(sort: \\ToDoTab.createdAt) private var toDoTabs: [ToDoTab]
    @Query(sort: \\ToDoTask.createdAt) private var toDoTasks: [ToDoTask] // ToDoTaskも取得
    @State private var selectedTabIndex = 0

    // ... bodyは後で更新 ...
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. 選択中のタブに応じてタスクを絞り込む</h2>
			<p class="mb-4">
				`body`の中で、`toDoTasks`の中から現在選択されているタブ(`selectedTabIndex`)に所属するタスクだけを抜き出す処理を追加します。
			</p>
			<CodeBlock
				title="HomeView.swift (bodyを更新)"
				code={`
    var body: some View {
        VStack {
            if !toDoTabs.isEmpty {
                // ... Pickerの部分は変更なし ...
            }

            // 選択中のタブIDを取得
            let selectedTabId = toDoTabs.indices.contains(selectedTabIndex) ? toDoTabs[selectedTabIndex].id : nil
            // タスクを絞り込む
            let filteredTasks = toDoTasks.filter { $0.todoTab?.id == selectedTabId }

            List {
                // 絞り込んだタスクを一覧表示
                ForEach(filteredTasks) { task in
                    TaskRow(task: task, onToggleCompletion: {
                        // タスクの完了状態を切り替える処理（後のステップで実装）
                    })
                }
            }
            .listStyle(.plain)
        }
        .navigationTitle("ホーム")
    }
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">3. プレビュー用のダミータスクを追加</h2>
			<p class="mb-4">
				`#Preview`ブロックを更新して、ダミーのタブに紐づくダミーのタスクを作成します。これで、プレビュー画面でも実際の表示に近い形で確認できます。
			</p>
			<CodeBlock
				title="HomeView.swift (#Previewを更新)"
				code={`
#Preview {
    let container = try! ModelContainer(for: ToDoTab.self, ToDoTask.self, inMemory: true)

    // ダミーデータ作成
    let tab1 = ToDoTab(name: "勉強")
    container.mainContext.insert(tab1)
    let task1 = ToDoTask(name: "SwiftUIの課題")
    task1.todoTab = tab1 // タスクをタブに関連付ける
    container.mainContext.insert(task1)

    let tab2 = ToDoTab(name: "買い物")
    container.mainContext.insert(tab2)
    let task2 = ToDoTask(name: "牛乳を買う")
    task2.todoTab = tab2
    container.mainContext.insert(task2)

    return NavigationStack {
        HomeView()
            .modelContainer(container)
    }
}
`}
			/>
			<p class="mt-4">
				プレビューを更新すると、タブを切り替えることで表示されるタスクが変わることが確認できます。
			</p>
		</div>
	</div>

    <div class="mt-12 flex justify-between">
        <a href="../step10" class="btn">前へ</a>
        <a href="../step12" class="btn btn-primary">次へ: タスク追加UI</a>
    </div>
</div>
