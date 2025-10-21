<script>
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	// 24回の授業データを定義（第0回を追加）
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
			title: '第1回授業: SwiftUIの基本とSwiftの基礎',
			description:
				'SwiftUIの基本的なUI要素（テキスト、ボタン、レイアウト、図形）を学びます。また、練習問題で変数と定数、型推論について理解します。',
			checked: false,
			tutorialUrl: '/tutorial',
			quizUrl: '/quiz'
		},
		{
			id: 2,
			title: '第2回授業: SwiftUIの状態管理と制御構文',
			description:
				'SwiftUIでの状態管理、入力処理、簡単なアプリの作成を学びます。また、練習問題で条件分岐、関数、配列について理解します。',
			checked: false,
			tutorialUrl: '/tutorial',
			quizUrl: '/quiz'
		},
		{
			id: 3,
			title: '第3回授業',
			description: '関数とクロージャを学びます。関数の定義と使用方法を理解します。',
			checked: false,
			projectName: 'タイマーアプリ',
			projectSteps: [
				'/project/timer/step1',
				'/project/timer/step2',
				'/project/timer/step3',
				'/project/timer/step4'
			]
		},
		{
			id: 4,
			title: '第4回授業',
			description: 'クラスと構造体を学びます。オブジェクト指向の基本を学びます。',
			checked: false,
			projectName: 'タイマーアプリ',
			projectSteps: [
				'/project/timer/step5',
				'/project/timer/step6',
				'/project/timer/step7',
				'/project/timer/step8'
			]
		},
		{
			id: 5,
			title: '第5回授業',
			description: 'ToDoリストアプリの作成を学びます。',
			checked: false,
			projectName: 'ToDoリストアプリ',
			projectSteps: [
				'/project/todolist/step1',
				'/project/todolist/step2',
				'/project/todolist/step3'
			]
		},
		{
			id: 6,
			title: '第6回授業',
			description: 'ToDoリストアプリの作成を学びます。',
			checked: false,
			projectName: 'ToDoリストアプリ',
			projectSteps: [
				'/project/todolist/step4',
				'/project/todolist/step5',
				'/project/todolist/step6'
			]
		},
		{
			id: 7,
			title: '第7回授業',
			description: 'ToDoリストアプリの作成を学びます。',
			checked: false,
			projectName: 'ToDoリストアプリ',
			projectSteps: [
				'/project/todolist/step7',
				'/project/todolist/step8',
				'/project/todolist/step9'
			]
		},
		{
			id: 8,
			title: '第8回授業',
			description: 'ToDoリストアプリの作成を学びます。',
			checked: false,
			projectName: 'ToDoリストアプリ',
			projectSteps: [
				'/project/todolist/step10',
				'/project/todolist/step11',
				'/project/todolist/step12'
			]
		},
		{
			id: 9,
			title: '第9回授業',
			description: 'ToDoリストアプリの作成を学びます。',
			checked: false,
			projectName: 'ToDoリストアプリ',
			projectSteps: [
				'/project/todolist/step13',
				'/project/todolist/step14',
				'/project/todolist/step15'
			]
		},
		{
			id: 10,
			title: '第10回授業',
			description: 'ToDoリストアプリの作成を学びます。',
			checked: false,
			projectName: 'ToDoリストアプリ',
			projectSteps: [
				'/project/todolist/step16',
				'/project/todolist/step17',
				'/project/todolist/step18'
			]
		},
		{
			id: 11,
			title: '第11回授業',
			description: 'ToDoリストアプリの作成を学びます。',
			checked: false,
			projectName: 'ToDoリストアプリ',
			projectSteps: [
				'/project/todolist/step19',
				'/project/todolist/step20',
				'/project/todolist/step21'
			]
		},
		{
			id: 12,
			title: '第12回授業',
			description: 'オリジナルアプリの作成を学びます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step1']
		},
		{
			id: 13,
			title: '第13回授業',
			description: 'オリジナルアプリの作成を学びます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step2']
		},
		{
			id: 14,
			title: '第14回授業',
			description: 'オリジナルアプリの作成を学びます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step3']
		},
		{
			id: 15,
			title: '第15回授業',
			description: 'オリジナルアプリの作成を学びます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step4']
		},
		{
			id: 16,
			title: '第16回授業',
			description: 'オリジナルアプリの作成を学びます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step5']
		},
		{
			id: 17,
			title: '第17回授業',
			description: 'オリジナルアプリの作成を学びます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step1']
		},
		{
			id: 18,
			title: '第18回授業',
			description: 'オリジナルアプリの作成を学びます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step2']
		},
		{
			id: 19,
			title: '第19回授業',
			description: 'オリジナルアプリの作成を学びます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step3']
		},
		{
			id: 20,
			title: '第20回授業',
			description: 'オリジナルアプリの作成を学びます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step4']
		},
		{
			id: 21,
			title: '第21回授業',
			description: 'オリジナルアプリの作成を学びます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step5']
		},
		{
			id: 22,
			title: '第22回授業',
			description: 'オリジナルアプリの作成を学びます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step1']
		},
		{
			id: 23,
			title: '第23回授業',
			description: 'オリジナルアプリの作成を学びます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step2']
		},
		{
			id: 24,
			title: '第24回授業',
			description: 'オリジナルアプリの作成を学びます。',
			checked: false,
			projectName: 'オリジナルアプリ',
			projectSteps: ['/project/original-app/step3']
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
</script>

<!-- 学習の流れ説明 -->
<div class="container mx-auto px-4 py-8">
	<div class="mb-8 text-center">
		<h2 class="mb-4 text-3xl font-bold">学習の流れ</h2>
		<p class="mb-6 text-lg">
			以下の順序で学習を進めてください。チュートリアルと練習問題は同時並行で進められます。swift基本構文は補助教材として随時参照できます。
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
			{#each sortedLessons as lesson}
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
						<p class="mb-4">{lesson.description}</p>
						<div class="card-actions justify-end">
							{#if lesson.tutorialUrl}
								<a href="{base}{lesson.tutorialUrl}" class="btn btn-primary">
									{lesson.id === 0 ? '環境構築' : 'チュートリアル'}
								</a>
							{/if}
							{#if lesson.quizUrl}
								<a href="{base}{lesson.quizUrl}" class="btn btn-secondary">練習問題</a>
							{/if}
							{#if lesson.projectSteps}
								{#each lesson.projectSteps as step, i}
									<a href="{base}{step}" class="btn btn-accent"
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
