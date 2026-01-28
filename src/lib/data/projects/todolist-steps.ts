export type TodolistStep = {
	title: string;
	summary: string;
	id: string;
};

export const todolistSteps: TodolistStep[] = [
	{
		id: 'step1',
		title: 'ステップ1: プロジェクトの作成とセットアップ',
		summary: 'Xcodeでプロジェクトを立ち上げて初期ファイルを確認します。'
	},
	{
		id: 'step2',
		title: 'ステップ2: SwiftData環境の準備',
		summary: 'SwiftDataモデルコンテナをセットアップして、データベース環境を構築します。'
	},
	{
		id: 'step3',
		title: 'ステップ3: ToDoタスクモデルの作成(ToDoTask.swift)',
		summary: '@Modelデコレータを使ってToDoタスクのデータモデルを定義します。'
	},
	{
		id: 'step4',
		title: 'ステップ4: ToDoタブモデルの作成',
		summary: 'タブ管理用のモデルを定義し、複数カテゴリ対応の準備をします。'
	},
	{
		id: 'step5',
		title: 'ステップ5: ToDoTaskServiceの実装',
		summary: 'タスク関連のCRUD操作をサービスクラスで管理します。'
	},
	{
		id: 'step6',
		title: 'ステップ6: ToDoTabServiceの実装',
		summary: 'タブ関連の操作をサービスクラスで管理します。'
	},
	{
		id: 'step7',
		title: 'ステップ7: CustomAlertコンポーネントの実装',
		summary: 'カスタムアラートダイアログUIを実装します。'
	},
	{
		id: 'step8',
		title: 'ステップ8: TextFieldAlertModifierの実装',
		summary: 'テキスト入力用のカスタムモディファイアを実装します。'
	},
	{
		id: 'step9',
		title: 'ステップ9: FloatingButtonコンポーネントの実装',
		summary: 'FAB（フローティングアクションボタン）を実装します。'
	},
	{
		id: 'step10',
		title: 'ステップ10: ToDoListItemコンポーネントの実装',
		summary: 'リストアイテムの表示と操作を実装します。'
	},
	{
		id: 'step11',
		title: 'ステップ11: CustomListコンポーネントの実装',
		summary: 'リスト全体のUIと操作ロジックを実装します。'
	},
	{
		id: 'step12',
		title: 'ステップ12: ScreenIDの定義',
		summary: 'スクリーンナビゲーション用の識別子を定義します。'
	},
	{
		id: 'step13',
		title: 'ステップ13: NavigationItemの実装',
		summary: 'ナビゲーション用のデータモデルを定義します。'
	},
	{
		id: 'step14',
		title: 'ステップ14: NavigationBarModifierの実装',
		summary: 'カスタムナビゲーションバーを実装します。'
	},
	{
		id: 'step15',
		title: 'ステップ15: InitialViewの実装',
		summary: 'アプリの初期化処理とスプラッシュスクリーンを実装します。'
	},
	{
		id: 'step16',
		title: 'ステップ16: HomeViewの実装',
		summary: 'タスク一覧画面の主要UIを実装します。'
	},
	{
		id: 'step17',
		title: 'ステップ17: TabManageViewの実装',
		summary: 'タブ管理画面の追加・削除機能を実装します。'
	},
	{
		id: 'step18',
		title: 'ステップ18: MainStackの実装',
		summary: 'メイン画面のナビゲーションスタックを実装します。'
	},
	{
		id: 'step19',
		title: 'ステップ19: ToDoListAppの実装',
		summary: 'アプリのエントリーポイントを実装します。'
	},
	{
		id: 'step20',
		title: 'ステップ20: README.mdの作成',
		summary: 'プロジェクトの説明書を作成します。'
	},
	{
		id: 'step21',
		title: 'ステップ21: 最終調整とテスト',
		summary: 'アプリ全体をテストして仕上げを行います。'
	}
];
