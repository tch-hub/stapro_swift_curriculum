<script>
	import { base, resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import quizData from '$lib/data/quiz.json';

	// スコア保存用のプレフィックス
	const scoreStoragePrefix = 'quiz-score-';

	let storedScores = {};

	onMount(() => {
		if (typeof localStorage === 'undefined') {
			return;
		}
		const gathered = {};
		for (const section of quizData.sections) {
			const raw = localStorage.getItem(scoreStoragePrefix + section.id);
			if (!raw) {
				continue;
			}
			try {
				gathered[section.id] = JSON.parse(raw);
			} catch {
				continue;
			}
		}
		storedScores = gathered;
	});
</script>

<div class="container mx-auto p-4" data-base={base}>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each quizData.sections as section (section.id)}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">{section.title}</h2>
					<p class="mb-4">{section.description}</p>
					{#if storedScores[section.id]?.cheated}
						<div class="mb-2 alert alert-warning">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<span class="text-sm">不正スコアが検知されました</span>
						</div>
					{/if}
					<div class="text-right text-sm text-base-content/70">
						<p>ハイスコア: {storedScores[section.id]?.highScore ?? '記録なし'}</p>
						<p>前回のスコア: {storedScores[section.id]?.lastScore ?? '記録なし'}</p>
					</div>
					<div class="card-actions justify-end">
						<a href={resolve('/quiz/' + section.id)} class="btn btn-primary">問題を解く</a>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
