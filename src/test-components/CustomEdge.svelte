<script lang="ts">
	import Edge from '$lib/components/Edge/Edge.svelte';

	export let path: string;
	function handleClick() {}
</script>

<Edge>
	<path d={path} />
	<button slot="label"><p>Custom Edge</p></button>
</Edge>

<style>
	path {
		stroke: rgb(246, 231, 20);
		stroke-width: 4px;
	}

	button {
		background-color: rgb(172, 2, 2);
		width: 150px;
		height: 100px;
		border-radius: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	p {
		color: rgb(255, 238, 0);
		line-height: 0;
		font-size: 16px;
	}
</style>
