<script>
  /** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */

  import { base } from "$app/paths";
  import Header from "$lib/Header.svelte";
  import SideBar from "$lib/SideBar.svelte";

  //   BeerCSSインポート
  import "beercss/dist/cdn/beer.min.css";
  import "beercss/dist/cdn/beer.min.js";
  import "material-dynamic-colors";
  let { data, children } = $props();
</script>

<Header />
<!-- <SideBar /> -->

<main class="responsive">{@render children()}</main>

<style>
  :global(article:hover) {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
</style>
