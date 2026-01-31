<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	export let codeSamples = [];
	// codeSamples type: { title: string, code: string, fileName?: string }[]

	let activeIndex = 0;
</script>

<div class="flex flex-col gap-4">
	<div role="tablist" class="tabs-boxed tabs overflow-x-auto bg-base-200 p-2">
		{#each codeSamples as sample, index (sample.fileName || sample.title || index)}
			<button
				role="tab"
				class="tab-md tab whitespace-nowrap {activeIndex === index
					? 'tab-active bg-primary text-primary-content shadow-sm'
					: ''} transition-all duration-200"
				aria-selected={activeIndex === index}
				aria-controls="code-panel-{index}"
				id="code-tab-{index}"
				on:click={() => (activeIndex = index)}
			>
				{sample.fileName || sample.title}
			</button>
		{/each}
	</div>

	<div
		class="rounded-box border border-base-300 bg-base-100 p-0 shadow-sm"
		role="tabpanel"
		id="code-panel-{activeIndex}"
		aria-labelledby="code-tab-{activeIndex}"
	>
		{#if codeSamples[activeIndex]}
			<div class="-my-4 p-1">
				<CodeBlock
					title={codeSamples[activeIndex].title}
					code={codeSamples[activeIndex].code}
					fileName={codeSamples[activeIndex].fileName}
					showLineNumbers={true}
					showHeader={true}
				/>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Make scrollbar cleaner for tabs if many files */
	.tabs::-webkit-scrollbar {
		height: 4px;
	}
	.tabs::-webkit-scrollbar-track {
		background: transparent;
	}
	.tabs::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.1);
		border-radius: 2px;
	}
</style>
