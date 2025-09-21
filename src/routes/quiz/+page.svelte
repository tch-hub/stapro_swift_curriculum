<script>
	import { base } from '$app/paths';
	import quizData from '$lib/data/quiz.json';
</script>

<div class="container mx-auto p-4">
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each quizData.sections as section}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">{section.title}</h2>
					<p class="mb-4">{section.description}</p>
					<div class="card-actions justify-end">
						<a href="{base}/quiz/{section.id}" class="btn btn-primary">問題を解く</a>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
