<script>
	import { afterUpdate } from 'svelte';
	export let item;
	let itemElement;
	afterUpdate(() => {
		itemElement.scrollTop = item.scrollTop;
	});
</script>
<style>
	div {
		border: 1px solid black;
		margin: 0.2em;
		padding: 0.3em;
		height: 6em;
		overflow: auto;
	}
</style>
<div bind:this={itemElement} on:scroll={(e) => item.scrollTop = e.target.scrollTop}>

	<p>ScrollTop: {item.scrollTop}</p>
	<p>ScrollTop: {item.scrollTop}</p>
	<p>ScrollTop: {item.scrollTop}</p>
	<p>ScrollTop: {item.scrollTop}</p>
	<p>ScrollTop: {item.scrollTop}</p>

</div>