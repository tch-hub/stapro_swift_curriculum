<script>
	import { base } from '$app/paths';

	// 現在のステップを管理する変数
	let currentStep = 0;

	// ステップデータの定義
	const steps = [
		{ title: 'システム要件確認', completed: true },
		{ title: 'Xcodeインストール', completed: true },
		{ title: '初期設定', completed: true },
		{ title: '動作確認', completed: false }
	];
</script>

<div class="container mx-auto px-4 py-8">
	<!-- 進行状況表示 -->
	<div class="steps steps-vertical mb-8 w-full lg:steps-horizontal">
		{#each steps as step, index}
			<div class="step {index <= currentStep ? 'step-primary' : ''}">{step.title}</div>
		{/each}
	</div>

	<!-- ステップ1: システム要件確認 -->
	{#if currentStep === 0}
		<div class="card mb-8 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl">
					<span class="mr-2 badge badge-lg badge-primary">STEP 1</span>
					システム要件確認
				</h2>
				<div class="alert alert-info">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="h-6 w-6 shrink-0 stroke-current"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path></svg
					>
					<div>
						<h3 class="font-bold">重要！</h3>
						<p>Swiftの開発には<strong>Mac</strong>が必要です。WindowsやLinuxでは開発できません。</p>
					</div>
				</div>
				<div class="overflow-x-auto">
					<table class="table table-zebra">
						<thead>
							<tr>
								<th>項目</th>
								<th>必要な要件</th>
								<th>確認方法</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>OS</td>
								<td>macOS Sequoia 15.6以上</td>
								<td>Appleメニュー → "このMacについて"</td>
							</tr>
							<tr>
								<td>ストレージ</td>
								<td>15GB以上の空き容量</td>
								<td>Appleメニュー → "このMacについて" → "ストレージ"</td>
							</tr>
							<tr>
								<td>メモリ</td>
								<td>8GB以上（推奨16GB）</td>
								<td>Appleメニュー → "このMacについて"</td>
							</tr>
							<tr>
								<td>Apple ID</td>
								<td>有効なApple ID</td>
								<td>App Storeにサインインできるか確認</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="mb-4 flex justify-end">
			<button class="btn btn-primary" onclick={() => currentStep++}>次のステップ</button>
		</div>
	{/if}

	<!-- ステップ2: Xcodeインストール -->
	{#if currentStep === 1}
		<div class="card mb-8 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl">
					<span class="mr-2 badge badge-lg badge-primary">STEP 2</span>
					Xcodeインストール
				</h2>
				<p class="mb-4 text-lg">XcodeはSwiftでiOSアプリを開発するための統合開発環境（IDE）です。</p>

				<div class="card bg-base-200">
					<div class="card-body">
						<h3 class="card-title">App Storeからインストール</h3>
						<ol class="list-inside list-decimal space-y-2">
							<li>MacのApp Storeを開く</li>
							<li>検索バーで「Xcode」を検索</li>
							<li>「入手」ボタンをクリック</li>
							<li>Apple IDでサインイン</li>
							<li>ダウンロード開始（数時間かかる場合があります）</li>
							<li>ダウンロードが完了するまで待つ</li>
							<li>Launchpad（ランチパッド）からXcodeを探す</li>
							<li>Xcodeアイコンをクリックして起動</li>
						</ol>
						<div class="mt-4 alert alert-success">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/></svg
							>
							<span>自動でアップデートされるので便利！</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="mb-4 flex justify-between">
			<button class="btn btn-outline" onclick={() => currentStep--}>前のステップ</button>
			<button class="btn btn-primary" onclick={() => currentStep++}>次のステップ</button>
		</div>
	{/if}
	<!-- ステップ3: 初期設定 -->
	{#if currentStep === 2}
		<div class="card mb-8 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl">
					<span class="mr-2 badge badge-lg badge-primary">STEP 4</span>
					初期設定
				</h2>
				<div class="space-y-6">
					<div>
						<h3 class="mb-2 text-xl font-semibold">Xcode初回起動設定</h3>
						<ol class="ml-4 list-inside list-decimal space-y-2">
							<li>Xcodeを初回起動すると「ライセンス同意」画面が表示される</li>
							<li>「Agree」をクリックしてライセンスに同意</li>
							<li>「Install additional components」が表示されたら「Install」をクリック</li>
							<li>管理者パスワードを入力</li>
							<li>コンポーネントのインストールが完了するまで待つ</li>
						</ol>
					</div>

					<div>
						<h3 class="mb-2 text-xl font-semibold">Apple ID設定（任意）</h3>
						<ol class="ml-4 list-inside list-decimal space-y-2">
							<li>Xcode → Preferences → Accounts を開く</li>
							<li>「+」ボタンをクリック</li>
							<li>「Apple ID」を選択</li>
							<li>Apple IDとパスワードを入力</li>
							<li>「Sign In」をクリック</li>
						</ol>
						<div class="mt-2 alert alert-info">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								class="h-6 w-6 shrink-0 stroke-current"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path></svg
							>
							<span
								>実機でのテストや配布には必要ですが、シミュレーターでの学習なら後でも大丈夫です。</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="mb-4 flex justify-between">
			<button class="btn btn-outline" onclick={() => currentStep--}>前のステップ</button>
			<button class="btn btn-primary" onclick={() => currentStep++}>次のステップ</button>
		</div>
	{/if}

	<!-- ステップ4: 動作確認 -->
	{#if currentStep === 3}
		<div class="card mb-8 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl">
					<span class="mr-2 badge badge-lg badge-success">STEP 4</span>
					動作確認
				</h2>
				<p class="mb-4 text-lg">
					Hello Worldアプリを作って、環境が正しく設定されているか確認しましょう！
				</p>

				<div class="space-y-4">
					<h3 class="text-xl font-semibold">プロジェクト作成手順</h3>
					<ol class="ml-4 list-inside list-decimal space-y-2">
						<li>Xcodeを起動</li>
						<li>「Create a new Xcode project」をクリック</li>
						<li>「iOS」タブを選択</li>
						<li>「App」を選択して「Next」をクリック</li>
						<li>
							プロジェクト情報を入力：
							<div class="mt-2 overflow-x-auto">
								<table class="table table-zebra">
									<thead>
										<tr>
											<th>設定項目</th>
											<th>設定値</th>
											<th>説明</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Product Name</td>
											<td>&lt;&lt;名前&gt;&gt;Playground</td>
											<td>プロジェクトの名前を設定</td>
										</tr>
										<tr>
											<td>Team</td>
											<td>None</td>
											<td>開発チームを選択（個人開発の場合はNone）</td>
										</tr>
										<tr>
											<td>Organization Identifier</td>
											<td>com</td>
											<td>組織識別子（個人の場合はcomで十分）</td>
										</tr>
										<tr>
											<td>Interface</td>
											<td>SwiftUI</td>
											<td>UIフレームワークを選択</td>
										</tr>
										<tr>
											<td>Language</td>
											<td>Swift</td>
											<td>プログラミング言語を選択</td>
										</tr>
										<tr>
											<td>Testing System</td>
											<td>None</td>
											<td>テストシステム（学習用では不要）</td>
										</tr>
										<tr>
											<td>Storage</td>
											<td>SwiftData</td>
											<td>データ保存方式を選択</td>
										</tr>
									</tbody>
								</table>
							</div>
						</li>
						<li>「Next」をクリック</li>
						<li>保存場所を選択して「Create」をクリック</li>
					</ol>

					<h3 class="text-xl font-semibold">動作確認</h3>
					<ol class="ml-4 list-inside list-decimal space-y-2">
						<li>プロジェクトが開いたら、画面上部の再生ボタン（▶️）をクリック</li>
						<li>シミュレーターが起動する（初回は時間がかかります）</li>
						<li>「Hello, world!」と表示されれば成功！</li>
					</ol>

					<div class="alert alert-success">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 shrink-0 stroke-current"
							fill="none"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/></svg
						>
						<div>
							<h3 class="font-bold">おめでとうございます！</h3>
							<p>Swift開発環境の構築が完了しました。これで本格的な学習を始められます。</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mb-4 flex justify-between">
			<button class="btn btn-outline" onclick={() => currentStep--}>前のステップ</button>
			<div class="flex gap-2">
				<a href="{base}/tutorial" class="btn btn-primary">チュートリアルを始める</a>
			</div>
		</div>
		{/if}
		<a href="{base}/help" class="btn btn-outline">ヘルプ</a>
</div>
