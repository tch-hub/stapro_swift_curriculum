export type TimerStep = {
	title: string;
	summary: string;
	id: string;
};

export const timerSteps: TimerStep[] = [
	{
		id: 'step1',
		title: 'ステップ1: プロジェクトの作成とセットアップ',
		summary:
			'Xcodeでプロジェクトを作成し、不要なファイルを削除して必要なディレクトリ構成と初期ファイルを用意します。'
	},
	{
		id: 'step2',
		title: 'ステップ2: 基本的なUIの構築(ContentView.swift)',
		summary:
			'ContentViewでVStack/HStackを使ったレイアウトを作成し、TimerStateと@Stateによる状態管理を導入します。'
	},
	{
		id: 'step3',
		title: 'ステップ3: 時間選択ビューの実装(TimePicker, TimeSelectionView)',
		summary:
			'Pickerを使ったTimePickerと、それを組み合わせたTimeSelectionViewを作成し、時間入力UIを実装します。'
	},
	{
		id: 'step4',
		title: 'ステップ4: タイマー表示ビューの実装(TimerDisplayView)',
		summary:
			'ZStackと円形プログレスバー(trim/stroke)を使用して、残時間を視覚的に表示するTimerDisplayViewを作成します。'
	},
	{
		id: 'step5',
		title: 'ステップ5: ViewModelとタイマーロジックの実装(TimerViewModel)',
		summary:
			'TimerViewModelを作成し、Timerクラスを使用したカウントダウン処理や、開始・停止・一時停止などのコアロジックを実装します。'
	},
	{
		id: 'step6',
		title: 'ステップ6: ViewModelのUIへの反映(ContentView)',
		summary:
			'ContentViewにViewModel(@StateObject)を組み込み、各ボタンのアクションをViewModelのメソッドに接続します。'
	},
	{
		id: 'step7',
		title: 'ステップ7: アラームとアラート機能の追加(TimerViewModel, ContentView)',
		summary:
			'AVFoundationを用いてタイマー終了時に音を鳴らし、Alertでユーザーに通知する機能を追加します。'
	},
	{
		id: 'step8',
		title: 'ステップ8: カスタムボタンによるUIの仕上げ(ColorButton, ContentView)',
		summary:
			'ColorButtonコンポーネントを作成してボタンのデザインを統一し、状態に応じたボタンの出し分けを実装してアプリを完成させます。'
	}
];
