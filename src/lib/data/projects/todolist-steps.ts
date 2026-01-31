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
		title: 'ステップ2: タスク行コンポーネントを作る(ToDoListItem.swift)',
		summary: 'ToDoListItemを作成してタスク表示の基本を作ります。'
	},
	{
		id: 'step3',
		title: 'ステップ3: どのリストにも使えるCustomList(CustomList.swift)',
		summary: '汎用リストコンポーネントを作成します。'
	},
	{
		id: 'step4',
		title: 'ステップ4: 削除確認アラートを共通化する(DeleteAlertModifier.swift)',
		summary: 'deleteAlert拡張で削除確認を使い回せるようにします。'
	},
	{
		id: 'step5',
		title: 'ステップ5: フローティングボタンを作る(FloatingButton.swift)',
		summary: '画面右下に固定表示する丸いボタンを実装します。'
	},
	{
		id: 'step6',
		title: 'ステップ6: 入力付きアラートを作る(TextFieldAlertModifier.swift)',
		summary: 'テキスト入力ができるアラートを実装します。'
	},
	{
		id: 'step7',
		title: 'ステップ7: タスクのデータモデルを作る(ToDoTask.swift)',
		summary: 'SwiftDataでToDoTaskモデルを定義します。'
	},
	{
		id: 'step8',
		title: 'ステップ8: タブのデータモデルを作る(ToDoTab.swift)',
		summary: 'SwiftDataでToDoTabモデルを定義します。'
	},
	{
		id: 'step9',
		title: 'ステップ9: 初期データを投入する(Constants.swift, ContentView.swift)',
		summary: '初回起動時にタブとタスクの初期データを作成します。'
	},
	{
		id: 'step10',
		title: 'ステップ10: SwiftDataの設定を行う(ToDoListApp.swift)',
		summary: 'ModelContainerを初期化して保存環境を準備します。'
	},
	{
		id: 'step11',
		title: 'ステップ11: タスク操作のサービスを作る(ToDoTaskService.swift)',
		summary: 'タスクの追加・更新・削除をまとめます。'
	},
	{
		id: 'step12',
		title: 'ステップ12: タブ操作のサービスを作る(ToDoTabService.swift)',
		summary: 'タブの追加・更新・削除をまとめます。'
	},
	{
		id: 'step13',
		title: 'ステップ13: タブ管理画面を作る(TabManageView.swift)',
		summary: 'タブの追加と削除を行う画面を作成します。'
	},
	{
		id: 'step14',
		title: 'ステップ14: ホーム画面の枠を作る(HomeView.swift)',
		summary: 'ホーム画面の土台と遷移ボタンを用意します。'
	},
	{
		id: 'step15',
		title: 'ステップ15: 画面遷移の土台を作る(MainStack.swift)',
		summary: 'NavigationStackで画面遷移を定義します。'
	},
	{
		id: 'step16',
		title: 'ステップ16: タブとタスクを表示する(HomeView.swift)',
		summary: 'タブ選択とタスク一覧の表示を実装します。'
	},
	{
		id: 'step17',
		title: 'ステップ17: 完了切り替えを実装する(HomeView.swift)',
		summary: 'タスクの完了/未完了を切り替えます。'
	},
	{
		id: 'step18',
		title: 'ステップ18: タスク追加フォームを作る(HomeView.swift)',
		summary: '画面下部にタスク追加欄を実装します。'
	},
	{
		id: 'step19',
		title: 'ステップ19: スワイプ削除を追加する(HomeView.swift)',
		summary: 'タスクをスワイプして削除できるようにします。'
	},
	{
		id: 'step20',
		title: 'ステップ20: タスク編集を実装する(HomeView.swift)',
		summary: '長押しでタスク名を編集できるようにします。'
	},
	{
		id: 'step21',
		title: 'ステップ21: 発展課題（もっと便利にするアイデア）',
		summary: '検索やソートなどの追加機能に挑戦します。'
	}
];
