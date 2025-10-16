<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ステップ6: データ操作の準備：ToDoTabServiceクラスを作る</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/todolist/step5" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/todolist/step7" class="btn btn-primary">次のステップ →</a>
	</div>

	<p class="mb-8 text-lg">
		タスクの係員（`ToDoTaskService`）の次は、タブを管理する係員（`ToDoTabService`）を作りましょう。役割ごとに係員を分けることで、プログラムがより分かりやすくなります。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. ToDoTabServiceファイルを作成</h2>
			<p class="mb-4">
				`Services`フォルダの中に`ToDoTabService.swift`という名前で新しいSwiftファイルを作成します。
			</p>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. ToDoTabServiceを実装する</h2>
			<p class="mb-4">
				作成した`ToDoTabService.swift`に、以下のコードを記述します。`ToDoTaskService`とほとんど同じ構造ですね。
			</p>
			<CodeBlock
				title="ToDoTabService.swift"
				code={`
import Foundation
import SwiftData

/// ToDoタブサービス
@MainActor
class ToDoTabService {
    private let modelContext: ModelContext

    init() {
        self.modelContext = SwiftDataService.shared.modelContainer.mainContext
    }

    // ここにタブを操作するメソッド（関数）を追加していく
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">準備完了！</h2>
			<p>
				これで、データを扱うための設計図（モデル）と、それを操作する係員（サービス）が揃いました。
				次のパートからは、いよいよユーザーが見て、触る部分、つまり「画面（UI）」の作成に入っていきます。
			</p>
		</div>
	</div>

	<div class="mt-12 flex justify-between">
		<a href="../step5" class="btn">前へ</a>
		<a href="../step7" class="btn btn-primary">次へ: アプリの骨組み</a>
	</div>
</div>
