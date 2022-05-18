<script lang="ts">
	import GraphView from '$lib/Containers/GraphView/index.svelte';
	import InputNode from '$lib/Nodes/InputNode/index.svelte';
	import OutputNode from '$lib/Nodes/OutputNode/index.svelte';
	import DefaultNode from '$lib/Nodes/DefaultNode/index.svelte';
	import SimpleBezierEdge from '$lib/Edges/SimpleBezierEdge.svelte';
	// import StraightEdge from '$lib/Edges/StraightEdge/index.svelte';
	// import BasicEdge from '$lib/Edges/BasicEdge/index.svelte';
	import { Position } from '$lib/types';

	import { nodesStore, edgesStore, setNodes, setEdges } from '$lib/stores/store';
	import { onMount } from 'svelte';

	export let nodes: any;
	export let edges: any;

	// Set each node and edge to the node store (update)
	onMount(() => {
		setNodes(nodes);
		setEdges(edges);
	});
	// This is dummy data that should eventually come from the store
	// const propsObj = {
	// 	sourceX: 20,
	// 	sourceY: 20,
	// 	targetX: 300,
	// 	targetY: 200,
	// 	sourcePosition: Position.Bottom,
	// 	targetPosition: Position.Top,
	// 	label: 'yay bezier!'
	// };
</script>

<svg width="400" height="400">
	{#each $edgesStore as edge}
		<SimpleBezierEdge {edge} />
	{/each}
</svg>

{#each $nodesStore as node}
	{#if node.type === 'input'}
		<InputNode {node}>{node.data.label}</InputNode>
	{:else if node.type === 'output'}
		<OutputNode {node}>{node.data.label}</OutputNode>
	{:else if node.type === 'default'}
		<DefaultNode {node}>{node.data.label}</DefaultNode>
	{/if}
{/each}

<!-- <GraphView /> -->
<style>
</style>
