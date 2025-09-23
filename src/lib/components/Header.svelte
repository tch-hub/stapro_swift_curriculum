<script>
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	let { breadcrumbTitle } = $props();

	// テーマの状態管理
	let isDark = $state(false);

	// ページロード時にローカルストレージからテーマを読み込み
	$effect(() => {
		if (browser) {
			const savedTheme = localStorage.getItem('theme');
			if (savedTheme === 'dark') {
				isDark = true;
				document.documentElement.setAttribute('data-theme', 'dark');
			} else {
				isDark = false;
				document.documentElement.setAttribute('data-theme', 'retro');
			}
		}
	});

	// テーマ切り替え関数
	function toggleTheme() {
		isDark = !isDark;
		const theme = isDark ? 'coffee' : 'retro';

		if (browser) {
			document.documentElement.setAttribute('data-theme', theme);
			localStorage.setItem('theme', theme);
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
		cheatsheet: 'チートシート'
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
		</ul>
		<!-- テーマ切り替えボタン -->
		<button onclick={toggleTheme} class="btn mr-2 btn-circle btn-ghost" aria-label="テーマ切り替え">
			{#if isDark}
				<!-- ライトモードアイコン（太陽） -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path
						d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
					/>
				</svg>
			{:else}
				<!-- ダークモードアイコン（月） -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path
						d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
					/>
				</svg>
			{/if}
		</button>
	</div>
</header>
