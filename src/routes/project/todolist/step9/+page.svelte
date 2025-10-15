<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ステップ9: データ連携：作ったタブをピッカーに表示させる</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/todolist/step8" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/todolist/step10" class="btn btn-primary">次のステップ →</a>
	</div>

	<p class="mb-8 text-lg">
		UI（見た目）とデータ（情報）を結びつけます。前のステップで作ったピッカーに、SwiftDataから取得したタブのリストを実際に表示させましょう。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. プレビュー用のダミーデータを作成</h2>
			<p class="mb-4">
				今のままでは、アプリを起動してタブを登録しないとピッカーに何も表示されず、UIの確認がしづらいです。そこで、Xcodeのプレビュー画面だけで機能する「ダミーデータ」を用意します。
			</p>
			<p class="mb-4">
				`HomeView.swift`の`#Preview`ブロックを更新して、プレビューが表示される時にいくつかのタブを自動的に作成するようにします。
			</p>
			<CodeBlock
				title="HomeView.swift (#Previewを更新)"
				code={`
#Preview {
    // プレビュー用のコンテナをメモリ上に作成
    let container = try! ModelContainer(for: ToDoTab.self, ToDoTask.self, inMemory: true)

    // ダミーのタブデータ
    let tabs = [ToDoTab(name: "勉強"), ToDoTab(name: "買い物")]
    tabs.forEach { container.mainContext.insert($0) }

    return NavigationStack {
        HomeView()
            // このビューとそのサブビューが、プレビュー用のコンテナを使用するように設定
            .modelContainer(container)
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. プレビューを確認</h2>
			<p class="mb-4">
				コードを更新すると、Xcodeのプレビューが自動的にリロードされ、ダミーデータとして作成した「勉強」「買い物」という2つのタブがピッカーに表示されるはずです。
			</p>
			<p class="mb-4">
				このように、`#Preview`ブロックを工夫することで、実際のデータがない状態でもUIの開発を効率的に進めることができます。
			</p>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">3. HomeViewの完成コード</h2>
			<p class="mb-4">ステップ9完了時点での`HomeView.swift`全体のコードです。</p>
			<CodeBlock
				title="HomeView.swift"
				code={`
import SwiftUI
import SwiftData

struct HomeView: View {
    @Query(sort: \\ToDoTab.createdAt) private var toDoTabs: [ToDoTab]
    @State private var selectedTabIndex = 0

    var body: some View {
        VStack {
            // タブが一つもない場合はピッカーを非表示にする
            if !toDoTabs.isEmpty {
                Picker(selection: $selectedTabIndex, label: Text("タブを選択")) {
                    ForEach(toDoTabs.indices, id: \\.self) { index in
                        Text(toDoTabs[index].name).tag(index)
                    }
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)
            }

            Spacer()
            Text("ここにタスクが表示されます")
            Spacer()
        }
        .navigationTitle("ホーム")
    }
}

#Preview {
    let container = try! ModelContainer(for: ToDoTab.self, ToDoTask.self, inMemory: true)

    let tabs = [ToDoTab(name: "勉強"), ToDoTab(name: "買い物")]
    tabs.forEach { container.mainContext.insert($0) }

    return NavigationStack {
        HomeView()
            .modelContainer(container)
    }
}
`}
			/>
		</div>
	</div>

	<div class="mt-12 flex justify-between">
		<a href="../step8" class="btn">前へ</a>
		<a href="../step10" class="btn btn-primary">次へ: タスク行UI</a>
	</div>
</div>
