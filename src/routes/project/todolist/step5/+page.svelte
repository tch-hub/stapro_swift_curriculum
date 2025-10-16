<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ステップ5: データ操作の準備：ToDoTaskServiceクラスを作る</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/todolist/step4" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/todolist/step6" class="btn btn-primary">次のステップ →</a>
	</div>

	<p class="mb-8 text-lg">
		データモデル（設計図）を作っただけでは、データはただの箱です。次はその箱にデータを入れたり、出したり、捨てたりする「係員」を作ります。それがサービスクラスです。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. サービスクラスとは？</h2>
			<p class="mb-4">
				サービスクラスは、データの具体的な操作ロジック（ビジネスロジック）を担当する場所です。「新しいタスクを追加する」「完了したタスクを探す」といったアプリの「機能」のプログラムをここにまとめて書きます。
			</p>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. SwiftDataServiceを作成する</h2>
			<p class="mb-4">
				まず、データベース接続の土台となる`SwiftDataService`を作成します。これはアプリ全体で一つのインスタンスを共有するシングルトンとして設計します。`SwiftData`フォルダの中に`Services`というサブフォルダを作り、その中に`SwiftDataService.swift`ファイルを作成してください。
			</p>
			<CodeBlock
				title="SwiftDataService.swift"
				code={`
import SwiftData
import SwiftUI

@MainActor
class SwiftDataService {
    static let shared = SwiftDataService()
    let modelContainer: ModelContainer

    private init() {
        do {
            let schema = Schema([ToDoTab.self, ToDoTask.self])
            let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
            modelContainer = try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \\(error)")
        }
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">3. ToDoTaskServiceファイルを作成</h2>
			<p class="mb-4">
				次に、`Services`フォルダの中に`ToDoTaskService.swift`という名前で新しいSwiftファイルを作成します。
			</p>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">4. ToDoTaskServiceを実装する</h2>
			<p class="mb-4">作成した`ToDoTaskService.swift`に、以下のコードを記述します。</p>
			<CodeBlock
				title="ToDoTaskService.swift"
				code={`
import Foundation
import SwiftData

/// ToDoタスクサービス
@MainActor
class ToDoTaskService {
    private let modelContext: ModelContext

    init() {
        self.modelContext = SwiftDataService.shared.modelContainer.mainContext
    }

    // ここにタスクを操作するメソッド（関数）を追加していく
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">コードの解説</h2>
			<ul class="mb-4 list-inside list-disc space-y-2 rounded-md bg-base-200 p-4">
				<li>
					<strong>@MainActor:</strong> UIの更新に関わる可能性のあるコードであることを示します。SwiftUIではおまじないのようなものです。
				</li>
				<li>
					<strong>private let modelContext:</strong> SwiftDataでデータを操作するための「作業場」のようなものです。これを通じてデータの読み書きを行います。
				</li>
				<li>
					<strong>init():</strong> このクラスが作られた時に最初に呼ばれる部分です。`SwiftDataService`から`modelContext`を受け取り、作業の準備をします。
				</li>
			</ul>
			<p>
				これでタスクを操作するための準備ができました。次のステップでは、タブを操作する`ToDoTabService`も同様に作成します。
			</p>
		</div>
	</div>

	<div class="mt-12 flex justify-between">
		<a href="../step4" class="btn">前へ</a>
		<a href="../step6" class="btn btn-primary">次へ: Serviceクラス作成②</a>
	</div>
</div>
