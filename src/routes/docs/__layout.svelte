<script>
  import DocsSideNav from '../../components/DocsSideNav.svelte';
</script>

<svelte:head>
  <title>Svelvet Documentation</title>
</svelte:head>
<!-- Ask Team: Clarify with team how slots are working and each different "main" page is rendering based on what user is clicking -->
<div class="flex justify-start text-gray-800 overflow-x-hidden sticky">
  <nav class="hidden md:block border-r min-w-fit px-8 overflow-y-auto pb-24">
    <DocsSideNav />
  </nav>
  <main class="md:max-w-6xl w-auto overflow-y-auto overflow-x-hidden h-fit p-8 pb-24">
    <slot />
  </main>
</div>
