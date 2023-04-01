<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import type {
		Graph,
		GraphKey,
		NodeConfig,
		XYPair,
		BackgroundStyles,
		NodeStore
	} from '$lib/types';
	import { createGraph } from '$lib/utils';
	import { populateStore } from './populateStore';
	import { get } from 'svelte/store';
	import { flowChartParser } from '$lib/utils/parser';
	import { populateMermaidNodes } from './flowchartDrawer';
	import { graphStore } from '$lib/stores';
	import { createNode } from '$lib/utils';
	import Flow from './Flow.svelte';

	export let mermaid = '';
	export let theme = 'light';
	export let width: number = 100;
	export let height: number = 100;
	export let graphId: GraphKey = '1'; //Math.floor(Math.random() * 100).toString();
	export let style: BackgroundStyles = 'dots';
	export let nodes: Array<NodeConfig> = [];
	export let edges: Array<object> = [];
	export let snapTo = 1;
	export let initialZoom = 1;
	export let minimap = false;
	export let controls = false;
	export let boundary: XYPair = { x: Infinity, y: Infinity };
	export let fixedZoom = false;
	export let disableSelection = false;

	let graph: Graph;
	let nodeStore: NodeStore;

	setContext('snapTo', snapTo);
	setContext('graphId', graphId);

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

		graphStore.add(graph);

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
	<Flow {...$$props} {graph} />
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
