<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import tutorialData from '$lib/data/tutorial.json';
	import GlobalSearch from '$lib/components/GlobalSearch.svelte';

	let { children } = $props();

	let id = $derived($page.params.id);
	let tutorialSection = $derived(tutorialData.sections.find((s) => s.id === id));

	const quizSections = [
		{
			id: '1',
			title: '変数と定数',
			description: 'Swiftでの変数と定数の宣言と使用方法を学びます。'
		},
		{ id: '2', title: '型推論', description: 'Swiftの型推論の仕組みを学びます。' },
		{ id: '3', title: '条件分岐', description: 'Swiftでの条件分岐の方法を学びます。' },
		{ id: '4', title: '配列', description: 'Swiftでの配列の使い方を学びます。' },
		{ id: '5', title: '関数', description: 'Swiftでの関数の定義と使用方法を学びます。' },
		{ id: '6', title: 'enum', description: 'Swiftでの列挙型の宣言と使用方法を学びます。' }
	];
	let quizSection = $derived(quizSections.find((s) => s.id === id));

	let breadcrumbTitle = $derived(
		$page.route.id === '/tutorial/[id]'
			? tutorialSection?.title
			: $page.route.id === '/quiz/[id]'
				? quizSection?.title
				: null
	);

	let globalSearch;
	let contextMenu = $state({
		visible: false,
		x: 0,
		y: 0
	});

	function handleContextMenu(event) {
		event.preventDefault();
		const menuWidth = 200;
		const menuHeight = 100;

		contextMenu = {
			visible: true,
			x: Math.min(event.clientX, window.innerWidth - menuWidth),
			y: Math.min(event.clientY, window.innerHeight - menuHeight)
		};
	}

	function handleOutsideInteraction(event) {
		// コンテキストメニューは常に閉じる
		if (contextMenu.visible) {
			contextMenu.visible = false;
		}

		// 選択ポップアップ外の操作ならポップアップを閉じる
		// ボタン上のmousedownはstopPropagationされているためここには到達しない
		if (selectionPopup.visible && !event.target?.closest?.('.selection-popup')) {
			selectionPopup.visible = false;
		}
	}

	function triggerSearch() {
		const selection = window.getSelection()?.toString() ?? '';
		globalSearch?.open(selection);
		contextMenu.visible = false; // 直接閉じる
	}

	let selectionPopup = $state({
		visible: false,
		x: 0,
		y: 0,
		text: ''
	});

	function handleSelectionChange() {
		if (contextMenu.visible) return;

		const selection = window.getSelection();
		const text = selection?.toString().trim();

		if (text && text.length > 0) {
			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();

			selectionPopup = {
				visible: true,
				x: rect.left + rect.width / 2,
				y: rect.top,
				text: text
			};
		} else {
			selectionPopup.visible = false;
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="base-path" content={base} />
</svelte:head>

<div class="contents selection:bg-primary selection:text-primary-content">
	<Header {breadcrumbTitle} />

	<main style="">
		{@render children?.()}
	</main>

	<GlobalSearch bind:this={globalSearch} />
</div>

<svelte:window
	oncontextmenu={handleContextMenu}
	onmousedown={handleOutsideInteraction}
	onmouseup={handleSelectionChange}
	onkeyup={handleSelectionChange}
	onscroll={() => {
		contextMenu.visible = false;
		selectionPopup.visible = false;
	}}
/>

{#if contextMenu.visible}
	<div
		class="fixed z-[9999] min-w-[200px] overflow-hidden rounded-lg border border-base-200 bg-base-100 shadow-xl"
		style="top: {contextMenu.y}px; left: {contextMenu.x}px;"
		role="menu"
		tabindex="-1"
		onmousedown={(e) => e.stopPropagation()}
	>
		<ul class="menu bg-base-100 p-2 text-base-content">
			<li>
				<button
					onclick={(e) => {
						e.stopPropagation();
						triggerSearch();
					}}
				>
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
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					検索 (Cmd+K)
				</button>
			</li>
		</ul>
	</div>
{/if}

{#if selectionPopup.visible}
	<div
		class="selection-popup fixed z-[9999] -translate-x-1/2 -translate-y-full pb-2"
		style="top: {selectionPopup.y}px; left: {selectionPopup.x}px;"
	>
		<button
			class="animate-in fade-in zoom-in btn shadow-lg duration-200 btn-sm btn-primary"
			onmousedown={(e) => e.stopPropagation()}
			onclick={() => {
				globalSearch?.open(selectionPopup.text);
				selectionPopup.visible = false;
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
			検索
		</button>
	</div>
{/if}
