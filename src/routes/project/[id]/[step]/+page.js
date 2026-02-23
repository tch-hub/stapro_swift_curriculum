import { error } from '@sveltejs/kit';
import { timerSteps } from '$lib/data/projects/timer-steps';
import { todolistSteps } from '$lib/data/projects/todolist-steps';

const markdownMaps = {
	timer: import.meta.glob('../../../../lib/steps/timer/*.md', { as: 'raw' }),
	todolist: import.meta.glob('../../../../lib/steps/todolist/*.md', { as: 'raw' }),
	'original-app': import.meta.glob('../../../../lib/steps/original-app/*.md', { as: 'raw' })
};

const originalAppSteps = [
	{
		id: 'step1',
		title: 'ステップ1: アプリ企画・設計・プロジェクト作成',
		summary: 'アプリの計画を立て、XcodeでmacOSアプリを作成し、PLAN.mdに計画を記録する'
	},
	{
		id: 'step2',
		title: 'ステップ2: ファイル構成を整える',
		summary: 'フォルダ・ファイルの骨格を整え、常の画面を表示できる状態にする'
	},
	{
		id: 'step3',
		title: 'ステップ3: メイン画面の骨格を作る',
		summary: 'ダミーデータを使って画面のレイアウト・画面遷移の構造を確認する'
	},
	{
		id: 'step4',
		title: 'ステップ4: データモデルの実装',
		summary: 'SwiftDataでデータモデルとサービスクラスを実装する'
	},
	{
		id: 'step5',
		title: 'ステップ5: データの表示（Read）',
		summary: 'データベースからデータを取得してリスト表示する'
	},
	{
		id: 'step6',
		title: 'ステップ6: データの追加（Create）',
		summary: '入力フォームを作り、新しいデータを保存できるようにする'
	},
	{
		id: 'step7',
		title: 'ステップ7: データの更新・削除（Update / Delete）',
		summary: 'スワイプ削除・状態切り替え・確認アラートを実装する'
	},
	{
		id: 'step8',
		title: 'ステップ8: UI部品を整える・機能を追加する',
		summary: '検索・並び替え・アニメーションなど使いやすさを高める'
	},
	{
		id: 'step9',
		title: 'ステップ9: デバッグ・バグ修正',
		summary: '全機能の動作確認・よくあるバグの原因と対処法'
	},
	{
		id: 'step10',
		title: 'ステップ10: UI仕上げ・磨き込み',
		summary: '色・フォント・余白を整えてアプリの見た目を仕上げる'
	},
	{
		id: 'step11',
		title: 'ステップ11: 発表・振り返り',
		summary: '完成したアプリを発表し、授業全体を振り返る'
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
