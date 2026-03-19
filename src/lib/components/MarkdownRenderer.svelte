<script>
	import CodeBlock from './CodeBlock.svelte';

	// マークダウンをレンダリングするコンポーネント
	const {
		blocks = []
		// マークダウンblockの配列 (type: 'code' | 'html')
	} = $props();
</script>

{#each blocks as block, index (block.type + '-' + index)}
	{#if block.type === 'code'}
		<div class="mb-6 overflow-x-auto">
			{#key block.code}
				<CodeBlock code={block.code} language={block.language} fileName={block.fileName} />
			{/key}
		</div>
	{:else}
		<div class="prose prose-base mb-4 max-w-none">
			{@html block.html}
		</div>
	{/if}
{/each}
