<script>
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	// 画面要素データを管理するリアクティブな変数
	let screens = $state([{ elements: '' }, { elements: '' }, { elements: '' }]);

	// ページ読み込み時にlocalStorageからデータを読み込む
	onMount(() => {
		const saved = localStorage.getItem('original-app-step2-screens');
		if (saved) {
			try {
				screens = JSON.parse(saved);
			} catch (e) {
				console.error('保存データの読み込みに失敗しました:', e);
			}
		}
	});

	// データをlocalStorageに保存する関数
	function saveData() {
		localStorage.setItem('original-app-step2-screens', JSON.stringify(screens));
	}

	// 入力変更時に自動保存
	function handleInputChange(index, value) {
		screens[index].elements = value;
		saveData();
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">
		<span class="mr-4 badge badge-lg badge-primary">2</span>
		ステップ2: アプリの設計図を描いてみよう
	</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/original-app/step1" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/original-app/step3" class="btn btn-primary">次のステップ →</a>
	</div>

	<!-- プログレスバー -->
	<div class="mb-6">
		<div class="mb-2 flex justify-between text-sm">
			<span>ステップ2 / 5</span>
			<span>40%</span>
		</div>
		<progress class="progress w-full progress-primary" value="40" max="100"></progress>
	</div>

	<div class="prose max-w-none">
		<p>
			作りたいアプリのアイデアが決まったら、次はアプリの「設計図」を作成します。設計図といっても、難しく考える必要はありません。アプリにどんな画面があって、それぞれにどんなボタンやテキストを配置するかを、紙に自由に描いてみることから始めましょう。
		</p>

		<div class="card my-8 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">なぜ設計図が必要なの？</h2>
				<p>
					家を建てるときに、いきなり工事を始めずに、まず設計図を描くのと同じです。アプリも、最初に全体のデザインを決めておくことで、スムーズに開発を進めることができます。また、必要な機能や、画面の使いやすさ（UI/UX）について、早めに気づくことができます。
				</p>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">設計図を描いてみよう</h2>
				<p>
					方眼紙やノート、コピー用紙など、なんでも構いません。スマートフォンの画面をイメージして、四角い枠を描き、その中に画面の要素を配置していきましょう。
				</p>
				<p class="mt-4">
					<strong>ポイント：</strong>
				</p>
				<ul class="list-inside list-disc">
					<li>
						<strong>完璧を目指さない：</strong>
						最初はざっくりでOKです。細かいデザインよりも、どこに何を置くかを重視しましょう。
					</li>
					<li>
						<strong>主要な画面から描く：</strong>
						アプリのメインとなる画面から描き始めると、全体の構成がイメージしやすくなります。
					</li>
					<li>
						<strong>画面のつながりを考える：</strong>
						「このボタンを押したら、どの画面に移動するか？」といった、画面同士のつながりを矢印などでメモしておくと、後の開発が楽になります。
					</li>
				</ul>
			</div>
		</div>

		<div class="card mt-8 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">画面の要素洗い出しシート</h2>
				<p>
					設計図が描けたら、それぞれの画面にどんな要素（ボタン、テキスト、画像など）が必要か、下のシートに書き出してみましょう。
				</p>
				<div class="mt-4 space-y-4">
					<div>
						<label for="screen1" class="text-lg font-bold">画面1（例：トップ画面）：</label>
						<textarea
							id="screen1"
							class="textarea-bordered textarea mt-1 w-full"
							placeholder="（例）
- タイトルテキスト
- スタートボタン
- 設定ボタン"
							bind:value={screens[0].elements}
							oninput={() => handleInputChange(0, screens[0].elements)}
						></textarea>
					</div>
					<div>
						<label for="screen2" class="text-lg font-bold">画面2（例：設定画面）：</label>
						<textarea
							id="screen2"
							class="textarea-bordered textarea mt-1 w-full"
							placeholder="（例）
- 音量調整スライダー
- 戻るボタン"
							bind:value={screens[1].elements}
							oninput={() => handleInputChange(1, screens[1].elements)}
						></textarea>
					</div>
					<div>
						<label for="screen3" class="text-lg font-bold">画面3：</label>
						<textarea
							id="screen3"
							class="textarea-bordered textarea mt-1 w-full"
							bind:value={screens[2].elements}
							oninput={() => handleInputChange(2, screens[2].elements)}
						></textarea>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
