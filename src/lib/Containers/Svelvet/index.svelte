<script lang="ts">
	// import InputNode from '$lib/Nodes/InputNode/index.svelte';
	// import OutputNode from '$lib/Nodes/OutputNode/index.svelte';
	// import DefaultNode from '$lib/Nodes/DefaultNode/index.svelte';
	// import SimpleBezierEdge from '$lib/Edges/SimpleBezierEdge.svelte';
	import GraphView from '$lib/Containers/GraphView/index.svelte'
	import { nodesStore, edgesStore, derivedEdges } from '$lib/stores/store';
	import { onMount } from 'svelte';

	export let nodes: any;
	export let edges: any;
	// export let position: any;
		// make default position relative, developers can optionally customize position 

	onMount(() => {
		$nodesStore = nodes;
		$edgesStore = edges;
	});

</script>

<div class="Flow">
	<GraphView nodesStore={nodesStore} derivedEdges={derivedEdges} />
</div>

<!-- <div class="Flow">
	<div class="Nodes">
		{#each $nodesStore as node}
			{#if node.type === 'input'}
				<InputNode {node}>{node.data.label}</InputNode>
			{:else if node.type === 'output'}
				<OutputNode {node}>{node.data.label}</OutputNode>
			{:else if node.type === 'default'}
				<DefaultNode {node}>{node.data.label}</DefaultNode>
			{/if}
		{/each}
	</div>
			
	<svg class="Edges" viewBox="0 0 600 600">
		<g>
		{#each $derivedEdges as edge}
			<SimpleBezierEdge {edge} />
		{/each}
		</g>
	</svg>
</div> -->


<style>
	/* .Edges {
		border: 1px solid red;
	}
	.Nodes {
		width: 100%;
		height: 100%; 
	} */
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
