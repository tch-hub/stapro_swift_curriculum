import { error } from '@sveltejs/kit';
import { timerSteps } from '$lib/data/projects/timer-steps';
import { todolistSteps } from '$lib/data/projects/todolist-steps';

const markdownMaps = {
	timer: import.meta.glob('../../../../lib/steps/timer/*.md', { as: 'raw' }),
	todolist: import.meta.glob('../../../../lib/steps/todolist/*.md', { as: 'raw' })
};

const originalAppSteps = [
	{
		id: 'step1',
		title: 'ステップ1: アプリのアイデアを考えよう',
		summary: '自分が作りたいアプリのアイデアを出す'
	},
	{
		id: 'step2',
		title: 'ステップ2: アプリの設計図を描いてみよう',
		summary: '画面のデザインやレイアウトを決める'
	},
	{
		id: 'step3',
		title: 'ステップ3: 必要な機能を洗い出そう',
		summary: 'アプリに必要な機能をリストアップする'
	},
	{
		id: 'step4',
		title: 'ステップ4: プロジェクトをセットアップしよう',
		summary: 'Xcodeで新規プロジェクトを作成する'
	},
	{
		id: 'step5',
		title: 'ステップ5: 機能を実装してみよう',
		summary: '設計図と機能リストをもとに開発を進める'
	}
];

const stepsByProject = {
	timer: timerSteps,
	todolist: todolistSteps,
	'original-app': originalAppSteps
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

	if (id === 'original-app') {
		return {
			projectId: id,
			stepId: step,
			isOriginalApp: true
		};
	}

	const markdownFiles = markdownMaps[id];
	const loaderKey = `../../../../lib/steps/${id}/${step}.md`;
	const loader = markdownFiles ? markdownFiles[loaderKey] : null;

	if (!loader) {
		throw error(404, 'マークダウンが読み込めません。');
	}

	const content = await loader();

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
