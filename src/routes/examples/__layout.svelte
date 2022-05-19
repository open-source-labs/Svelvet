<script>
	import ExamplesSideNav from '../../components/ExamplesSideNav.svelte';
</script>

<svelte:head>
	<title>Svelvet Examples</title>
</svelte:head>

<div class="flex justify-center fixed">
	<div class="w-80 px-8 overflow-y-auto">
		<ExamplesSideNav />
	</div>
	<slot />
</div>
