<script lang="ts">
	import GraphView from '$lib/Containers/GraphView/index.svelte';
	import { nodesStore, edgesStore, derivedEdges, widthStore, heightStore } from '$lib/stores/store';
	import { onMount } from 'svelte';

	export let nodes: any;
	export let edges: any;
	export let width: number = 600;
	export let height: number = 600;

	onMount(() => {
		$nodesStore = nodes;
		$edgesStore = edges;
		$widthStore = width;
		$heightStore = height;
	});
</script>

<div class="Flow" style={`width: ${$widthStore}px; height: ${$heightStore}px`}>
	<GraphView {nodesStore} {derivedEdges} />
</div>

<style>
	.Flow {
		position: relative;
		border: 1px solid black;
		/* width: 600px;
		height: 600px;	 */
		overflow: hidden;
		display: grid;
		font-family: 'Segoe UI', sans-serif;
		/* background-color: white; */
	}
</style>
