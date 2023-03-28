<script lang="ts">
	import GraphRenderer from '../GraphRenderer/GraphRenderer.svelte';
	import Background from '../Background/Background.svelte';
	import ZoomPanWrapper from '../ZoomPanWrapper/ZoomPanWrapper.svelte';
	import { onMount, setContext } from 'svelte';
	import type { GraphKey, BackgroundStyles, NodeStore, Graph } from '$lib/types';
	import { graphStore } from '$lib/stores';
	import { createGraph, createNode } from '$lib/utils/';
	import { populateNodes } from './populateNodes';
	import { populateStore } from './populateStore';
	import type { UserNode } from '$lib/utils/';

	export let mermaid = '';
	export let theme = 'light';
	export let width: number = 100;
	export let height: number = 100;
	export let graphId: GraphKey = '1'; //Math.floor(Math.random() * 100).toString();
	export let style: BackgroundStyles = 'dots';
	export let nodes: Array<UserNode> = [];
	export let edges: Array<object> = [];

	let graph: Graph;
	let nodeStore: NodeStore;

	onMount(() => {
		graph = createGraph(graphId);

		if (nodes.length) {
			const nodeObjects = generateNodes(nodes);
			populateStore(nodeObjects, graph);
		}

		if (mermaid.length) {
			const createdNodes = populateNodes(mermaid);
			populateStore(Object.values(createdNodes), graph);
			nodeStore = graph.nodes;
		}

		graphStore.add(graph);
	});

	function generateNodes(nodes: Array<UserNode>) {
		const nodeObjects = nodes.map((node) => createNode(node));
		return nodeObjects;
	}

	setContext('graphId', { graphId });
</script>

<div class="svelvet-wrapper" style="width: 100%; height: 100%;">
	{#if graph}
		<ZoomPanWrapper {graph}>
			<GraphRenderer {graph} />
		</ZoomPanWrapper>
		<Background --background-color="var(--{theme}-background)" {style} {graph} />
		<slot {graphId} />
	{/if}
</div>

<style>
	.svelvet-wrapper {
		position: absolute;
		overflow: hidden;
		cursor: move;
		border-radius: 20px;
		background-color: white;
		width: 100%;
		height: 100%;
	}
	.svelvet-wrapper:focus {
		outline: none;
		box-shadow: 0 0 0 2px blue;
	}
	:global(*) {
		box-sizing: border-box;
		user-select: none;
	}
	:root {
		--dark-background: hsl(0, 2%, 10%);
		--light-background: hsl(0, 0%, 93%);
	}
</style>
