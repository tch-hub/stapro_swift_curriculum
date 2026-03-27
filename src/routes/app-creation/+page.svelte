<script>
	import { base, resolve } from '$app/paths';
	import { appCreations } from '$lib/data/app-creation/index';
</script>

<div class="container mx-auto px-4 py-8" data-base={base}>
	<h1 class="mb-8 text-center text-4xl font-bold">アプリ制作</h1>
	<p class="mb-12 text-center text-lg">学習した内容を活かして、実際にiOSアプリを作成しましょう！</p>

	<!-- アプリ制作一覧 -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each appCreations as appCreation (appCreation.id)}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title text-2xl">{appCreation.title}</h2>
					<p class="mb-4">{appCreation.summary}</p>
					<div class="card-actions justify-between">
						<a href={resolve('/app-creation/' + appCreation.id)} class="btn btn-primary">詳細を見る</a>
						{#if appCreation.downloadUrl}
							<a href={resolve(appCreation.downloadUrl)} download class="btn btn-outline">
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

	<!-- アプリ制作の説明 -->
	<div class="mt-16">
		<h2 class="mb-6 text-3xl font-bold">アプリ制作について</h2>
		<p class="mb-4">
			各アプリ制作には、完成したサンプルコードとアプリ制作ファイルが含まれています。
			ダウンロードしてXcodeで開き、コードを読みながら学習を進めましょう。
		</p>
		<p class="mb-4">
			アプリ制作を通じて、Swiftの基本文法、UI構築、状態管理、アニメーションなどの実践的なスキルを身につけることができます。
		</p>
	</div>
</div>
