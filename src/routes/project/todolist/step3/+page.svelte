<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ステップ3: データ設計① ToDoタスクの情報を考えよう</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/todolist/step2" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/todolist/step4" class="btn btn-primary">次のステップ →</a>
	</div>

	<p class="mb-8 text-lg">
		アプリで扱うデータの「設計図」を作ります。まずは、一つ一つのタスクがどんな情報を持つべきかを考え、SwiftDataのモデルとして定義しましょう。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. SwiftDataとは？</h2>
			<p class="mb-4">
				SwiftDataは、アプリのデータを簡単に保存、読み込み、管理するための仕組みです。これを使うことで、ユーザーが入力したタスクをアプリを閉じても消えないようにできます。
			</p>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. 新しいファイルを作成する</h2>
			<p class="mb-4">
				Xcodeのファイルナビゲータで、前回作成した`SwiftData`フォルダを右クリックし、「New
				File...」を選択します。テンプレートは「Swift
				File」を選び、ファイル名を`ToDoTask.swift`として作成してください。
			</p>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">3. ToDoTaskモデルを定義する</h2>
			<p class="mb-4">
				作成した`ToDoTask.swift`に、以下のコードを記述します。これがタスクの設計図になります。
			</p>
			<CodeBlock
				title="ToDoTask.swift"
				code={`
import Foundation
import SwiftData

/// ToDoタスクモデル
@Model
class ToDoTask {
    var id: UUID = UUID() // タスクを区別するためのユニークなID
    var name: String = "" // タスク名
    var isCompleted: Bool = false // タスクが完了したかどうか
    var createdAt: Date = Date() // 作成日時

    init(name: String) {
        self.name = name
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">コードの解説</h2>
			<ul class="mb-4 list-inside list-disc space-y-2 rounded-md bg-base-200 p-4">
				<li>
					<strong>@Model:</strong> このクラスがSwiftDataで管理されるデータモデルであることを示す目印です。
				</li>
				<li><strong>class ToDoTask:</strong> `ToDoTask`という名前の設計図を定義しています。</li>
				<li><strong>var id: UUID:</strong> タスク一つ一つを区別するための、重複しないIDです。</li>
				<li>
					<strong>var name: String:</strong> ユーザーが入力するタスクの内容（例：「牛乳を買う」）です。
				</li>
				<li>
					<strong>var isCompleted: Bool:</strong> タスクが完了したか（true）、まだか（false）を保存します。
				</li>
				<li><strong>var createdAt: Date:</strong> タスクがいつ作られたかを記録します。</li>
			</ul>
			<p>これで、アプリが「タスク」という情報をどのように扱うかが決まりました。</p>
		</div>
	</div>

	<div class="mt-12 flex justify-between">
		<a href="../step2" class="btn">前へ</a>
		<a href="../step4" class="btn btn-primary">次へ: データ設計②</a>
	</div>
</div>
