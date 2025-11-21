export type TimerStep = {
	title: string;
	summary: string;
	id: string;
};

export const timerSteps: TimerStep[] = [
	{
		id: 'step1',
		title: 'ステップ1: プロジェクトの作成とセットアップ',
		summary: 'Xcodeでプロジェクトを立ち上げて初期ファイルを確認します。'
	},
	{
		id: 'step2',
		title: 'ステップ2: 基本的なUIの作成',
		summary: 'VStack/HStackと@StateでUIの骨組みを作り、TimerStateを定義します。'
	},
	{
		id: 'step3',
		title: 'ステップ3: 時間選択ビューの実装',
		summary: '再利用可能なTimePickerとTimeSelectionViewをつかって時間入力UIを作ります。'
	},
	{
		id: 'step4',
		title: 'ステップ4: タイマー表示ビューの実装',
		summary: 'ZStack/trim/animationを使って円形プログレスバーと時間表示を重ねます。'
	},
	{
		id: 'step5',
		title: 'ステップ5: ViewModelの作成',
		summary: 'ObservableObjectと@Publishedを使って段階的にViewModelへロジックを移します。'
	},
	{
		id: 'step6',
		title: 'ステップ6: タイマーロジックの追加',
		summary: 'Timer.scheduledTimerでカウントダウン処理を実装し、クロージャを理解します。'
	},
	{
		id: 'step7',
		title: 'ステップ7: アラーム機能の実装',
		summary: 'AVAudioPlayerとAlertで音声再生と完了通知を加えます。'
	},
	{
		id: 'step8',
		title: 'ステップ8: 最終調整とテスト',
		summary: 'ColorButtonやテストリストで仕上げを行いアプリ全体を確認します。'
	}
];
