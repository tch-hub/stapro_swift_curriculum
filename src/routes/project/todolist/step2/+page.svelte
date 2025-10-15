<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">ステップ2: 役割ごとにフォルダを整理する</h1>
	<p class="mb-8 text-lg">
		コードが増えてくると、どこに何があるか分からなくなりがちです。今のうちに、役割ごとにファイルを分けて入れるための「フォルダ（グループ）」を作成し、プロジェクトを整理整頓しましょう。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. グループを作成する</h2>
			<p class="mb-4">
				Xcodeの左側にあるファイルナビゲータで、プロジェクトのメインフォルダ（`SwiftUIToDoList`など）を右クリックし、「New
				Group」を選択します。
			</p>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. フォルダ構成</h2>
			<p class="mb-4">以下の4つのグループを、同じ手順で作成してください。</p>
			<div class="mockup-code">
				<pre><code
						>SwiftUIToDoList/
├── SwiftUIToDoListApp.swift
├── ContentView.swift
├── <span class="text-success">Screens</span>      # 画面（UI）に関するファイル
├── <span class="text-success">SwiftData</span>      # データモデルに関するファイル
├── <span class="text-success">Services</span>       # データ操作のロジック
└── <span class="text-success">Components</span>     # 再利用するUI部品</code
					></pre>
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">各フォルダの役割</h2>
			<ul class="mb-4 list-inside list-disc space-y-2 rounded-md bg-base-200 p-4">
				<li><strong>Screens:</strong> アプリの各画面（ビュー）を格納します。</li>
				<li><strong>SwiftData:</strong> データの設計図であるモデルクラスを格納します。</li>
				<li>
					<strong>Services:</strong> データの読み書きや加工など、具体的な処理を行うコードを格納します。
				</li>
				<li>
					<strong>Components:</strong> ボタンやリストの行など、アプリ内で繰り返し使われるUI部品を格納します。
				</li>
			</ul>
			<p>
				このように最初にフォルダ分けをしておくことで、将来コードが複雑になっても、目的のファイルを見つけやすくなります。
			</p>
		</div>
	</div>

	<div class="mt-12 flex justify-between">
		<a href="../step1" class="btn">前へ</a>
		<a href="../step3" class="btn btn-primary">次へ: データ設計①</a>
	</div>
</div>
