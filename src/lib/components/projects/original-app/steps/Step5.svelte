<script>
	import { resolve } from '$app/paths';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">
		<span class="mr-4 badge badge-lg badge-primary">5</span>
		ステップ5: 機能を実装してみよう
	</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href={resolve('/project/original-app/step4')} class="btn btn-outline">← 前のステップ</a>
		<a href={resolve('/project/original-app')} class="btn btn-primary">プロジェクト完了！</a>
	</div>

	<!-- プログレスバー -->
	<div class="mb-6">
		<div class="mb-2 flex justify-between text-sm">
			<span>ステップ5 / 5</span>
			<span>100%</span>
		</div>
		<progress class="progress w-full progress-success" value="100" max="100"></progress>
	</div>

	<div class="prose max-w-none">
		<p>
			いよいよ、これまでの計画を形にする時が来ました。ステップ3で作成した「機能リスト」と、ステップ2で描いた「設計図」を手元に準備して、プログラミングを始めましょう！
		</p>

		<div class="card my-8 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">開発の進め方ヒント</h2>
				<ul class="list-inside list-disc">
					<li>
						<strong>機能リストの優先順位順に進める：</strong>
						まずは「絶対必要」と設定した機能から実装していきましょう。一つ一つ機能を完成させていくことで、着実にアプリが完成に近づいていきます。
					</li>
					<li>
						<strong>まずは動くものを作る：</strong>
						最初から完璧なデザインや動きを目指す必要はありません。まずは、機能が最低限動くことを目標にしましょう。見た目を整えるのは後からでもできます。
					</li>
					<li>
						<strong>エラーを恐れない：</strong>
						プログラミングにエラーはつきものです。エラーメッセージをよく読んで、何が原因かを探ってみましょう。エラーを解決する力も、エンジニアにとって大切なスキルの一つです。
					</li>
				</ul>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">困ったときの道しるべ</h2>
				<p>
					「どうやって実装すればいいんだっけ？」と手が止まってしまったときは、これまでの教材がきっと助けになります。
				</p>
				<p class="mt-4">例えば、こんな機能で困っていませんか？</p>
				<ul class="mt-4 list-inside list-disc space-y-2">
					<li>
						<strong>タイマーを実装したい：</strong>
						<a href={resolve('/project/timer')} class="link-primary">タイマーアプリプロジェクト</a>
						のステップ6「タイマーロジックの追加」やステップ4「タイマー表示ビューの実装」が参考になります。
					</li>
					<li>
						<strong>リストでデータを表示したい：</strong>
						<a href={resolve('/project/todolist')} class="link-primary"
							>Todoリストアプリプロジェクト</a
						>
						のステップ4「Todo項目を表示する」やステップ8「リストの見た目を整える」を見てみましょう。
					</li>
					<li>
						<strong>データを保存したい：</strong>
						<a href={resolve('/project/todolist')} class="link-primary"
							>Todoリストアプリプロジェクト</a
						>
						のステップ14「SwiftDataの導入」からステップ16「データの永続化」までが役に立ちます。
					</li>
					<li>
						<strong>画面を切り替えたい：</strong>
						<a href={resolve('/project/todolist')} class="link-primary"
							>Todoリストアプリプロジェクト</a
						>
						のステップ12「シートを使ってタスク追加画面を表示する」がヒントになるはずです。
					</li>
				</ul>
			</div>
		</div>

		<p class="mt-8 text-xl">
			あなたの頭の中にあるアイデアが、自分の手で形になっていく瞬間は、プログラミングの最大の醍醐味です。焦らず、自分のペースで、アプリ開発を楽しんでください！
		</p>
	</div>
</div>
