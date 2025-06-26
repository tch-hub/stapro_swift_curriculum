<!-- ヘッダーコンポーネント -->
<script lang="ts">
  import { base } from "$app/paths";

  import { page } from "$app/stores";
  // ナビゲーションメニューの項目
  const navItems = [
    { href: "/", label: "ホーム", icon: "home" },
    { href: "/setup", label: "環境構築", icon: "build_circle" },
	{ href: "/tutorial", label: "チュートリアル", icon: "school" },
    { href: "/cheatsheet", label: "チートシート", icon: "description" },
    { href: "/practice", label: "練習", icon: "school" },
    { href: "/projects", label: "プロジェクト", icon: "rocket_launch" },
  ];
</script>

<!-- ヘッダーナビゲーション -->
<header class="top-app-bar surface-container shadow">
  <nav class="container">
    <div class="space"></div>
    <div class="space"></div>
    <div class="space"></div>

    <!-- デスクトップナビゲーション -->
    <div class="hide-small">
      {#each navItems as item}
        {@const fullPath = base + item.href}
        {@const isActive = $page.url.pathname === fullPath}

        <a
          href={fullPath}
          class="button transparent nav-button {isActive
            ? 'active primary-container'
            : 'on-surface-text'}"
        >
          <i>{item.icon}</i>
          <span>{item.label}</span>
        </a>
      {/each}
    </div>
    <div class="max"></div>
  </nav>
</header>

<style>
  .top-app-bar {
    border-bottom: 1px solid var(--outline-variant); /* 下線を追加して区切りを明確に */
  }
  .nav-button {
    padding: 0.75rem 1rem; /* パディングを調整 */
    border-radius: var(--s); /* 角丸を調整 */
    transition: background-color 0.3s ease; /* ホバー時のトランジション */
  }

  .nav-button:hover:not(.active) {
    background-color: var(--surface-variant); /* ホバー時の背景色 */
  }
</style>
