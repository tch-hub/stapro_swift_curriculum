<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">プロジェクト</h1>
	<p class="mb-12 text-center text-lg">学習した内容を活かして、実際にiOSアプリを作成しましょう！</p>

	<!-- プロジェクト一覧 -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		<!-- タイマーアプリプロジェクト -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl">タイマーアプリ</h2>
				<p class="mb-4">
					シンプルなタイマーアプリを作成します。時間設定、カウントダウン、アラーム機能を実装します。
				</p>
				<div class="card-actions justify-between">
					<a href="{base}/project/timer" class="btn btn-primary">詳細を見る</a>
					<a href="{base}/source/Timer.zip" download class="btn btn-outline">ダウンロード</a>
				</div>
			</div>
		</div>

		<!-- ToDoリストアプリプロジェクト -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl">ToDoリストアプリ</h2>
				<p class="mb-4">
					SwiftDataとMVVMアーキテクチャを採用した本格的なToDoリストアプリを作成します。
				</p>
				<div class="card-actions justify-between">
					<a href="{base}/project/todolist" class="btn btn-primary">詳細を見る</a>
					<a href="{base}/source/ToDoLitst.zip" download class="btn btn-outline">ダウンロード</a>
				</div>
			</div>
		</div>

		<!-- オリジナルアプリプロジェクト -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl">オリジナルアプリ</h2>
				<p class="mb-4">学んだ知識を総動員して、自分だけのオリジナルアプリ開発に挑戦しましょう！</p>
				<div class="card-actions justify-between">
					<a href="{base}/project/original-app" class="btn btn-primary">詳細を見る</a>
					<span class="btn-disabled btn btn-outline">ダウンロード</span>
				</div>
			</div>
		</div>
	</div>

	<!-- プロジェクトの説明 -->
	<div class="mt-16">
		<h2 class="mb-6 text-3xl font-bold">プロジェクトについて</h2>
		<p class="mb-4">
			各プロジェクトには、完成したサンプルコードとプロジェクトファイルが含まれています。
			ダウンロードしてXcodeで開き、コードを読みながら学習を進めましょう。
		</p>
		<p class="mb-4">
			プロジェクトを通じて、Swiftの基本文法、UI構築、状態管理、アニメーションなどの実践的なスキルを身につけることができます。
		</p>
	</div>
</div>
