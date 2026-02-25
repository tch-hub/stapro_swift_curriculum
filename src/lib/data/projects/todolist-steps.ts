export type TodolistStep = {
	title: string;
	summary: string;
	id: string;
};

export const todolistSteps: TodolistStep[] = [
	{
		id: 'step1',
		title: 'ステップ1: プロジェクトの作成とセットアップ(ToDoListApp.swift)',
		summary: 'Xcodeでプロジェクトを立ち上げて初期ファイルを確認します。'
	},
	{
		id: 'step2',
		title: 'ステップ2: タスクコンポーネントを作る(ToDoListItem.swift)',
		summary: 'タスク行の表示と完了切り替えの基本を作ります。'
	},
	{
		id: 'step3',
		title: 'ステップ3: リストコンポーネントを作る(CustomList.swift)',
		summary: 'リストの見た目をカスタマイズします。'
	},
	{
		id: 'step4',
		title: 'ステップ4: 空の状態を表示するコンポーネントを作る(EmptyStateView.swift)',
		summary: 'タスクなし/未選択時の表示を追加します。'
	},
	{
		id: 'step5',
		title: 'ステップ5: タスク入力バーを作る(InputView.swift)',
		summary: '画面下部の入力欄と追加ボタンを作成します。'
	},
	{
		id: 'step6',
		title: 'ステップ6: タブ選択ヘッダーを作る(TabHeaderView.swift)',
		summary: 'タブ切り替えと管理画面への導線を作成します。'
	},
	{
		id: 'step7',
		title: 'ステップ7: タスクのデータモデルを作る(ToDoTask.swift)',
		summary: 'タスク情報を保存するための「設計図」を作成します。'
	},
	{
		id: 'step8',
		title: 'ステップ8: タブのデータモデルを作る(ToDoTab.swift)',
		summary: 'タブ情報を保存するための「設計図」を作成します。'
	},
	{
		id: 'step9',
		title: 'ステップ9: 初期データを投入する(Constants.swift)',
		summary: '初回起動時のタブとタスクの初期データを定義します。'
	},
	{
		id: 'step10',
		title: 'ステップ10: タスク操作のサービスを作る(ToDoTaskService.swift)',
		summary: 'タスクの追加・更新・削除・完了切り替えをまとめます。'
	},
	{
		id: 'step11',
		title: 'ステップ11: タブ操作のサービスを作る(ToDoTabService.swift)',
		summary: 'タブの追加・更新・削除をまとめます。'
	},
	{
		id: 'step12',
		title: 'ステップ12: タブ管理画面を作る(TabManageView.swift)',
		summary: 'タブの追加と削除を行う画面を作成します。'
	},
	{
		id: 'step13',
		title: 'ステップ13: ホーム画面の枠を作る(HomeView.swift)',
		summary: 'ホーム画面の土台を作成します。'
	},
	{
		id: 'step14',
		title: 'ステップ14: アプリにデータベースを準備しよう (ToDoListApp.swift)',
		summary: '「データを保存する場所（データベース）」を作って使えるようにする設定をしていきます。'
	},
	{
		id: 'step15',
		title: 'ステップ15: 画面を切り替える準備をしよう (MainStack.swift)',
		summary: '画面の切り替えをコントロールするための「土台」を作っていきます。'
	},
	{
		id: 'step16',
		title: 'ステップ16: 起動時の初期化を行う(ContentView.swift)',
		summary: '初期化処理とローディング表示を追加します。'
	},
	{
		id: 'step17',
		title: 'ステップ17: タブとタスクを表示する(HomeView.swift)',
		summary: 'タブ選択とタスク一覧の表示を実装します。'
	},
	{
		id: 'step18',
		title: 'ステップ18: 完了切り替えを実装する(HomeView.swift)',
		summary: 'タスクの完了/未完了を切り替えます。'
	},
	{
		id: 'step19',
		title: 'ステップ19: タスク追加フォームを作る(HomeView.swift)',
		summary: '画面下部にタスク追加欄を実装します。'
	},
	{
		id: 'step20',
		title: 'ステップ20: スワイプ削除を追加する(HomeView.swift)',
		summary: 'タスクをスワイプして削除できるようにします。'
	},
	{
		id: 'step21',
		title: 'ステップ21: 発展課題（もっと便利にするアイデア）',
		summary: '検索やソートなどの追加機能に挑戦します。'
	}
];
