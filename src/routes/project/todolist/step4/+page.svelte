<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ステップ4: データ設計② タスクを分類する「タブ」を作ろう</h1>
	<p class="mb-8 text-lg">
		タスクが増えてくると、「勉強」や「買い物」のように分類したくなります。その分類の役割を持つのが「タブ」です。ここでは`ToDoTab`モデルを新しく作り、`ToDoTask`と関連付けます。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. ToDoTabモデルのファイルを作成</h2>
			<p class="mb-4">
				ステップ3と同じ手順で、`SwiftData`フォルダの中に`ToDoTab.swift`という名前の新しいSwiftファイルを作成します。
			</p>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. ToDoTabモデルを定義する</h2>
			<p class="mb-4">
				作成した`ToDoTab.swift`に、以下のコードを記述します。
			</p>
			<CodeBlock
				title="ToDoTab.swift"
				code={`
import Foundation
import SwiftData

/// ToDoタブモデル
@Model
class ToDoTab {
    var id: UUID = UUID()
    var name: String = ""
    var createdAt: Date = Date()

    // ToDoTaskとのリレーションシップ (1対多)
    @Relationship(inverse: \\ToDoTask.todoTab)
    var todoTasks: [ToDoTask]?

    init(name: String) {
        self.name = name
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">3. ToDoTaskモデルを更新して関連付け</h2>
			<p class="mb-4">
				次に、`ToDoTask`が「どのタブに所属しているか」を記録できるように、`ToDoTask.swift`を更新します。
			</p>
			<CodeBlock
				title="ToDoTask.swift (更新後)"
				code={`
import Foundation
import SwiftData

@Model
class ToDoTask {
    var id: UUID = UUID()
    var name: String = ""
    var isCompleted: Bool = false
    var createdAt: Date = Date()

    // ToDoTabとのリレーションシップ (多対1)
    var todoTab: ToDoTab?

    init(name: String) {
        self.name = name
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">コードの解説：リレーションシップ</h2>
			<p class="mb-4">
				`ToDoTab`と`ToDoTask`の間には、「1つのタブにたくさんのタスクが含まれる」という「1対多」の関係があります。SwiftDataでは、これをお互いのプロパティとして定義することで表現します。
			</p>
			<ul class="mb-4 list-inside list-disc space-y-2 bg-base-200 p-4 rounded-md">
				<li><strong>`ToDoTab`の`todoTasks: [ToDoTask]?`</strong>: 1つのタブが、複数のタスク(`ToDoTask`の配列`[]`)を持つことを示します。`?`は「タスクがまだ一つもない場合もある」という意味です。</li>
				<li><strong>`ToDoTask`の`todoTab: ToDoTab?`</strong>: 1つのタスクが、1つのタブに所属することを示します。</li>
				<li><strong>@Relationship(inverse: ...):</strong> SwiftDataに「この`todoTasks`は、`ToDoTask`側の`todoTab`プロパティとペアですよ」と教えてあげるための重要な目印です。これがないと、データがうまく繋がりません。</li>
			</ul>
			<p>
				これで、タスクをタブで分類するためのデータ設計が完了しました。
			</p>
		</div>
	</div>

    <div class="mt-12 flex justify-between">
        <a href="../step3" class="btn">前へ</a>
        <a href="../step5" class="btn btn-primary">次へ: Serviceクラス作成①</a>
    </div>
</div>
