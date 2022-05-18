<script>
	import '../app.css';
	import TopNav from '../components/TopNav.svelte';
	import SideNav from '../components/SideNav.svelte';
	import { page } from '$app/stores';
</script>

<div class="sticky top-0 left-0 right-0">
	<TopNav />
</div>
<div class="flex justify-center fixed">
	{#if $page.url.pathname !== '/'}
		<div class="w-80 px-8 overflow-y-auto">
			<SideNav />
		</div>
	{/if}
	<slot />
</div>

<style></style>
