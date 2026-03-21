import { error } from '@sveltejs/kit';
import { stepsByProject } from '$lib/data/projects/index';

const markdownMaps = {
	timer: import.meta.glob('../../../../lib/markdown/timer/*.md', {
		query: '?raw',
		import: 'default'
	}),
	todolist: import.meta.glob('../../../../lib/markdown/todolist/*.md', {
		query: '?raw',
		import: 'default'
	}),
	'original-app': import.meta.glob('../../../../lib/markdown/original-app/*.md', {
		query: '?raw',
		import: 'default'
	})
};

function parseFrontmatter(rawContent) {
	const frontmatterMatch = rawContent.match(/^---\n([\s\S]*?)\n---\n*/);
	if (!frontmatterMatch) {
		return {};
	}

	const frontmatter = {};
	const lines = frontmatterMatch[1].split('\n');

	for (const line of lines) {
		const match = line.match(/^([A-Za-z][\w-]*):\s*(.+)$/);
		if (!match) continue;

		const key = match[1];
		let value = match[2].trim();

		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		frontmatter[key] = value;
	}

	return frontmatter;
}

function stripFrontmatter(rawContent) {
	return rawContent.replace(/^---\n[\s\S]*?\n---\n*/, '');
}

function createShowcaseImageAlt(stepId) {
	return stepId ? `${stepId}の完成イメージ` : '完成イメージ';
}

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
	const loaderKey = `../../../../lib/markdown/${id}/${step}.md`;
	const loader = markdownFiles ? markdownFiles[loaderKey] : null;

	if (!loader) {
		throw error(404, 'マークダウンが読み込めません。');
	}

	const rawContent = await loader();
	const frontmatter = parseFrontmatter(rawContent);
	const content = stripFrontmatter(rawContent);

	return {
		projectId: id,
		stepId: step,
		title: steps[stepIndex].title,
		summary: steps[stepIndex].summary,
		content,
		showcaseImage: frontmatter.showcaseImage || null,
		showcaseImageAlt: createShowcaseImageAlt(step),
		prevStep: stepIndex > 0 ? steps[stepIndex - 1] : null,
		nextStep: stepIndex < steps.length - 1 ? steps[stepIndex + 1] : null,
		allSteps: steps
	};
}
