<script>
	import { base, resolve } from '$app/paths';
	import { projects } from '$lib/data/projects';
</script>

<div class="container mx-auto px-4 py-8" data-base={base}>
	<h1 class="mb-8 text-center text-4xl font-bold">プロジェクト</h1>
	<p class="mb-12 text-center text-lg">学習した内容を活かして、実際にiOSアプリを作成しましょう！</p>

	<!-- プロジェクト一覧 -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each projects as project (project.id)}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title text-2xl">{project.title}</h2>
					<p class="mb-4">{project.summary}</p>
					<div class="card-actions justify-between">
						<a href={resolve('/project/' + project.id)} class="btn btn-primary">詳細を見る</a>
						{#if project.downloadUrl}
							<a href={resolve(project.downloadUrl)} download class="btn btn-outline">
								ダウンロード
							</a>
						{:else}
							<span class="btn-disabled btn btn-outline">ダウンロード</span>
						{/if}
					</div>
				</div>
			</div>
		{/each}
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
