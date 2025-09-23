<script>
	import { base } from '$app/paths';
	import quizData from '$lib/data/quiz.json';

	// クイズIDとチートシートセクションの対応関係
	const quizToCheatsheetMap = {
		'1': 'basic-syntax',
		'2': 'basic-syntax',
		'3': 'control-structures',
		'4': 'collections',
		'5': 'functions',
		'6': 'basic-syntax'
	};
</script>

<div class="container mx-auto p-4">
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each quizData.sections as section}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">{section.title}</h2>
					<p class="mb-4">{section.description}</p>
					<div class="card-actions justify-end">
						<a
							href="{base}/cheatsheet#{quizToCheatsheetMap[section.id] || 'basic-syntax'}"
							class="btn btn-outline btn-info"
							target="_blank"
						>
							予習
						</a>
						<a href="{base}/quiz/{section.id}" class="btn btn-primary">問題を解く</a>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
