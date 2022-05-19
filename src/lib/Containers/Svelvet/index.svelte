<script lang="ts">
	import GraphView from '$lib/Containers/GraphView/index.svelte';
	import InputNode from '$lib/Nodes/InputNode/index.svelte';
	import OutputNode from '$lib/Nodes/OutputNode/index.svelte';
	import DefaultNode from '$lib/Nodes/DefaultNode/index.svelte';
	import SimpleBezierEdge from '$lib/Edges/SimpleBezierEdge.svelte';
	import { nodesStore, edgesStore, derivedEdges } from '$lib/stores/store';
	import { onMount } from 'svelte';

	export let nodes: any;
	export let edges: any;

	onMount(() => {
		$nodesStore = nodes;
		$edgesStore = edges;
	});
</script>

<GraphView>
	<!-- <svg width="1000px" height="1000px"> -->
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
	<svg class="Edges" width="1000px" height="1000px">
		{#each $derivedEdges as edge}
			<SimpleBezierEdge {edge} />
		{/each}
	</svg>
</GraphView>

<style>
	.Edges {
		border: 1px solid black;
	}
	.Nodes {
		display: grid;
		width: 1000px;
		height: 1000px;
		position: absolute;
		overflow: hidden;
		font-family: 'Segoe UI', sans-serif;
	}
</style>
