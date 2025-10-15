<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">
		ステップ7: アプリの骨組み：ナビゲーションとHomeViewを用意する
	</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/todolist/step6" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/todolist/step8" class="btn btn-primary">次のステップ →</a>
	</div>

	<p class="mb-8 text-lg">
		いよいよ画面作成です！まず、アプリの「骨組み」となる部分を作ります。具体的には、画面遷移を管理する`NavigationStack`と、中心的な画面である`HomeView`です。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. ファイルの準備</h2>
			<p class="mb-4">
				`Screens`フォルダの中に、`Views`と`Navigation`という2つのサブフォルダを作成します。さらに`Views`の中には`Main`というサブフォルダも作成してください。
			</p>
			<p class="mb-4">そして、以下の3つのSwiftUI Viewファイルを、それぞれの場所に作成します。</p>
			<ul class="mb-4 list-inside list-disc rounded-md bg-base-200 p-4">
				<li>`Screens/Navigation/MainStack.swift`</li>
				<li>`Screens/Views/Main/HomeView.swift`</li>
				<li>`Screens/Views/InitialView.swift` (これは後で使います)</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. アプリのエントリーポイントを更新</h2>
			<p class="mb-4">
				まず、アプリが起動したときに最初に何を表示するかを設定します。`SwiftUIToDoListApp.swift`を開き、`ContentView()`を`InitialView()`に書き換えます。
			</p>
			<CodeBlock
				title="SwiftUIToDoListApp.swift"
				code={`
import SwiftUI

@main
struct SwiftUIToDoListApp: App {
    // データベース接続の土台をここでインスタンス化
    let modelContainer = SwiftDataService.shared.modelContainer

    var body: some Scene {
        WindowGroup {
            InitialView() // 最初にInitialViewを表示する
        }
        .modelContainer(modelContainer) // アプリ全体でデータベースを使えるように設定
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">3. MainStackとHomeViewを実装</h2>
			<p class="mb-4">
				次に、`MainStack.swift`と`HomeView.swift`に基本的なコードを記述します。`HomeView`がメイン画面、`MainStack`がその画面を含み、将来の画面遷移を管理する役割を持ちます。
			</p>
			<CodeBlock
				title="HomeView.swift"
				code={`
import SwiftUI

struct HomeView: View {
    var body: some View {
        Text("ホーム画面")
    }
}

#Preview {
    HomeView()
}
`}
			/>
			<CodeBlock
				title="MainStack.swift"
				code={`
import SwiftUI

struct MainStack: View {
    var body: some View {
        NavigationStack {
            HomeView()
        }
    }
}

#Preview {
    MainStack()
}
`}
			/>
		</div>
	</div>

	<div class="mt-12 flex justify-between">
		<a href="../step6" class="btn">前へ</a>
		<a href="../step8" class="btn btn-primary">次へ: タブ選択UI</a>
	</div>
</div>
