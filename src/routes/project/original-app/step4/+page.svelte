<script>
	import { base } from '$app/paths';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">
		<span class="mr-4 badge badge-lg badge-primary">4</span>
		ステップ4: プロジェクトをセットアップしよう
	</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/original-app/step3" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/original-app/step5" class="btn btn-primary">次のステップ →</a>
	</div>

	<!-- プログレスバー -->
	<div class="mb-6">
		<div class="mb-2 flex justify-between text-sm">
			<span>ステップ4 / 5</span>
			<span>80%</span>
		</div>
		<progress class="progress w-full progress-primary" value="80" max="100"></progress>
	</div>

	<div class="prose max-w-none">
		<p>
			アプリの企画と設計が完了したら、いよいよプログラミングの準備を始めます。このステップでは、開発ツールであるXcode（エックスコード）を使って、新しいプロジェクトを作成します。
		</p>
		<p>
			これまでの「タイマーアプリ」や「Todoリストアプリ」のプロジェクトでも経験した作業なので、復習だと思って取り組んでみましょう。
		</p>

		<div class="card my-8 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">1. プロジェクトの情報を入力する</h2>
				<p>
					最後に、プロジェクトの詳細情報を入力します。下の画像を参考に、自分のアプリに合わせて情報を入力してください。
				</p>
				<ul class="list-inside list-disc">
					<li>
						<strong>Product Name:</strong> あなたのアプリの名前を入力します。（例: MyStudyTracker）
					</li>
					<li>
						<strong>Team:</strong>
						基本的には「None」または自分のApple IDを選択します。今は気にしなくても大丈夫です。
					</li>
					<li>
						<strong>Organization Identifier:</strong>
						あなたの名前や組織名を逆から書いたものを入力します。（例: com.yourname）
					</li>
					<li>
						<strong>Interface:</strong> 「SwiftUI」が選択されていることを確認します。
					</li>
					<li>
						<strong>Language:</strong> 「Swift」が選択されていることを確認します。
					</li>
					<li>
						<strong>Storage:</strong>
						「SwiftData」または「Core Data」を選択できますが、ここでは「None」のままで大丈夫です。
					</li>
				</ul>
				<p>入力が終わったら、「Next」をクリックし、プロジェクトを保存する場所を選べば完了です！</p>
			</div>
		</div>

		<p class="mt-8 text-xl">
			これで、あなたのオリジナルアプリ開発の準備が整いました。次のステップから、いよいよ本格的なプログラミングが始まります！
		</p>
	</div>
</div>
