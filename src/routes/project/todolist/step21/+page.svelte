<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ステップ21: 仕上げ：コードを部品化してプロジェクトを綺麗にする</h1>
	<p class="mb-8 text-lg">
		アプリの全機能が完成しました！最後のステップとして、コードをより読みやすく、再利用しやすい形に整える「リファクタリング」を行い、プロジェクトを完成させましょう。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. リファクタリングとは？</h2>
			<p class="mb-4">
				リファクタリングとは、アプリの外部から見た動作を変えずに、内部のコード構造を改善することです。例えば、「同じようなコードが複数の場所にある」場合に、それを一つの「部品（コンポーネント）」として切り出す作業などが含まれます。
			</p>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. FloatingActionButtonコンポーネントを作成</h2>
			<p class="mb-4">
				`HomeView`にある右下の「＋」ボタンは、他の画面でも使いたくなるかもしれません。これを再利用可能な部品として切り出しましょう。`Components`フォルダに`FloatingActionButton.swift`という名前で新しいSwiftUI Viewファイルを作成します。
			</p>
			<CodeBlock
				title="FloatingActionButton.swift"
				code={`
import SwiftUI

struct FloatingActionButton: View {
    var action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: "plus")
                .font(.title.weight(.semibold))
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .clipShape(Circle())
                .shadow(radius: 4, x: 0, y: 4)
        }
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">3. HomeViewをリファクタリング</h2>
			<p class="mb-4">
				`HomeView.swift`の`ZStack`内にある長い`Button`のコードを、今作成した`FloatingActionButton`に置き換えます。コードがとてもスッキリしますね。
			</p>
			<CodeBlock
				title="HomeView.swift (ZStack内を更新)"
				code={`
    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            VStack {
                // ... PickerとList ...
            }

            FloatingActionButton(action: {
                isAddTaskPresented = true
            })
            .padding()
        }
        // ...
    }
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">プロジェクト完成！</h2>
			<p>
				これでToDoリストアプリの全工程が完了です！お疲れ様でした。
				このプロジェクトを通じて、あなたはSwiftUIアプリ開発の基本的な流れを学びました。
			</p>
			<ul class="list-disc list-inside bg-base-200 p-4 rounded-md space-y-2">
				<li>Xcodeでのプロジェクト作成とファイル管理</li>
				<li>SwiftDataを使ったデータモデリングと永続化</li>
				<li>Service層を使ったデータ操作ロジックの実装</li>
				<li>`List`, `Picker`, `NavigationStack`を使ったUI構築</li>
				<li>コンポーネント化によるコードの再利用と整理</li>
			</ul>
			<p class="mt-4">
				この経験を土台に、さらに機能を追加したり、自分だけのオリジナルアプリ開発に挑戦したりしてみてください！
			</p>
		</div>
	</div>

    <div class="mt-12 flex justify-between">
        <a href="../step20" class="btn">前へ</a>
        <a href="#" class="btn btn-disabled">完了</a>
    </div>
</div>
