<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ステップ1: Xcodeでプロジェクトを新規作成する</h1>
	<p class="mb-8 text-lg">
		すべてのアプリ開発は、ここから始まります。Xcodeを起動して、ToDoリストアプリの新しいプロジェクトを作成しましょう。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">
				1. Xcodeを起動して「Create a new Xcode project」を選択
			</h2>
			<p class="mb-4">
				Xcodeを開き、ウェルカムウィンドウから新しいプロジェクトの作成を選択します。
			</p>
			<!-- 画像やスクリーンショットを後で追加 -->
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. テンプレートを選択</h2>
			<p class="mb-4">「iOS」タブを選択し、「App」テンプレートを選んで「Next」をクリックします。</p>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">3. プロジェクトのオプションを設定</h2>
			<p class="mb-4">
				プロジェクト名（例:
				SwiftUIToDoList）、チーム、組織IDなどを入力します。重要な設定項目は以下の通りです。
			</p>
			<ul class="mb-4 list-inside list-disc rounded-md bg-base-200 p-4">
				<li><strong>Interface:</strong> SwiftUI</li>
				<li><strong>Language:</strong> Swift</li>
				<li><strong>Storage:</strong> None （後でSwiftDataを手動で設定します）</li>
			</ul>
			<p>
				設定が終わったら「Next」をクリックし、プロジェクトを保存する場所を選んで「Create」をクリックします。
			</p>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">4. プロジェクト作成完了！</h2>
			<p class="mb-4">
				これで、アプリ開発の土台となるプロジェクトが作成されました。Xcodeの画面には、いくつかのファイルが自動的に生成されているのが確認できます。
			</p>
			<CodeBlock
				title="ContentView.swift（自動生成された初期コード）"
				code={`
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text("Hello, world!")
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
`}
			/>
		</div>
	</div>

	<div class="mt-12 flex justify-between">
		<!-- disabled a tag -->
		<a href="#" class="btn btn-disabled">前へ</a>
		<a href="../step2" class="btn btn-primary">次へ: フォルダ構成</a>
	</div>
</div>
