import { error } from '@sveltejs/kit';
import { stepsByProject } from '$lib/data/projects/index';

const markdownMaps = {
	timer: import.meta.glob('../../../../lib/steps/timer/*.md', { query: '?raw', import: 'default' }),
	todolist: import.meta.glob('../../../../lib/steps/todolist/*.md', {
		query: '?raw',
		import: 'default'
	}),
	'original-app': import.meta.glob('../../../../lib/steps/original-app/*.md', {
		query: '?raw',
		import: 'default'
	})
};

export async function load({ params }) {
	const { id, step } = params;
	const steps = stepsByProject[id];

	if (!steps) {
		throw error(404, 'ステップが見つかりません。');
	}

	const stepIndex = steps.findIndex((item) => item.id === step);
	if (stepIndex === -1) {
		throw error(404, 'ステップが見つかりません。');
	}

	const markdownFiles = markdownMaps[id];
	const loaderKey = `../../../../lib/steps/${id}/${step}.md`;
	const loader = markdownFiles ? markdownFiles[loaderKey] : null;

	if (!loader) {
		throw error(404, 'マークダウンが読み込めません。');
	}

	const rawContent = await loader();
	const content = rawContent.replace(/^---\n[\s\S]*?\n---\n*/, '');

	return {
		projectId: id,
		stepId: step,
		title: steps[stepIndex].title,
		summary: steps[stepIndex].summary,
		content,
		prevStep: stepIndex > 0 ? steps[stepIndex - 1] : null,
		nextStep: stepIndex < steps.length - 1 ? steps[stepIndex + 1] : null,
		allSteps: steps
	};
}
