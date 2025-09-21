<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Header from '$lib/components/Header.svelte';
	import tutorialData from '$lib/data/tutorial.json';

	$: id = $page.params.id;
	$: section = tutorialData.sections.find((s) => s.id === id);
</script>

{#if section}
	<div class="container mx-auto pb-24">
		{#each section.codeBlocks as codeBlock}
			<div class="card mb-4 bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="flex flex-col gap-6 lg:flex-row">
						<div class="flex-1">
							<CodeBlock title={codeBlock.title} code={codeBlock.code} />
							{#if codeBlock.description}
								<p class="mt-4 text-sm text-base-content opacity-80" style="white-space: pre-wrap;">
									{codeBlock.description}
								</p>
							{/if}
						</div>
						{#if codeBlock.previewImage}
							<div class="mockup-phone" style="transform: scale(0.7); transform-origin: top;">
								<div class="mockup-phone-camera"></div>
								<div class="mockup-phone-display grid place-content-center bg-white text-black">
									<img
										src="{base}{codeBlock.previewImage}"
										alt="{codeBlock.title} プレビュー"
										class="h-full w-full rounded-[2rem] object-cover"
										style="transform: scale({codeBlock.scale || 1.0});"
										on:error={() =>
											(event.target.src = `https://placehold.jp/24/ffffff/000000/300x150.png?text=${encodeURIComponent(codeBlock.title + '\n プレビュー画像')}`)}
									/>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/each}

		<!-- ナビゲーション -->
		<div class="fixed right-0 bottom-0 left-0 z-10 flex justify-between bg-base-100 p-4 shadow-lg">
			{#if parseInt(id) > 1}
				<a href="{base}/tutorial/{parseInt(id) - 1}" class="btn btn-primary">前の項目</a>
			{:else}
				<div></div>
			{/if}
			{#if parseInt(id) < tutorialData.sections.length}
				<a href="{base}/tutorial/{parseInt(id) + 1}" class="btn btn-primary">次の項目</a>
			{:else}
				<div></div>
			{/if}
		</div>
	</div>
{:else}
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-3xl font-bold">ページが見つかりません</h1>
		<p>指定されたチュートリアル項目は存在しません。</p>
		<a href="{base}/tutorial" class="btn btn-primary">チュートリアル一覧に戻る</a>
	</div>
{/if}
