<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import tutorialData from '$lib/data/tutorial.json';
	import quizData from '$lib/data/quiz.json';

	let { children } = $props();

	let id = $derived($page.params.id);
	let tutorialSection = $derived(tutorialData.sections.find((s) => s.id === id));
	let quizSection = $derived(quizData.sections.find((s) => s.id === id));
	let breadcrumbTitle = $derived(
		$page.route.id === '/tutorial/[id]'
			? tutorialSection?.title
			: $page.route.id === '/quiz/[id]'
				? quizSection?.title
				: null
	);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="base-path" content={base} />
</svelte:head>

<Header {breadcrumbTitle} />

<main style="">
	{@render children?.()}
</main>
