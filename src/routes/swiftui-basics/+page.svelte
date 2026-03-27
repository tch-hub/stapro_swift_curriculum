<script>
	import { base, resolve } from '$app/paths';
	import { swiftuiBasicsSteps } from '$lib/data/app-creation/index';
</script>

<div class="container mx-auto px-4 py-8" data-base={base}>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each swiftuiBasicsSteps as section, index (section.id)}
			<div
				class="card border border-base-300 bg-base-100 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
			>
				<div class="card-body">
					<div class="mb-4 flex items-center">
						<div
							class="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-content"
						>
							{index + 1}
						</div>
						<h2 class="card-title text-lg">
							<a href={resolve('/swiftui-basics/' + section.id)} class="hover:link-accent">
								{section.title}
							</a>
						</h2>
					</div>
					<p class="mb-4 text-sm text-base-content opacity-80">{section.summary}</p>
					<div class="flex items-center justify-end">
						<a href={resolve('/swiftui-basics/' + section.id)} class="btn btn-sm btn-primary"
							>学習する</a
						>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
