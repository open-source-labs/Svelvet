<script lang="ts">
	import GraphView from '$lib/Containers/GraphView/index.svelte'
	import { nodesStore, edgesStore, derivedEdges } from '$lib/stores/store';
	import { onMount } from 'svelte';

	export let nodes: any;
	export let edges: any;
	onMount(() => {
		$nodesStore = nodes;
		$edgesStore = edges;
	});

</script>

<div class="Flow">
	<GraphView nodesStore={nodesStore} derivedEdges={derivedEdges} />
</div>

<style>
	.Edges {
		border: 1px solid red;
	}
	.Flow {
		position: relative;	
		border: 1px solid black;
		width: 600px;
		height: 600px;	
		overflow: hidden;
		display: grid;
		font-family: 'Segoe UI', sans-serif;
		/* background-color: white; */
	}
</style>
