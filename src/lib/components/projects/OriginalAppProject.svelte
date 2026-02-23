<script>
	import OriginalAppDemo from '$lib/components/OriginalAppDemo.svelte';
	import ProjectSteps from './ProjectSteps.svelte';
	import Game2048 from './original-app/Game2048.svelte';
	import Game15Puzzle from './original-app/Game15Puzzle.svelte';
	import GameConcentration from './original-app/GameConcentration.svelte';
	import GameLightsOut from './original-app/GameLightsOut.svelte';
	import GameSample from './original-app/GameSample.svelte';

	const originalAppSteps = [
		{
			id: 'step1',
			title: 'ステップ1: アプリ企画・設計・プロジェクト作成',
			summary: 'アプリの計画を立て、XcodeでmacOSアプリを作成し、PLAN.mdに計画を記録する'
		},
		{
			id: 'step2',
			title: 'ステップ2: ファイル構成を整える',
			summary: 'フォルダ・ファイルの骨格を整え、仮の画面を表示できる状態にする'
		},
		{
			id: 'step3',
			title: 'ステップ3: メイン画面の骨格を作る',
			summary: 'ダミーデータを使って画面のレイアウト・画面遷移の構造を確認する'
		},
		{
			id: 'step4',
			title: 'ステップ4: データモデルの実装',
			summary: 'SwiftDataでデータモデルとサービスクラスを実装する'
		},
		{
			id: 'step5',
			title: 'ステップ5: データの表示（Read）',
			summary: 'データベースからデータを取得してリスト表示する'
		},
		{
			id: 'step6',
			title: 'ステップ6: データの追加（Create）',
			summary: '入力フォームを作り、新しいデータを保存できるようにする'
		},
		{
			id: 'step7',
			title: 'ステップ7: データの更新・削除（Update / Delete）',
			summary: 'スワイプ削除・状態切り替え・確認アラートを実装する'
		},
		{
			id: 'step8',
			title: 'ステップ8: UI部品を整える・機能を追加する',
			summary: '検索・並び替え・アニメーションなど使いやすさを高める'
		},
		{
			id: 'step9',
			title: 'ステップ9: デバッグ・バグ修正',
			summary: '全機能の動作確認・よくあるバグの原因と対処法'
		},
		{
			id: 'step10',
			title: 'ステップ10: UI仕上げ・磨き込み',
			summary: '色・フォント・余白を整えてアプリの見た目を仕上げる'
		},
		{
			id: 'step11',
			title: 'ステップ11: 発表・振り返り',
			summary: '完成したアプリを発表し、授業全体を振り返る'
		}
	];
</script>

