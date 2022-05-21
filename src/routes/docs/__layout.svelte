<script>
	import DocsSideNav from '../../components/DocsSideNav.svelte';
</script>

<svelte:head>
	<title>Svelvet Documentation</title>
</svelte:head>

<div class="flex justify-start text-gray-800">
	<nav class="border-r h-screen min-w-fit px-8 overflow-y-auto">
		<DocsSideNav />
	</nav>
	<main class="max-w-5xl overflow-y-auto h-screen m-8">
		<slot />
	</main>
</div>
