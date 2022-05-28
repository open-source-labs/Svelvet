<script>
	import DocsSideNav from '../../components/DocsSideNav.svelte';
</script>

<svelte:head>
	<title>Svelvet Documentation</title>
</svelte:head>

<div class="flex justify-start text-gray-800">
	<nav class="hidden md:block border-r h-screen min-w-fit px-8 overflow-y-auto">
		<DocsSideNav />
	</nav>
	<main class="md:max-w-5xl w-auto overflow-y-auto h-screen p-8">
		<slot />
	</main>
</div>
