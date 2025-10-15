<script>
	import { base } from '$app/paths';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">ステップ3: 必要な機能を洗い出そう</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/original-app/step2" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/original-app/step4" class="btn btn-primary">次のステップ →</a>
	</div>

	<div class="prose max-w-none">
		<p>
			アプリのアイデアと設計図が固まったら、次は「どんな機能が必要か」を具体的にリストアップしていきます。この作業を行うことで、開発の全体像が明確になり、何から手をつければ良いかが分かりやすくなります。
		</p>

		<div class="card my-8 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">機能を洗い出すコツ</h2>
				<p>
					設計図を見ながら、ユーザーがアプリで行うであろう操作を一つ一つ想像してみましょう。「このボタンを押したら、何が起こる？」と考えていくと、必要な機能が見えてきます。
				</p>
				<p class="mt-4">
					<strong>ポイント：</strong>
				</p>
				<ul class="list-inside list-disc">
					<li>
						<strong>できるだけ細かく分解する：</strong>
						「タイマー機能」のような大きな括りだけでなく、「時間を設定する機能」「スタート・ストップする機能」「残り時間を表示する機能」のように、できるだけ具体的に書き出しましょう。
					</li>
					<li>
						<strong>データの視点で考える：</strong>
						アプリで扱う情報（データ）は何かを考えると、機能が見えてくることもあります。例えば、「Todoリスト」なら、「タスクのリストを保存する機能」「タスクの完了状態を記録する機能」などが必要です。
					</li>
				</ul>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">機能リストを作成しよう</h2>
				<p>
					洗い出した機能を下のシートに書き出してみましょう。さらに、それぞれの機能について、優先順位（絶対に必要なものか、あったら嬉しいものか）を決めておくと、開発計画が立てやすくなります。
				</p>
				<div class="mt-4 overflow-x-auto">
					<table class="table w-full">
						<thead>
							<tr>
								<th>機能</th>
								<th>詳しい説明</th>
								<th>優先度</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<input
										type="text"
										class="input-bordered input w-full"
										placeholder="（例）タイマーの時間を設定する機能"
									/>
								</td>
								<td>
									<input
										type="text"
										class="input-bordered input w-full"
										placeholder="（例）Pickerを使って時・分・秒を選ぶ"
									/>
								</td>
								<td>
									<select class="select-bordered select w-full max-w-xs">
										<option>絶対必要</option>
										<option>あったら嬉しい</option>
									</select>
								</td>
							</tr>
							<tr>
								<td>
									<input
										type="text"
										class="input-bordered input w-full"
										placeholder="（例）タスクを追加する機能"
									/>
								</td>
								<td>
									<input
										type="text"
										class="input-bordered input w-full"
										placeholder="（例）テキスト入力フィールドと追加ボタンを配置"
									/>
								</td>
								<td>
									<select class="select-bordered select w-full max-w-xs">
										<option>絶対必要</option>
										<option>あったら嬉しい</option>
									</select>
								</td>
							</tr>
							<tr>
								<td><input type="text" class="input-bordered input w-full" /></td>
								<td><input type="text" class="input-bordered input w-full" /></td>
								<td>
									<select class="select-bordered select w-full max-w-xs">
										<option>絶対必要</option>
										<option>あったら嬉しい</option>
									</select>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<p class="mt-8">
			このステップで作成した機能リストが、次のステップ以降の開発の道しるべになります。じっくり考えて、自分の作りたいアプリに必要な機能をリストアップしてみましょう。
		</p>
	</div>
</div>
