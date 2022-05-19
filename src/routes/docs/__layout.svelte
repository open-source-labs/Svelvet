<script>
	import DocsSideNav from '../../components/DocsSideNav.svelte';
</script>

<svelte:head>
	<title>Svelvet Documentation</title>
</svelte:head>

<div class="flex justify-center fixed">
	<div class="w-80 px-8 overflow-y-auto">
		<DocsSideNav />
	</div>
	<slot />
</div>
