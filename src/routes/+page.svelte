<script>
	import { base, resolve } from '$app/paths';
	import { onMount } from 'svelte';

	// 授業データを定義（第0回〜第24回）
	let lessons = $state([
		{
			id: 0,
			title: '第0回授業: 環境構築',
			description:
				'Swift開発環境の構築方法を学びます。Xcodeのインストールと基本設定を行います。時間がかかるので事前にダウンロードしておきましょう。ダウンロードできていなかった場合は練習問題に挑戦してください。',
			checked: false,
			tutorialUrl: '/setup',
			quizUrl: null
		},
		{
			id: 1,
			title: '第1回授業: 新しい教材（タイトルを追加してください）',
			description: '追加する教材の内容をここに記述してください。',
			checked: false,
			tutorialUrl: null,
			quizUrl: null
		},
		{
			id: 2,
			title: '第2回授業: Swiftの基本構文(練習問題)',
			description:
				'Swiftの基本構文を学びます。変数、定数、型推論、条件分岐、関数などについて理解します。<br>まずはSwift基本構文を学習し、その後練習問題に取り組んでみましょう。',
			checked: false,
			tutorialUrl: null,
			quizUrl: '/quiz'
		},
		{
			id: 3,
			title: '第3回授業: SwiftUI学習',
			description:
				'SwiftUIの基本を学びます。デフォルトコードの解説・テキスト表示・ボタン操作・レイアウト（VStack / HStack / ZStack）を学習します。',
			checked: false,
			tutorialSections: ['/tutorial/0', '/tutorial/1', '/tutorial/2', '/tutorial/3']
		},
		{
			id: 4,
			title: '第4回授業: SwiftUI学習',
			description:
				'SwiftUIのインタラクティブな要素を学びます。状態管理（@State）・図形・テキスト入力・Toggle・Slider・カウンターアプリの作成まで行います。',
			checked: false,
			tutorialSections: ['/tutorial/4', '/tutorial/5', '/tutorial/6', '/tutorial/7']
		},
		{
			id: 5,
			title: '第5回授業',
			description:
				'タイマーアプリ制作を開始します。プロジェクト作成・基本UIの構築・時間選択コンポーネント（TimePicker / TimeSelectionView）を実装します。',
			checked: false,
			projectName: 'タイマーアプリ',
			projectSteps: ['/project/timer/step1', '/project/timer/step2', '/project/timer/step3']
		},
		{
			id: 6,
			title: '第6回授業',
			description:
				'タイマーの表示とロジックを実装します。円形プログレスバー（TimerDisplayView）・ViewModel（カウントダウン・開始・停止・一時停止）・ContentViewへの接続を行います。',
			checked: false,
			projectName: 'タイマーアプリ',
			projectSteps: ['/project/timer/step4', '/project/timer/step5', '/project/timer/step6']
		},
		{
			id: 7,
			title: '第7回授業',
			description:
				'タイマーアプリを完成させます。アラーム音（AVFoundation）・アラート表示・カスタムボタン（ColorButton）・状態に応じたUI切り替えを実装します。',
			checked: false,
			projectName: 'タイマーアプリ',
			projectSteps: ['/project/timer/step7', '/project/timer/step8']
		},
		{
			id: 8,
			title: '第8回授業',
			description:
				'ToDoリストアプリの制作を開始します。プロジェクト作成・タスクコンポーネント・リストコンポーネントを作成します。',
			checked: false,
			projectName: 'ToDoリストアプリ',
			projectSteps: [
				'/project/todolist/step1',
				'/project/todolist/step2',
				'/project/todolist/step3'
			]
		},
		{
			id: 9,
			title: '第9回授業',
			description:
				'ToDoリストアプリのUIを引き続き作成します。空の状態ビュー・入力バー・タブ選択ヘッダーを実装します。',
			checked: false,
			projectName: 'ToDoリストアプリ',
			projectSteps: [
				'/project/todolist/step4',
				'/project/todolist/step5',
				'/project/todolist/step6'
			]
		},
		{
			id: 10,
			title: '第10回授業',
			description:
				'ToDoリストアプリのデータ層を実装します。タスク・タブのモデル定義・初期データ・タスク操作サービス・タブ操作サービスを作成します（画面には変化なし）。',
			checked: false,
			projectName: 'ToDoリストアプリ',
			projectSteps: [
				'/project/todolist/step7',
				'/project/todolist/step8',
				'/project/todolist/step9',
				'/project/todolist/step10',
				'/project/todolist/step11'
			]
		},
		{
			id: 11,
			title: '第11回授業',
			description:
				'ToDoリストアプリの管理画面と起動設定を実装します。タブ管理画面（TabManageView）・SwiftData初期設定・ホーム画面の枠を作成します。',
			checked: false,
			projectName: 'ToDoリストアプリ',
			projectSteps: [
				'/project/todolist/step12',
				'/project/todolist/step13',
				'/project/todolist/step14'
			]
		},
		{
			id: 12,
			title: '第12回授業',
			description:
				'ToDoリストアプリの画面遷移とメイン表示を実装します。MainStack（画面遷移）・ContentView（起動時初期化）・HomeView（タブ・タスク一覧表示）を作成します。',
			checked: false,
			projectName: 'ToDoリストアプリ',
			projectSteps: [
				'/project/todolist/step15',
				'/project/todolist/step16',
				'/project/todolist/step17'
			]
		},
		{
			id: 13,
			title: '第13回授業',
			description:
				'ToDoリストアプリの主要機能を完成させます。タスクの完了切り替え・タスク追加フォーム・スワイプ削除を実装します。',
			checked: false,
			projectName: 'ToDoリストアプリ',
			projectSteps: [
				'/project/todolist/step18',
				'/project/todolist/step19',
				'/project/todolist/step20'
			]
		},
		{
			id: 14,
			title: '第14回授業',
			description:
				'ToDoリストアプリの発展課題に取り組みます。完了タスクの並び替え・タスク検索・削除確認アラートなど、自分でアイデアを考えて機能を追加します。',
			checked: false,
			projectName: 'ToDoリストアプリ',
			projectSteps: ['/project/todolist/step21']
		},
		{
			id: 15,
			title: '第15回授業',
			description:
				'オリジナルアプリの企画・設計を行います。何を作るかを決め、必要な画面・データ・機能のリストを整理します。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step1']
		},
		{
			id: 16,
			title: '第16回授業',
			description:
				'Xcodeでオリジナルアプリのプロジェクトを作成します。フォルダ・ファイル構成を整え、エントリーポイントと仮の画面を実装します。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step2']
		},
		{
			id: 17,
			title: '第17回授業',
			description:
				'メイン画面の骨格を作ります。ダミーデータを使って画面のレイアウト・画面遷移の構造を確認します。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step3']
		},
		{
			id: 18,
			title: '第18回授業',
			description:
				'データモデルとサービスクラスを実装します。SwiftDataを使ってアプリのデータを端末に永続保存できるようにします。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step4']
		},
		{
			id: 19,
			title: '第19回授業',
			description:
				'データの表示機能（Read）を実装します。データベースからデータを取得してリスト表示し、空の状態の表示も作ります。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step5']
		},
		{
			id: 20,
			title: '第20回授業',
			description:
				'データの追加機能（Create）を実装します。入力フォームを作り、新しいデータを保存できるようにします。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step6']
		},
		{
			id: 21,
			title: '第21回授業',
			description:
				'データの更新・削除機能（Update / Delete）を実装します。これでCRUD（基本的なデータ操作）がすべて揃います。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step7']
		},
		{
			id: 22,
			title: '第22回授業',
			description:
				'UI部品を整え、アプリに合った機能を追加します。検索・並び替え・アニメーションなど、使いやすさを高めます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step8']
		},
		{
			id: 23,
			title: '第23回授業',
			description:
				'デバッグとバグ修正を行います。全機能の動作確認・クラッシュの原因特定・データ保存の検証を行います。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step9']
		},
		{
			id: 24,
			title: '第24回授業',
			description:
				'UIの仕上げ・磨き込みを行います。色・フォント・余白を整えて、見た目をきれいに仕上げます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step10']
		}
	]);

	// ローカルストレージから進捗を読み込み
	onMount(() => {
		const saved = localStorage.getItem('lessonProgress');
		if (saved) {
			const progress = JSON.parse(saved);
			lessons = lessons.map((lesson) => ({
				...lesson,
				checked: progress.find((p) => p.id === lesson.id)?.checked || false
			}));
		}
	});

	// 進捗をローカルストレージに保存
	$effect(() => {
		localStorage.setItem(
			'lessonProgress',
			JSON.stringify(lessons.map((l) => ({ id: l.id, checked: l.checked })))
		);
	});

	// 授業をソート：未チェックを若い番号順に上位に
	let sortedLessons = $derived(
		lessons.toSorted((a, b) => {
			if (a.checked !== b.checked) {
				return a.checked ? 1 : -1; // 未チェックを先
			}
			return a.id - b.id;
		})
	);

	// 進捗をリセット
	function resetProgress() {
		lessons = lessons.map((lesson) => ({ ...lesson, checked: false }));
		localStorage.removeItem('lessonProgress');
	}

	function splitDescription(text) {
		return text.split('<br>').map((part) => part.trim());
	}