<div class="container mx-auto max-w-5xl px-4 py-8">
	<div class="mb-12 text-center">
		<h1 class="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
			オリジナルアプリプロジェクト
		</h1>
		<p class="mx-auto max-w-2xl text-lg text-base-content/80">
			これまで学んだことを活かして、自分だけのオリジナルアプリ開発に挑戦しましょう！
		</p>
	</div>

	<!-- プロジェクト概要 -->
	<section class="mb-16">
		<div class="card overflow-hidden bg-base-100 shadow-xl">
			<div class="card-body p-8 sm:p-10">
				<div class="flex flex-col gap-8 lg:flex-row lg:items-start">
					<div class="flex-1">
						<h2 class="mb-4 text-2xl font-bold">プロジェクト概要</h2>
						<p class="mb-6 leading-relaxed">
							このプロジェクトでは、企画から設計、実装までのアプリ開発の一連の流れを体験します。作るアプリの種類・テーマはあなた自身が決めます。ターゲットは
							<strong>macOSアプリ</strong> です（iPhoneと同じSwiftUI・SwiftDataが使えます）。
						</p>
						<div class="mb-6 rounded-lg border border-info/30 bg-info/10 p-4">
							<p class="text-sm">
								💡 <strong>なぜmacOS？</strong> iPhoneアプリは無料の開発者アカウントだと7日ごとにMacと繋いで再インストールが必要です。macOSアプリなら制限なく動かし続けられます！
							</p>
						</div>
						<h3 class="mb-2 font-bold">学習のゴール：</h3>
						<ul class="mb-6 list-inside list-disc space-y-2">
							<li>タイマー・ToDoリストで学んだ知識を応用し、定着させる</li>
							<li>アイデアを形にするプロセス（企画・設計・実装・発表）を体験する</li>
							<li>問題解決能力と創造性を養う</li>
						</ul>
					</div>
					<div class="flex w-full justify-center lg:w-1/3">
						<OriginalAppDemo />
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- アプリのアイデア例 -->
	<section class="mb-16">
		<h2 class="mb-8 text-3xl font-bold">アプリのアイデア例</h2>
		<p class="mb-8 text-lg text-base-content/80">
			どんなアプリを作れば良いか分からない人のために、いくつかアイデアの例を紹介します。これらの例を参考にしたり、組み合わせたり、まったく新しいものを考えたりしてみましょう。
		</p>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- 勉強時間トラッカー -->
			<div
				class="card bg-primary text-primary-content shadow-lg transition-transform hover:-translate-y-1"
			>
				<div class="card-body">
					<h3 class="card-title text-2xl">⏱️ 勉強時間トラッカー</h3>
					<p>教科ごとに勉強した時間を記録するアプリです。</p>
					<div class="mt-4 rounded-lg bg-white/10 p-4">
						<p class="mb-2 text-sm font-bold tracking-wide uppercase opacity-80">応用できる知識</p>
						<ul class="list-inside list-disc space-y-1 text-sm">
							<li>タイマー機能 (Timerプロジェクト)</li>
							<li>リスト表示 (TodoListプロジェクト)</li>
							<li>データ保存 (TodoListプロジェクト)</li>
						</ul>
					</div>
				</div>
			</div>
			<!-- 習慣化アプリ -->
			<div
				class="card bg-secondary text-secondary-content shadow-lg transition-transform hover:-translate-y-1"
			>
				<div class="card-body">
					<h3 class="card-title text-2xl">🎯 習慣化アプリ</h3>
					<p>毎日続けたいこと（例：読書、運動）を記録し、達成度を可視化するアプリです。</p>
					<div class="mt-4 rounded-lg bg-white/10 p-4">
						<p class="mb-2 text-sm font-bold tracking-wide uppercase opacity-80">応用できる知識</p>
						<ul class="list-inside list-disc space-y-1 text-sm">
							<li>タスク管理 (TodoListプロジェクト)</li>
							<li>達成度の可視化（プログレスバーなど）</li>
							<li>通知機能</li>
						</ul>
					</div>
				</div>
			</div>
			<!-- シンプルな計算機 -->
			<div
				class="card bg-accent text-accent-content shadow-lg transition-transform hover:-translate-y-1"
			>
				<div class="card-body">
					<h3 class="card-title text-2xl">🧮 シンプルな計算機</h3>
					<p>
						基本的な四則演算ができる計算機アプリです。デザインを工夫してオリジナルに仕上げましょう。
					</p>
					<div class="mt-4 rounded-lg bg-white/10 p-4">
						<p class="mb-2 text-sm font-bold tracking-wide uppercase opacity-80">応用できる知識</p>
						<ul class="list-inside list-disc space-y-1 text-sm">
							<li>ボタンのレイアウト配置</li>
							<li>状態管理（計算結果の保持）</li>
							<li>UIデザインのセンス</li>
						</ul>
					</div>
				</div>
			</div>
			<!-- メモ帳アプリ -->
			<div
				class="card bg-info text-info-content shadow-lg transition-transform hover:-translate-y-1"
			>
				<div class="card-body">
					<h3 class="card-title text-2xl">📝 メモ帳アプリ</h3>
					<p>
						思いついたことをすぐにメモできるアプリ。カテゴリ分けや検索機能を追加すると便利です。
					</p>
					<div class="mt-4 rounded-lg bg-white/10 p-4">
						<p class="mb-2 text-sm font-bold tracking-wide uppercase opacity-80">応用できる知識</p>
						<ul class="list-inside list-disc space-y-1 text-sm">
							<li>テキスト入力と保存</li>
							<li>リスト表示と編集</li>
							<li>データの永続化</li>
						</ul>
					</div>
				</div>
			</div>
			<!-- 2048ゲーム -->
			<Game2048 />

			<!-- 15パズル -->
			<Game15Puzzle />

			<!-- 神経衰弱 -->
			<GameConcentration />

			<!-- ライツアウト -->
			<GameLightsOut />

			<!-- サンプルゲーム -->
			<GameSample />
		</div>
	</section>

	<!-- 制作ステップ -->
	<section class="mb-16">
		<h2 class="mb-8 text-3xl font-bold">制作ステップ</h2>
		<p class="mb-8 text-lg text-base-content/80">
			macOSアプリの開発を11のステップで段階的に進めましょう。各ステップにはチェックリストと詰まったときの検索キーワードが載っています。
		</p>
		<ProjectSteps steps={originalAppSteps} projectId="original-app" />
	</section>
</div>
