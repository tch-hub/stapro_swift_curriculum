export const projects = [
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

export const projectIdList = projects.map((project) => project.id);
