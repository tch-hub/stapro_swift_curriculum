<script>
	import { base, resolve } from '$app/paths';
	import quizData from '$lib/data/quiz.json';

	// 練習問題IDとswift基本構文セクションの対応関係
	const quizToCheatsheetMap = {
		'1': 'basic-syntax',
		'2': 'basic-syntax',
		'3': 'control-structures',
		'4': 'collections',
		'5': 'functions',
		'6': 'basic-syntax'
	};
</script>

<div class="container mx-auto p-4" data-base={base}>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each quizData.sections as section (section.id)}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">{section.title}</h2>
					<p class="mb-4">{section.description}</p>
					<div class="card-actions justify-end">
						<a
							href={resolve('/cheatsheet#' + (quizToCheatsheetMap[section.id] || 'basic-syntax'))}
							class="btn btn-outline btn-info"
							target="_blank"
						>
							予習
						</a>
						<a href={resolve('/quiz/' + section.id)} class="btn btn-primary">問題を解く</a>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
