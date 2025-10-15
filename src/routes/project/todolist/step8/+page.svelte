<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">
		ステップ8: UI作成：タブを切り替えるためのピッカーを配置する
	</h1>
	<p class="mb-8 text-lg">
		ホーム画面に、作成したタブを切り替えるための選択肢（ピッカー）を配置します。まずは見た目から作り、データを表示する準備をします。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. @Queryを使ってデータを取得する</h2>
			<p class="mb-4">
				SwiftUIのビューでSwiftDataのデータを表示するには、`@Query`という特別な目印を使います。`HomeView.swift`を更新して、保存されている`ToDoTab`のリストを取得できるようにしましょう。
			</p>
			<CodeBlock
				title="HomeView.swift (更新)"
				code={`
import SwiftUI
import SwiftData // SwiftDataをインポート

struct HomeView: View {
    // @Queryを使ってToDoTabの全データを取得し、createdAt（作成日）で並び替え
    @Query(sort: \\ToDoTab.createdAt) private var toDoTabs: [ToDoTab]

    var body: some View {
        Text("ホーム画面")
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. Pickerを配置する</h2>
			<p class="mb-4">
				`Picker`は、複数の選択肢から一つを選ぶためのUI部品です。これを`VStack`と組み合わせて、画面の上部にタブ選択用のUIを配置します。
			</p>
			<CodeBlock
				title="HomeView.swift (更新)"
				code={`
import SwiftUI
import SwiftData

struct HomeView: View {
    @Query(sort: \\ToDoTab.createdAt) private var toDoTabs: [ToDoTab]

    // 選択されているタブのインデックス（番号）を保存する変数
    @State private var selectedTabIndex = 0

    var body: some View {
        VStack {
            Picker(selection: $selectedTabIndex, label: Text("タブを選択")) {
                // ForEachを使って、取得したタブの数だけ選択肢を生成
                ForEach(toDoTabs.indices, id: \\.self) { index in
                    Text(toDoTabs[index].name).tag(index)
                }
            }
            .pickerStyle(.segmented) // 見た目をセグメントスタイルに変更
            .padding(.horizontal)

            Spacer() // 残りのスペースを埋める
            Text("ここにタスクが表示されます")
            Spacer() // 残りのスペースを埋める
        }
        .navigationTitle("ホーム") // ナビゲーションバーのタイトル
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">コードの解説</h2>
			<ul class="mb-4 list-inside list-disc space-y-2 rounded-md bg-base-200 p-4">
				<li>
					<strong>@State private var selectedTabIndex = 0:</strong> `@State`は、UIの状態（この場合は「どのタブが選ばれているか」）を保存するための目印です。`0`は最初のタブを意味します。
				</li>
				<li>
					<strong>Picker(selection: $...):</strong> `$selectedTabIndex`のように`$`を付けることで、Pickerでの選択が`selectedTabIndex`変数に自動的に反映されるようになります。
				</li>
				<li>
					<strong>ForEach(...):</strong> `toDoTabs`の配列を元に、繰り返し選択肢(`Text`)を生成します。
				</li>
				<li>
					<strong>.tag(index):</strong> 各選択肢にユニークな識別子（ここではインデックス番号）を割り当てます。
				</li>
			</ul>
			<p>
				この時点では、まだタブを作っていないのでプレビューには何も表示されません。次のステップで、実際にデータを表示する処理を実装します。
			</p>
		</div>
	</div>

	<div class="mt-12 flex justify-between">
		<a href="../step7" class="btn">前へ</a>
		<a href="../step9" class="btn btn-primary">次へ: タブ表示</a>
	</div>
</div>