</script>

<!-- 学習の流れ説明 -->
<div class="container mx-auto px-4 py-8" data-base={base}>
	<div class="mb-8 text-center">
		<h2 class="mb-4 text-3xl font-bold">学習の流れ</h2>
		<p class="mb-6 text-lg">
			以下の順序で学習を進めてください。チュートリアルと練習問題は同時並行で進められます。リファレンスは補助教材として随時参照できます。
		</p>
		<ul class="steps steps-vertical lg:steps-horizontal">
			<li class="step">環境構築</li>
			<li class="step">チュートリアル & 練習問題</li>
			<li class="step">アプリ制作</li>
		</ul>
	</div>

	<!-- 24回の授業枠 -->
	<div class="mb-8">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-2xl font-bold">授業一覧</h2>
			<button class="btn btn-error" onclick={resetProgress}>進捗をリセット</button>
		</div>
		<div class="flex flex-col space-y-4">
			{#each sortedLessons as lesson (lesson.id)}
				{@const parts = splitDescription(lesson.description)}
				<div class="card bg-base-100 shadow-md">
					<div class="card-body">
						<div class="mb-2 flex items-center">
							<input
								type="checkbox"
								class="checkbox mr-2 checkbox-primary"
								bind:checked={lesson.checked}
							/>
							<h3 class="card-title">{lesson.title}</h3>
						</div>
						<p class="mb-4">
							{#each parts as part, index (part + index)}
								{part}
								{#if index < parts.length - 1}
									<br />
								{/if}
							{/each}
						</p>
						<div class="card-actions justify-end">
							{#if lesson.tutorialUrl}
								<a href={resolve(lesson.tutorialUrl)} class="btn btn-primary">
									{lesson.id === 0 ? '環境構築' : 'チュートリアル'}
								</a>
							{/if}
							{#if lesson.tutorialSections}
								{#each lesson.tutorialSections as section (section)}
									<a href={resolve(section)} class="btn btn-primary">
										チュートリアル {parseInt(section.split('/').pop() || '0', 10) + 1}
									</a>
								{/each}
							{/if}
							{#if lesson.referenceUrl}
								<a href={resolve(lesson.referenceUrl)} class="btn btn-primary">リファレンス</a>
							{/if}
							{#if lesson.quizUrl}
								<a href={resolve(lesson.quizUrl)} class="btn btn-secondary">練習問題</a>
							{/if}
							{#if lesson.projectSteps}
								{#each lesson.projectSteps as step (step)}
									<a href={resolve(step)} class="btn btn-primary"
										>{lesson.projectName} ステップ{step.split('/').pop().replace('step', '')}</a
									>
								{/each}
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
