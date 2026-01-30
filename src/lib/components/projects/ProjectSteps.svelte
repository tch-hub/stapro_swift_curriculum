<script>
	import { resolve } from '$app/paths';

	export let steps = [];
	export let projectId = ''; // 'timer', 'todolist', etc.
</script>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
	{#each steps as step (step.id)}
		<a
			href={resolve('/project/' + projectId + '/' + step.id)}
			class="card h-full bg-base-100 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl focus:ring-2 focus:ring-primary focus:outline-none"
			aria-label={step.title + 'へ移動'}
		>
			<div class="card-body p-6">
				<div class="mb-2 flex items-center justify-between">
					<span class="badge badge-outline text-xs badge-primary"
						>Step {step.id.replace('step', '')}</span
					>
				</div>
				<h3 class="card-title line-clamp-2 text-lg leading-tight font-bold">
					{step.title.replace(/^ステップ\d+:\s*/, '')}
				</h3>
				<p class="mt-2 line-clamp-3 text-sm text-base-content/70">{step.summary}</p>
				<div class="mt-4 flex justify-end">
					<span class="btn btn-outline btn-sm btn-primary">開始</span>
				</div>
			</div>
		</a>
	{/each}
</div>
