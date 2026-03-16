<script>
	import { base, resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	// 現在のステップを管理する変数
	let currentStep = $state(0);
	const maxStep = 4;

	// OSの検出結果を管理
	let isMac = $state(true); // デフォルトはtrueにしてサーバーサイドでエラーにならないように

	// 検索チュートリアル管理
	const searchTutorialStorageKey = 'setup-search-tutorial-step';
	const searchTutorialCompletedStorageKey = 'setup-search-tutorial-completed';
	let searchTutorialStep = $state(0);
	let searchTutorialCompleted = $state(false);
	let highlightRect = $state(null);
	let missionTooltipStyle = $state('');

	const searchTutorialSteps = [
		{
			title: 'テキスト選択で検索',
			description:
				'テキストを選択してみましょう。選択すると画面上に「検索」ボタンが出ます。',
			targetSelector: '[data-search-tutorial="practice-text"]',
			actionLabel: 'テキストを選択する',
			tip: 'サイト内のどのテキストでも使えます'
		},
		{
			title: '右下の虫眼鏡ボタンで検索',
			description: '画面右下の虫眼鏡ボタンをクリックして、ドキュメント検索を開きましょう。',
			targetSelector: '[aria-label="検索を開く"]',
			actionLabel: '虫眼鏡ボタンをクリックする',
			tip: 'タブレットなどのタッチ操作でも使いやすい方法です'
		},
		{
			title: '右クリックから検索',
			description: 'ページ内の任意の場所で右クリックして、メニューから検索を選びましょう。',
			targetSelector: '[data-search-tutorial="practice-text"]',
			actionLabel: 'ページ内で右クリックする',
			tip: '選択中の文字列をそのまま検索できます。右クリックメニューにキーボードショートカットも表示されます。'
		}
	];

	function getActiveSearchTutorial() {
		return searchTutorialSteps[searchTutorialStep];
	}

	function isSearchTutorialActive() {
		return currentStep === 4 && !searchTutorialCompleted;
	}

	// ステップデータの定義
	const steps = [
		{ title: 'システム要件確認', completed: true },
		{ title: 'Xcodeインストール', completed: true },
		{ title: '初期設定', completed: true },
		{ title: '動作確認', completed: false },
		{ title: 'ドキュメント検索チュートリアル', completed: false }
	];

	function updateHighlightRect() {
		const activeSearchTutorial = getActiveSearchTutorial();
		if (!isSearchTutorialActive() || !activeSearchTutorial?.targetSelector) {
			highlightRect = null;
			missionTooltipStyle = '';
			return;
		}

		const target = document.querySelector(activeSearchTutorial.targetSelector);
		if (!target) {
			highlightRect = null;
			missionTooltipStyle = '';
			return;
		}

		const rect = target.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		const viewportWidth = window.innerWidth;

		// 要素が画面外に完全に出ている場合はハイライトを非表示にする
		if (rect.bottom < 0 || rect.top > viewportHeight || rect.right < 0 || rect.left > viewportWidth) {
			highlightRect = null;
			missionTooltipStyle = '';
			return;
		}

		highlightRect = {
			top: Math.max(rect.top - 8, 0),
			left: Math.max(rect.left - 8, 0),
			width: rect.width + 16,
			height: rect.height + 16
		};

		// 画面外に部分的に出ている場合、ハイライト矩形を調整
		if (rect.top - 8 < 0) {
			// 上側が画面外に出ている場合、高さを調整
			highlightRect.height = highlightRect.height + (rect.top - 8);
		}
		if (rect.left - 8 < 0) {
			// 左側が画面外に出ている場合、幅を調整
			highlightRect.width = highlightRect.width + (rect.left - 8);
		}

		const tooltipWidth = 360;
		const tooltipHeight = 170;
		const margin = 12;

		let tooltipLeft = highlightRect.left + highlightRect.width / 2 - tooltipWidth / 2;
		tooltipLeft = Math.max(margin, Math.min(tooltipLeft, viewportWidth - tooltipWidth - margin));

		let tooltipTop = highlightRect.top + highlightRect.height + margin;
		if (tooltipTop + tooltipHeight > viewportHeight - margin) {
			tooltipTop = Math.max(margin, highlightRect.top - tooltipHeight - margin);
		}

		missionTooltipStyle = `left: ${tooltipLeft}px; top: ${tooltipTop}px; width: min(${tooltipWidth}px, calc(100vw - ${margin * 2}px));`;
	}

	function persistSearchTutorial() {
		localStorage.setItem(searchTutorialStorageKey, String(searchTutorialStep));
		localStorage.setItem(searchTutorialCompletedStorageKey, searchTutorialCompleted ? '1' : '0');
	}

	function completeSearchTutorial() {
		searchTutorialCompleted = true;
		highlightRect = null;
		missionTooltipStyle = '';
		persistSearchTutorial();
	}

	function nextSearchTutorialStep() {
		if (searchTutorialStep >= searchTutorialSteps.length - 1) {
			completeSearchTutorial();
			return;
		}
		searchTutorialStep += 1;
		persistSearchTutorial();
		requestAnimationFrame(updateHighlightRect);
	}

	function prevSearchTutorialStep() {
		if (searchTutorialStep <= 0) {
			return;
		}
		searchTutorialStep -= 1;
		persistSearchTutorial();
		requestAnimationFrame(updateHighlightRect);
	}

	function skipSearchTutorial() {
		completeSearchTutorial();
	}

	function resetSearchTutorial() {
		searchTutorialStep = 0;
		searchTutorialCompleted = false;
		persistSearchTutorial();
		requestAnimationFrame(updateHighlightRect);
	}

	function detectSearchTutorialAction(event) {
		if (!isSearchTutorialActive()) {
			return;
		}

		if (searchTutorialStep === 0) {
			const text = window.getSelection()?.toString().trim() ?? '';
			if (text.length > 0) {
				nextSearchTutorialStep();
			}
			return;
		}

		if (searchTutorialStep === 1) {
			const target = event.target;
			if (target && target.closest?.('[aria-label="検索を開く"]')) {
				nextSearchTutorialStep();
			}
			return;
		}

		if (searchTutorialStep === 2) {
			if (event.type === 'contextmenu') {
				nextSearchTutorialStep();
			}
			return;
		}
	}

	function moveToNextStep() {
		currentStep = Math.min(currentStep + 1, maxStep);
		requestAnimationFrame(updateHighlightRect);
	}

	function moveToPrevStep() {
		currentStep = Math.max(currentStep - 1, 0);
		requestAnimationFrame(updateHighlightRect);
	}

	// クライアントサイドでOSを検出
	onMount(() => {
		const platform = navigator.platform.toLowerCase();
		const userAgent = navigator.userAgent.toLowerCase();
		isMac = platform.includes('mac') || userAgent.includes('mac');

		const savedStep = Number(localStorage.getItem(searchTutorialStorageKey) ?? 0);
		if (Number.isFinite(savedStep)) {
			searchTutorialStep = Math.min(Math.max(savedStep, 0), searchTutorialSteps.length - 1);
		}
		searchTutorialCompleted = localStorage.getItem(searchTutorialCompletedStorageKey) === '1';

		const handleScrollOrResize = () => updateHighlightRect();
		const handleMouseup = (event) => detectSearchTutorialAction(event);
		const handleClick = (event) => detectSearchTutorialAction(event);
		const handleContextmenu = (event) => detectSearchTutorialAction(event);
		const handleKeydown = (event) => detectSearchTutorialAction(event);

		window.addEventListener('scroll', handleScrollOrResize, true);
		window.addEventListener('resize', handleScrollOrResize);
		window.addEventListener('mouseup', handleMouseup, true);
		window.addEventListener('click', handleClick, true);
		window.addEventListener('contextmenu', handleContextmenu, true);
		window.addEventListener('keydown', handleKeydown, true);

		requestAnimationFrame(updateHighlightRect);

		return () => {
			window.removeEventListener('scroll', handleScrollOrResize, true);
			window.removeEventListener('resize', handleScrollOrResize);
			window.removeEventListener('mouseup', handleMouseup, true);
			window.removeEventListener('click', handleClick, true);
			window.removeEventListener('contextmenu', handleContextmenu, true);
			window.removeEventListener('keydown', handleKeydown, true);
		};
	});
</script>

<div class="container mx-auto px-4 py-8" data-base={base}>
	<!-- 進行状況表示 -->
	<div class="steps steps-vertical mb-8 w-full lg:steps-horizontal">
		{#each steps as step, index (step.title + '-' + index)}
			<button
				type="button"
				class="step {index <= currentStep ? 'step-primary' : ''}"
				onclick={() => {
					currentStep = index;
					requestAnimationFrame(updateHighlightRect);
				}}
			>
				{step.title}
			</button>
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
				{#if !isMac}
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
							<p>
								Swiftの開発には<strong>Mac</strong>が必要です。WindowsやLinuxでは開発できません。
							</p>
						</div>
					</div>
				{/if}
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
			<button class="btn btn-primary" onclick={moveToNextStep}>次のステップ</button>
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
					</div>
				</div>
			</div>
		</div>

		<div class="card mb-8 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl">SF Symbolsアプリをダウンロード</h2>
				<p class="mb-4 text-lg">Swiftでアイコンを使用する際に便利なツールです。</p>

				<div class="card bg-base-200">
					<div class="card-body">
						<h3 class="card-title">App Storeからインストール</h3>
						<ol class="list-inside list-decimal space-y-2">
							<li>
								<a href="https://developer.apple.com/jp/sf-symbols/" class="underline"
									>ダウンロードリンク</a
								>からSF Symbolsアプリをダウンロードします
							</li>
							<li>「ダウンロード」ボタンをクリック</li>
							<li>ダウンロードが完了したら、Launchpadから「SF Symbols」を起動</li>
							<li>
								Xcodeで使用したいシンボルを検索して、その名前をコピーして利用することができます
							</li>
						</ol>
					</div>
				</div>
			</div>
		</div>
		<div class="mb-4 flex justify-between">
			<button class="btn btn-outline" onclick={moveToPrevStep}>前のステップ</button>
			<button class="btn btn-primary" onclick={moveToNextStep}>次のステップ</button>
		</div>
	{/if}
	<!-- ステップ3: 初期設定 -->
	{#if currentStep === 2}
		<div class="card mb-8 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl">
					<span class="mr-2 badge badge-lg badge-primary">STEP 3</span>
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
						<h3 class="mb-2 text-xl font-semibold">
							Apple ID設定（任意）<span class="text-sm"
								>※実機でのテストや配布には必要ですが、シミュレーターでの学習なら後でも大丈夫です。</span
							>
						</h3>
						<ol class="ml-4 list-inside list-decimal space-y-2">
							<li>Xcode → Preferences → Accounts を開く</li>
							<li>「+」ボタンをクリック</li>
							<li>「Apple ID」を選択</li>
							<li>Apple IDとパスワードを入力</li>
							<li>「Sign In」をクリック</li>
						</ol>
					</div>
				</div>
			</div>
		</div>
		<div class="mb-4 flex justify-between">
			<button class="btn btn-outline" onclick={moveToPrevStep}>前のステップ</button>
			<button class="btn btn-primary" onclick={moveToNextStep}>次のステップ</button>
		</div>
	{/if}

	<!-- ステップ4: 動作確認 -->
	{#if currentStep === 3}
		<div class="card mb-8 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl">
					<span class="mr-2 badge badge-lg badge-primary">STEP 4</span>
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
											<td>Playground</td>
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
				</div>
			</div>
		</div>

		<div class="mb-4 flex justify-between">
			<button class="btn btn-outline" onclick={moveToPrevStep}>前のステップ</button>
			<button class="btn btn-primary" onclick={moveToNextStep}>次のステップ</button>
		</div>
	{/if}

	<!-- ステップ5: ドキュメント検索機能の紹介 -->
	{#if currentStep === 4}
		<div class="card mb-8 bg-base-100 shadow-xl">
			<div class="card-body gap-6">
				<h2 class="card-title text-2xl">
					<span class="mr-2 badge badge-lg badge-primary">STEP 5</span>
					ドキュメント検索機能の紹介
				</h2>

				<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{#each searchTutorialSteps as tutorialStep, index (tutorialStep.title + '-' + index)}
						<div
							class={`rounded-lg border px-3 py-2.5 transition-all ${
								searchTutorialCompleted || index < searchTutorialStep
									? 'border-success/40 bg-success/5'
									: index === searchTutorialStep && !searchTutorialCompleted
										? 'border-primary/50 bg-primary/10 shadow-sm'
										: 'border-base-300 bg-base-200/70'
							}`}
						>
							<div class="flex items-start justify-between gap-2">
								<div class="min-w-0">
									<p class="text-[10px] font-semibold tracking-[0.12em] text-base-content/55">MISSION {index + 1}</p>
									<h3 class="mt-0.5 truncate text-sm font-bold">{tutorialStep.title}</h3>
								</div>
								{#if searchTutorialCompleted || index < searchTutorialStep}
									<span class="badge badge-success badge-sm">完了</span>
								{:else if index === searchTutorialStep && !searchTutorialCompleted}
									<span class="badge badge-primary badge-sm">進行中</span>
								{:else}
									<span class="badge badge-outline badge-sm">待機中</span>
								{/if}
							</div>
							<p class="mt-1 text-xs text-base-content/70">{tutorialStep.actionLabel}</p>
						</div>
					{/each}
				</div>

				<CodeBlock
					title="練習エリア"
					description="このコード内から用語を選択して検索を試してみましょう。選択・右クリック・ショートカットをここで練習できます。"
					language="swift"
					dataAttribute="practice-text"
					code={'import SwiftUI\nimport SwiftData\n\n@Model\nfinal class Item {\n    var title: String\n    var isDone: Bool = false\n}\n\nstruct ContentView: View {\n    var items: [Item] = []\n    \n    var body: some View {\n        NavigationStack {\n            List(items) { item in\n                Text(item.title)\n            }\n        }\n    }\n}'}
					showLineNumbers={true}
				/>

				<div class="divider"></div>

				<div class="space-y-4">
					<h3 class="text-xl font-semibold">検索フィルタの違い</h3>
					<p class="text-base-content/75">
						ドキュメント検索には3つのフィルタがあります。目的に応じて使い分けることで、効率的に情報を見つけられます。
					</p>
					<div class="grid gap-4 md:grid-cols-3">
						<div class="rounded-lg border border-primary/20 bg-primary/5 p-4">
							<h4 class="mb-2 font-bold text-primary">タイトル一致</h4>
							<p class="text-sm text-base-content/75">
								ドキュメントのタイトルが検索キーワードと完全に一致するもののみを表示します。
							</p>
							<div class="mt-3 rounded bg-base-100 p-2 font-mono text-xs">
								例: "NavigationStack" → 「NavigationStack」というタイトルのドキュメントのみ
							</div>
						</div>
						<div class="rounded-lg border border-success/20 bg-success/5 p-4">
							<h4 class="mb-2 font-bold text-success">コード</h4>
							<p class="text-sm text-base-content/75">
								コード例が含まれるドキュメントから検索します。実装例や使用法を知りたい時に便利です。
							</p>
							<div class="mt-3 rounded bg-base-100 p-2 font-mono text-xs">
								例: "List" → ListUIを使用しているコード例が見つかる
							</div>
						</div>
						<div class="rounded-lg border border-info/20 bg-info/5 p-4">
							<h4 class="mb-2 font-bold text-info">キーワード</h4>
							<p class="text-sm text-base-content/75">
								ドキュメント全体（タイトル、説明、コード）から関連キーワードで広く検索します。探しているものが不確かな時に最適です。
							</p>
							<div class="mt-3 rounded bg-base-100 p-2 font-mono text-xs">
								例: "表示" → タイトル、説明、コード内の「表示」に関連するすべてのドキュメント
							</div>
						</div>
					</div>
				</div>

				<div class="flex flex-wrap gap-2">
					<button class="btn btn-outline" onclick={moveToPrevStep}>前のステップ</button>
					<button
						class="btn btn-outline"
						onclick={prevSearchTutorialStep}
						disabled={searchTutorialStep === 0 || searchTutorialCompleted}>ミッションを戻す</button
					>
					<button
						class="btn btn-outline"
						onclick={nextSearchTutorialStep}
						disabled={searchTutorialCompleted}>次へ（手動）</button
					>
					<button
						class="btn btn-ghost"
						onclick={skipSearchTutorial}
						disabled={searchTutorialCompleted}>スキップ</button
					>
					<button class="btn btn-ghost" onclick={resetSearchTutorial}>最初からやり直す</button>
					<a href={resolve('/tutorial')} class="btn btn-primary">チュートリアルを始める</a>
				</div>
			</div>
		</div>
	{/if}

	{#if isSearchTutorialActive() && highlightRect}
		<div class="pointer-events-none fixed inset-0 z-[9998] bg-black/35"></div>
		<div
			class="pointer-events-none fixed z-[9999] rounded-2xl border-2 border-warning shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]"
			style="top: {highlightRect.top}px; left: {highlightRect.left}px; width: {highlightRect.width}px; height: {highlightRect.height}px;"
		></div>
	{/if}

	{#if isSearchTutorialActive() && highlightRect && !searchTutorialCompleted}
		<div
			class="pointer-events-none fixed z-[10000] rounded-xl border border-warning/40 bg-base-100/95 p-4 shadow-2xl backdrop-blur"
			style={missionTooltipStyle}
		>
			<div class="mb-1 text-xs font-bold text-warning">現在のミッション</div>
			<h3 class="text-base leading-tight font-bold">{getActiveSearchTutorial().title}</h3>
			<p class="mt-1 text-sm leading-snug">{getActiveSearchTutorial().description}</p>
			<p class="mt-2 text-xs text-base-content/70">ヒント: {getActiveSearchTutorial().tip}</p>
		</div>
	{/if}
	<a href={resolve('/help')} class="btn btn-outline">ヘルプ</a>
</div>
