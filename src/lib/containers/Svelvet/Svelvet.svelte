<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import type { Graph, GraphKey, NodeConfig, NodeStore } from '$lib/types';
	import { populateStore } from '$lib/utils';
	import { get } from 'svelte/store';
	import { flowChartParser, createNode, createGraph } from '$lib/utils/';
	import { populateMermaidNodes } from '../../utils/drawers/flowchartDrawer';
	import { graphStore } from '$lib/stores';
	import Flow from './Flow.svelte';
	import { reloadStore } from '$lib/utils/savers/reloadStore';

	export let mermaid = '';
	export let theme = 'light';
	export let graphId: GraphKey = `G-${graphStore.count() + 1}`;
	export let nodes: Array<NodeConfig> = [];
	export let snapTo = 1;
	export let initialZoom = 1;
	export let LR = false;

	let graph: Graph;
	let nodeStore: NodeStore;

	setContext('snapTo', snapTo);
	setContext('theme', theme);
	setContext('direction', LR ? 'LR' : 'TD');

	onMount(() => {
		graph = createGraph(graphId, initialZoom);
		if (nodes.length && !mermaid) {
			const nodeObjects = generateNodes(nodes);
			populateStore(nodeObjects, graph);
			nodeStore = graph.nodes;
		}

		// if (mermaid.length) {
		// 	const createdNodes = populateNodes(mermaid);
		// 	populateStore(Object.values(createdNodes), graph);
		// 	nodeStore = graph.nodes;
		// }

		if (mermaid.length) {
			const mermaidNodes = flowChartParser(mermaid);
			console.log({ mermaidNodes });
			const createdNodes = populateMermaidNodes(mermaidNodes, 'td');
			console.log({ createdNodes });
			populateStore(Object.values(createdNodes), graph);
			nodeStore = graph.nodes;
		}
		const { edges: edgeStore } = graph;

		console.log(get(nodeStore));

		// edges.forEach((edge) => {
		// 	const { source, target } = edge;

		// 	const sourceNode = nodeStore.get(source);
		// 	const targetNode = nodeStore.get(target.nodeId);
		// 	const currentConnections = get(edgeStore).get(sourceNode);
		// 	console.log(sourceNode, targetNode, currentConnections);
		// 	const newConnection = { targetNode: targetNode, anchorId: target.anchorId };

		// 	if (currentConnections) {
		// 		currentConnections.push(newConnection);
		// 	} else {
		// 		get(edgeStore).set(sourceNode, [newConnection]);
		// 	}
		// });

		graphStore.add(graph, graphId);

		// const { transforms } = graph;
		// const { scale } = transforms;
		// scale.set(initialZooom);
	});

	function generateNodes(nodes: Array<NodeConfig>) {
		const nodeObjects = nodes.map((node) => createNode(node));
		return nodeObjects;
	}
</script>

{#if graph}
	<Flow {...$$props} {graph}><slot /></Flow>
{/if}

<style>
	:global(*) {
		font-family: 'Rubik';
		box-sizing: border-box;
		user-select: none;
		margin: 0;
		line-height: 1rem;
		font-size: 0.85rem;
	}
	:global(html, body) {
		height: 100%;
	}
</style>
