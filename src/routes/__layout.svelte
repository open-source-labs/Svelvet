<script>
	import Footer from '../components/Footer.svelte';
	import '../app.css';
	import TopNav from '../components/TopNav.svelte';
</script>

<div class="overflow-x-hidden">
	<div class="sticky top-0 left-0 right-0 z-50">
		<TopNav />
	</div>
	<slot />
	<Footer />
</div>

<style></style>
