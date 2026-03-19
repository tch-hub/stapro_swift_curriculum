import { error } from '@sveltejs/kit';
import { swiftuiBasicsSteps } from '$lib/data/projects/index';

const markdownFiles = import.meta.glob('../../../lib/markdown/swiftui-basics/*.md', {
	query: '?raw',
	import: 'default'
});

function stripFrontmatter(rawContent) {
	return rawContent.replace(/^---\n[\s\S]*?\n---\n*/, '');
}

export async function load({ params }) {
	const { id } = params;
	const steps = swiftuiBasicsSteps;

	const stepIndex = steps.findIndex((item) => item.id === id);
	if (stepIndex === -1) {
		throw error(404, '項目が見つかりません。');
	}

	const loaderKey = `../../../lib/markdown/swiftui-basics/${id}.md`;
	const loader = markdownFiles[loaderKey];

	if (!loader) {
		throw error(404, 'マークダウンが読み込めません。');
	}

	const rawContent = await loader();
	const content = stripFrontmatter(rawContent);

	return {
		id,
		title: steps[stepIndex].title,
		summary: steps[stepIndex].summary,
		content,
		prevStep: stepIndex > 0 ? steps[stepIndex - 1] : null,
		nextStep: stepIndex < steps.length - 1 ? steps[stepIndex + 1] : null,
		allSteps: steps
	};
}
