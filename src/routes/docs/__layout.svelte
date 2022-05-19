<script>
	import DocsSideNav from '../../components/DocsSideNav.svelte';
</script>

<svelte:head>
	<title>Svelvet Documentation</title>
</svelte:head>

<div class="flex justify-center fixed">
	<nav class="border-r h-screen min-w-fit w-80 px-8 overflow-y-auto">
		<DocsSideNav />
	</nav>
	<main class="max-w-5xl">
		<slot />
	</main>
</div>
