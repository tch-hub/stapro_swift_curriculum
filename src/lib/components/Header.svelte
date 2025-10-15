<script>
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	let { breadcrumbTitle } = $props();

	// デフォルトテーマ
	const DEFAULT_THEME = 'lemonade';

	// テーマの状態管理
	let selectedTheme = $state(DEFAULT_THEME);

	// 利用可能なテーマ
	const themes = [
		'light',
		'lemonade',
		'cupcake',
		'retro',
		'caramellatte',
		'valentine',
		'cyberpunk',
		'aqua',
		'sunset',
		'luxury',
		'coffee'
	];

	// ブラウザ環境での初期テーマ設定
	if (browser) {
		const savedTheme = localStorage.getItem('theme') || DEFAULT_THEME;
		selectedTheme = savedTheme;
		document.documentElement.setAttribute('data-theme', savedTheme);
	}

	// テーマ変更関数
	function changeTheme(event) {
		selectedTheme = event.target.value;
		if (browser) {
			document.documentElement.setAttribute('data-theme', selectedTheme);
			localStorage.setItem('theme', selectedTheme);
		}
	}

	// ルートラベルのマッピング
	const routeLabels = {
		'': 'ホーム',
		setup: '環境構築',
		tutorial: 'チュートリアル',
		quiz: 'クイズ',
		project: 'プロジェクト',
		timer: 'タイマーアプリ',
		cheatsheet: 'チートシート',
		editor: 'JSONエディタ'
	};

	// Breadcrumbを生成する関数
	function generateBreadcrumb(pathname) {
		// base を pathname から除去
		if (pathname.startsWith(base)) {
			pathname = pathname.slice(base.length);
		}
		const segments = pathname.split('/').filter(Boolean);
		const breadcrumbs = [{ label: 'ホーム', href: base + '/' }];

		let currentPath = base + '/';
		for (const segment of segments) {
			currentPath += segment + '/';
			let label = routeLabels[segment] || segment;
			if (segment.startsWith('step')) {
				label = `ステップ ${segment.slice(4)}`;
			} else if (!isNaN(segment)) {
				// 数字の場合はレッスン番号など、または breadcrumbTitle があればそれを使う
				label = breadcrumbTitle || `レッスン ${segment}`;
			}
			breadcrumbs.push({ label, href: currentPath });
		}
		return breadcrumbs;
	}

	let breadcrumbs = $derived(generateBreadcrumb($page.url.pathname));

	let currentThemeLabel = $derived(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
</script>

<header
	class="sticky top-0 z-10 mx-auto navbar max-w-7xl rounded-b-lg border-b border-base-300/50 bg-base-100/80 shadow-lg backdrop-blur-md"
>
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/>
				</svg>
			</div>
			<ul class="dropdown-content menu z-[1] mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 shadow">
				<li><a href="{base}/">ホーム</a></li>
				<li><a href="{base}/setup">環境構築</a></li>
				<li><a href="{base}/tutorial">チュートリアル</a></li>
				<li><a href="{base}/cheatsheet">チートシート</a></li>
				<li><a href="{base}/quiz">練習</a></li>
				<li><a href="{base}/project">プロジェクト</a></li>
				{#if dev}
					<li><a href="{base}/editor">JSONエディタ</a></li>
				{/if}
			</ul>
		</div>
		<!-- Breadcrumb -->
		<div class="breadcrumbs ml-4">
			<ul>
				{#each breadcrumbs as crumb, index}
					{#if index < breadcrumbs.length - 1}
						<li><a href={crumb.href}>{crumb.label}</a></li>
					{:else}
						<li class="font-semibold text-primary">{crumb.label}</li>
					{/if}
				{/each}
			</ul>
		</div>
	</div>
	<div class="navbar-end">
		<!-- ナビゲーションメニュー -->
		<ul class="menu menu-horizontal hidden px-1 lg:flex">
			<li><a href="{base}/setup">環境構築</a></li>
			<li><a href="{base}/tutorial">チュートリアル</a></li>
			<li><a href="{base}/cheatsheet">チートシート</a></li>
			<li><a href="{base}/quiz">練習</a></li>
			<li><a href="{base}/project">プロジェクト</a></li>
			{#if dev}
				<li><a href="{base}/editor">JSONエディタ</a></li>
			{/if}
		</ul>
		<!-- テーマ切り替えドロップダウン -->
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn m-1">
				{currentThemeLabel}
				<svg
					width="12px"
					height="12px"
					class="inline-block h-2 w-2 fill-current opacity-60"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 2048 2048"
				>
					<path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
				</svg>
			</div>
			<ul tabindex="0" class="dropdown-content z-20 w-52 rounded-box bg-base-300 p-2 shadow-2xl">
				{#each themes as theme}
					<li>
						<input
							type="radio"
							name="theme-dropdown"
							class="theme-controller btn btn-block justify-start btn-ghost btn-sm"
							aria-label={theme.charAt(0).toUpperCase() + theme.slice(1)}
							value={theme}
							checked={selectedTheme === theme}
							onchange={changeTheme}
						/>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</header>
