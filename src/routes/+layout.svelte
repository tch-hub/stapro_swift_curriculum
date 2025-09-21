<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import tutorialData from '$lib/data/tutorial.json';

	let { children } = $props();

	let id = $derived($page.params.id);
	let section = $derived(tutorialData.sections.find((s) => s.id === id));
	let breadcrumbTitle = $derived($page.route.id === '/tutorial/[id]' ? section?.title : null);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header {breadcrumbTitle} />

<main style="">
	{@render children?.()}
</main>
