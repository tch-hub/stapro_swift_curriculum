export type AppCreation = {
	id: string;
	title: string;
	summary: string;
	downloadUrl: string | null;
};

export const appCreations: AppCreation[] = [
	{
		id: 'timer',
		title: 'タイマーアプリ',
		summary:
			'シンプルなタイマーアプリを作成します。時間設定、カウントダウン、アラーム機能を実装します。',
		downloadUrl: '/source/Timer.zip'
	},
	{
		id: 'todolist',
		title: 'ToDoリストアプリ',
		summary: 'SwiftDataとMVVMアーキテクチャを採用した本格的なToDoリストアプリを作成します。',
		downloadUrl: '/source/ToDoLitst.zip'
	},
	{
		id: 'original-app',
		title: 'オリジナルアプリ',
		summary: '学んだ知識を総動員して、自分だけのオリジナルアプリ開発に挑戦しましょう！',
		downloadUrl: null
	}
];

export const appCreationIdList = appCreations.map((appCreation) => appCreation.id);

export type AppCreationStep = {
	id: string;
	title: string;
	summary: string;
};

const timerModules = import.meta.glob('../../markdown/timer/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});
const todolistModules = import.meta.glob('../../markdown/todolist/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});
const originalAppModules = import.meta.glob('../../markdown/original-app/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});
const swiftuiBasicsModules = import.meta.glob('../../markdown/swiftui-basics/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

function parseFrontmatter(markdown: string) {
	const match = markdown.match(/^\s*---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return { title: '', summary: '' };
	const lines = match[1].split('\n');
	const metadata: Record<string, string> = {};
	lines.forEach((line) => {
		const colonIdx = line.indexOf(':');
		if (colonIdx > -1) {
			const key = line.slice(0, colonIdx).trim();
			const val = line.slice(colonIdx + 1).trim();
			// Remove surrounding quotes if exist
			metadata[key] = val.replace(/^["'](.*)["']$/, '$1');
		}
	});
	return metadata;
}

function processModules(modules: Record<string, string>): AppCreationStep[] {
	return Object.entries(modules)
		.map(([path, content]) => {
			const idMatch = path.match(/([^\/]+)\.md$/);
			const id = idMatch ? idMatch[1] : '';
			const meta = parseFrontmatter(content);
			return {
				id,
				title: meta.title || '',
				summary: meta.summary || ''
			};
		})
		.sort((a, b) => {
			const numA = parseInt(a.id.replace('step', ''), 10);
			const numB = parseInt(b.id.replace('step', ''), 10);
			return numA - numB;
		});
}

export const timerSteps = processModules(timerModules as Record<string, string>);
export const todolistSteps = processModules(todolistModules as Record<string, string>);
export const originalAppSteps = processModules(originalAppModules as Record<string, string>);
export const swiftuiBasicsSteps = processModules(swiftuiBasicsModules as Record<string, string>);

export const stepsByAppCreation: Record<string, AppCreationStep[]> = {
	timer: timerSteps,
	todolist: todolistSteps,
	'original-app': originalAppSteps,
	'swiftui-basics': swiftuiBasicsSteps
};
