<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ステップ19: 画面遷移：ホーム画面からタブ管理画面へ移動できるようにする</h1>
	<p class="mb-8 text-lg">
		作成した2つの画面を繋ぎます。ホーム画面のナビゲーションバーにアイコンを設置し、それをタップすることでタブ管理画面へ移動できるようにします。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. MainStackに画面遷移の定義を追加</h2>
			<p class="mb-4">
				まず、`Navigation/MainStack.swift`を更新し、「どこに移動するか」の定義を追加します。`.navigationDestination`モディファイアを使い、「`tabManage`という目的地が指定されたら`TabManageView`を表示する」というルールを設定します。
			</p>
			<CodeBlock
				title="MainStack.swift (更新)"
				code={`
import SwiftUI

struct MainStack: View {
    var body: some View {
        NavigationStack {
            HomeView()
                .navigationDestination(for: String.self) { destination in
                    if destination == "tabManage" {
                        TabManageView()
                    }
                }
        }
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. HomeViewに遷移ボタンを追加</h2>
			<p class="mb-4">
				次に、`HomeView.swift`の`body`に、`.toolbar`モディファイアを追加して、ナビゲーションバーの左上にフォルダアイコンのボタンを配置します。このボタンは`NavigationLink`でラップし、目的地として`"tabManage"`を指定します。
			</p>
			<CodeBlock
				title="HomeView.swift (bodyに追記)"
				code={`
    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            // ...
        }
        .navigationTitle("ホーム")
        .toolbar { // このブロックを追加
            ToolbarItem(placement: .navigationBarLeading) {
                NavigationLink(value: "tabManage") {
                    Image(systemName: "folder")
                }
            }
        }
    }
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">コードの解説</h2>
			<ul class="mb-4 list-inside list-disc space-y-2 bg-base-200 p-4 rounded-md">
				<li><strong>`NavigationLink(value: "tabManage")`</strong>: これが画面遷移の「スイッチ」です。タップされると、`value`に指定された値（ここでは文字列`"tabManage"`）を`NavigationStack`に通知します。</li>
				<li><strong>`.navigationDestination(for: String.self)`</strong>: `NavigationStack`は`NavigationLink`から`String`型の値を受け取ると、この処理ブロックを実行します。`destination`に`"tabManage"`が入ってくるので、if文で判定して`TabManageView`を表示する、という仕組みです。</li>
			</ul>
			<p>
				アプリを実行し、ホーム画面左上のフォルダアイコンをタップすると、タブ管理画面にスムーズに移動できることが確認できます。
			</p>
		</div>
	</div>

    <div class="mt-12 flex justify-between">
        <a href="../step18" class="btn">前へ</a>
        <a href="../step20" class="btn btn-primary">次へ: 初回データ登録</a>
    </div>
</div>
