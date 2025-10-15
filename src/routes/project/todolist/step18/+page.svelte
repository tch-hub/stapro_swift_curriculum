<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ステップ18: 新画面作成：タブを管理するための画面を作る</h1>
	<p class="mb-8 text-lg">
		新しい画面の作成に挑戦します。ここでは、タブ（カテゴリ）を管理（追加・編集・削除）するための専用画面`TabManageView`を作ります。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. TabManageViewファイルを作成</h2>
			<p class="mb-4">
				`Screens/Views/Main`フォルダの中に、`TabManageView.swift`という名前で新しいSwiftUI Viewファイルを作成します。
			</p>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. TabManageViewのUIを実装</h2>
			<p class="mb-4">
				作成した`TabManageView.swift`に、以下のコードを記述します。`HomeView`と同様に`@Query`でタブのリストを取得し、`List`で一覧表示します。ナビゲーションバーの右上に「＋」ボタンも配置します。
			</p>
			<CodeBlock
				title="TabManageView.swift"
				code={`
import SwiftUI
import SwiftData

struct TabManageView: View {
    @Query(sort: \\ToDoTab.createdAt) private var toDoTabs: [ToDoTab]

    var body: some View {
        List {
            ForEach(toDoTabs) { tab in
                Text(tab.name)
            }
        }
        .navigationTitle("タブ管理")
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button(action: {
                    // タブ追加ボタンの処理（後で実装）
                }) {
                    Image(systemName: "plus")
                }
            }
        }
    }
}

#Preview {
    // プレビュー用にダミーデータを設定
    let container = try! ModelContainer(for: ToDoTab.self, inMemory: true)
    let tabs = [ToDoTab(name: "勉強"), ToDoTab(name: "買い物")]
    tabs.forEach { container.mainContext.insert($0) }

    return NavigationStack {
        TabManageView()
            .modelContainer(container)
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">コードの解説</h2>
			<ul class="mb-4 list-inside list-disc space-y-2 bg-base-200 p-4 rounded-md">
				<li><strong>`@Query(...) private var toDoTabs: [ToDoTab]`</strong>: `HomeView`と同じように、このビューもSwiftDataに保存されている全ての`ToDoTab`データを取得します。</li>
				<li><strong>`List { ForEach(...) }`</strong>: 取得した`toDoTabs`のリストを元に、各タブの名前を`Text`で表示します。</li>
				<li><strong>`.toolbar { ... }`</strong>: ナビゲーションバーにボタンなどのアイテムを追加するためのモディファイアです。ここでは右端(`navigationBarTrailing`)に「＋」アイコンの`Button`を配置しています。</li>
			</ul>
			<p>
				これでタブ管理画面の基本的な見た目が完成しました。次のステップでは、この画面に移動するためのボタンをホーム画面に追加します。
			</p>
		</div>
	</div>

    <div class="mt-12 flex justify-between">
        <a href="../step17" class="btn">前へ</a>
        <a href="../step19" class="btn btn-primary">次へ: 画面遷移</a>
    </div>
</div>
