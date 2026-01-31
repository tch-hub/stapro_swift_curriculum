<script>
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	let ideas = $state([
		{ idea: '', reason: '' },
		{ idea: '', reason: '' },
		{ idea: '', reason: '' }
	]);

	onMount(() => {
		const saved = localStorage.getItem('original-app-step1-ideas');
		if (saved) {
			try {
				ideas = JSON.parse(saved);
			} catch (e) {
				console.error('保存データの読み込みに失敗しました:', e);
			}
		}
	});

	function saveData() {
		localStorage.setItem('original-app-step1-ideas', JSON.stringify(ideas));
	}

	function handleInputChange(index, field, value) {
		ideas[index][field] = value;
		saveData();
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">
		<span class="mr-4 badge badge-lg badge-primary">1</span>
		ステップ1: アプリのアイデアを考えよう
	</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href={resolve('/project/original-app')} class="btn btn-outline">← プロジェクト概要に戻る</a>
		<a href={resolve('/project/original-app/step2')} class="btn btn-primary">次のステップ →</a>
	</div>

	<!-- プログレスバー -->
	<div class="mb-6">
		<div class="mb-2 flex justify-between text-sm">
			<span>ステップ1 / 5</span>
			<span>20%</span>
		</div>
		<progress class="progress w-full progress-primary" value="20" max="100"></progress>
	</div>

	<div class="prose max-w-none">
		<p>
			アプリ開発の最初のステップは、なんと言っても「どんなアプリを作るか？」を決めることです。このステップでは、自分の作りたいアプリのアイデアを見つけるためのヒントを紹介します。
		</p>

		<div class="card my-8 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">アイデアを見つけるための3つの質問</h2>
				<p>下の質問について考えてみると、アイデアが思いつきやすくなるかもしれません。</p>
				<ul class="list-inside list-disc">
					<li>
						<strong>自分の「好き」から考える：</strong>
						あなたが好きなことは何ですか？（例：ゲーム、音楽、スポーツ、料理など）好きなことに関連するアプリなら、楽しく開発を続けられます。
					</li>
					<li>
						<strong>自分の「困った」から考える：</strong>
						普段の生活で「もっとこうだったら便利なのに…」と思うことはありませんか？（例：忘れ物が多い、計算が面倒など）その「困った」を解決するアプリは、他の人にとっても役立つものになるかもしれません。
					</li>
					<li>
						<strong>既にあるアプリを組み合わせる：</strong>
						あなたが普段使っているアプリの便利な機能を組み合わせて、新しいアプリを考えてみるのも良い方法です。（例：「タイマー」と「Todoリスト」を組み合わせて「勉強時間トラッカー」を作る）
					</li>
				</ul>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">アイデアシート</h2>
				<p>
					いくつかアイデアが浮かんできたら、下のシートに書き出してみましょう。頭の中だけで考えずに書き出すことで、アイデアが整理されて、より具体的になります。
				</p>
				<div class="mt-4 space-y-4">
					<div>
						<label for="idea1" class="text-lg font-bold">アイデア1：</label>
						<input
							type="text"
							id="idea1"
							class="input-bordered input mt-1 w-full"
							placeholder="（例）毎日のやることリストを管理できるアプリ"
							bind:value={ideas[0].idea}
							oninput={() => handleInputChange(0, 'idea', ideas[0].idea)}
						/>
						<label for="reason1" class="mt-2 block">このアプリを作りたい理由：</label>
						<textarea
							id="reason1"
							class="textarea-bordered textarea mt-1 w-full"
							placeholder="（例）忘れ物をなくしたいから"
							bind:value={ideas[0].reason}
							oninput={() => handleInputChange(0, 'reason', ideas[0].reason)}
						></textarea>
					</div>
					<div>
						<label for="idea2" class="text-lg font-bold">アイデア2：</label>
						<input
							type="text"
							id="idea2"
							class="input-bordered input mt-1 w-full"
							placeholder="（例）友達と対戦できる簡単な練習問題ゲーム"
							bind:value={ideas[1].idea}
							oninput={() => handleInputChange(1, 'idea', ideas[1].idea)}
						/>
						<label for="reason2" class="mt-2 block">このアプリを作りたい理由：</label>
						<textarea
							id="reason2"
							class="textarea-bordered textarea mt-1 w-full"
							placeholder="（例）休み時間にみんなで遊びたいから"
							bind:value={ideas[1].reason}
							oninput={() => handleInputChange(1, 'reason', ideas[1].reason)}
						></textarea>
					</div>
					<div>
						<label for="idea3" class="text-lg font-bold">アイデア3：</label>
						<input
							type="text"
							id="idea3"
							class="input-bordered input mt-1 w-full"
							bind:value={ideas[2].idea}
							oninput={() => handleInputChange(2, 'idea', ideas[2].idea)}
						/>
						<label for="reason3" class="mt-2 block">このアプリを作りたい理由：</label>
						<textarea
							id="reason3"
							class="textarea-bordered textarea mt-1 w-full"
							bind:value={ideas[2].reason}
							oninput={() => handleInputChange(2, 'reason', ideas[2].reason)}
						></textarea>
					</div>
				</div>
			</div>
		</div>

		<p class="mt-8">
			たくさんのアイデアを出す必要はありません。自分が「これ、作ってみたい！」とワクワクするものを1つ見つけることができれば、このステップは完了です。
		</p>
	</div>
</div>
