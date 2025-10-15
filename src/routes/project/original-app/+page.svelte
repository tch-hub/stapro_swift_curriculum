<script>
	import { base } from '$app/paths';
	import OriginalAppDemo from '$lib/components/OriginalAppDemo.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">オリジナルアプリプロジェクト</h1>
	<p class="mb-12 text-center text-lg">
		これまで学んだことを活かして、自分だけのオリジナルアプリ開発に挑戦しましょう！
	</p>

	<!-- プロジェクト概要 -->
	<div class="card mb-8 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">プロジェクト概要</h2>
			<p class="mb-4">
				このプロジェクトでは、企画から設計、実装までのアプリ開発の一連の流れを体験します。これまで学習したSwiftUIの知識を応用して、完全にオリジナルのアプリを開発することを目指します。
			</p>
			<p class="mb-4">学習のゴール：</p>
			<ul class="mb-4 list-inside list-disc">
				<li>timerとtodolistで学んだ知識を応用し、定着させる</li>
				<li>アイデアを形にするプロセス（企画、設計、実装、テスト）を学ぶ</li>
				<li>問題解決能力と創造性を養う</li>
			</ul>
		</div>
	</div>

	<!-- アプリのアイデア例 -->
	<div class="mb-8">
		<h2 class="mb-6 text-3xl font-bold">アプリのアイデア例</h2>
		<p class="mb-6">
			どんなアプリを作れば良いか分からない人のために、いくつかアイデアの例を紹介します。これらの例を参考にしたり、組み合わせたり、まったく新しいものを考えたりしてみましょう。
		</p>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- 勉強時間トラッカー -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<h3 class="card-title">勉強時間トラッカー</h3>
					<p>教科ごとに勉強した時間を記録するアプリです。</p>
					<p class="mt-2 font-bold">応用できる知識：</p>
					<ul class="list-inside list-disc">
						<li>タイマー機能 (Timerプロジェクト)</li>
						<li>リスト表示 (TodoListプロジェクト)</li>
						<li>データ保存 (TodoListプロジェクト)</li>
					</ul>
				</div>
			</div>
			<!-- 習慣化アプリ -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<h3 class="card-title">習慣化アプリ</h3>
					<p>毎日続けたいこと（例：読書、運動）を記録し、達成度を可視化するアプリです。</p>
					<p class="mt-2 font-bold">応用できる知識：</p>
					<ul class="list-inside list-disc">
						<li>タスク管理 (TodoListプロジェクト)</li>
						<li>達成度の可視化（プログレスバーなど）</li>
						<li>通知機能</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<!-- デモアプリ -->
	<OriginalAppDemo />

	<!-- 制作ステップ -->
	<div class="mb-8">
		<h2 class="mb-6 text-3xl font-bold">制作ステップ</h2>
		<p class="mb-6">
			アプリ開発を5つのステップで段階的に進めましょう。各ステップで何をすべきか詳しく説明します。
		</p>

		<div class="space-y-4">
			<!-- ステップ1 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">ステップ1: アプリのアイデアを考えよう</h3>
							<p class="text-sm opacity-70">自分が作りたいアプリのアイデアを出す</p>
						</div>
						<a href="{base}/project/original-app/step1" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>

			<!-- ステップ2 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">ステップ2: アプリの設計図を描いてみよう</h3>
							<p class="text-sm opacity-70">画面のデザインやレイアウトを決める</p>
						</div>
						<a href="{base}/project/original-app/step2" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>

			<!-- ステップ3 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">ステップ3: 必要な機能を洗い出そう</h3>
							<p class="text-sm opacity-70">アプリに必要な機能をリストアップする</p>
						</div>
						<a href="{base}/project/original-app/step3" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>

			<!-- ステップ4 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">ステップ4: プロジェクトをセットアップしよう</h3>
							<p class="text-sm opacity-70">Xcodeで新規プロジェクトを作成する</p>
						</div>
						<a href="{base}/project/original-app/step4" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>

			<!-- ステップ5 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">ステップ5: 機能を実装してみよう</h3>
							<p class="text-sm opacity-70">設計図と機能リストをもとに開発を進める</p>
						</div>
						<a href="{base}/project/original-app/step5" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
