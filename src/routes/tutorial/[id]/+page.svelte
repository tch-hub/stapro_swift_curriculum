<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Header from '$lib/components/Header.svelte';
	import PhoneMockup from '$lib/components/PhoneMockup.svelte';
	import tutorialData from '$lib/data/tutorial.json';

	$: id = $page.params.id;
	$: section = tutorialData.sections.find((s) => s.id === id);

	let prevPage = async () => {
		await goto(`${base}/tutorial?prev=${parseInt(id) - 1}`);
	};

	let nextPage = async () => {
		await goto(`${base}/tutorial?next=${parseInt(id) + 1}`);
	};
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
							<PhoneMockup
								previewImage={codeBlock.previewImage}
								title={codeBlock.title}
								scale={codeBlock.scale || 1.0}
							/>
						{/if}
					</div>
				</div>
			</div>
		{/each}

		<!-- ナビゲーション -->
		<div class="fixed right-0 bottom-0 left-0 z-10 flex justify-between bg-base-100 p-4 shadow-lg">
			{#if parseInt(id) > 1}
				<button onclick={prevPage} class="btn btn-primary">前の項目</button>
			{:else}
				<div></div>
			{/if}
			{#if parseInt(id) < tutorialData.sections.length - 1}
				<button onclick={nextPage} class="btn btn-primary">次の項目</button>
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
