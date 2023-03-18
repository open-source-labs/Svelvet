<script lang="ts">
	import GraphRenderer from '../GraphRenderer/GraphRenderer.svelte';
	import Background from '../Background/Background.svelte';
	import ZoomPanWrapper from '../ZoomPanWrapper/ZoomPanWrapper.svelte';
	import { onMount } from 'svelte';
	import type { GraphKey, BackgroundStyles, NodeStore, Graph } from '$lib/types';
	import { graphStore } from '$lib/stores';
	import { createGraph } from '$lib/utils/createGraph';
	import { populateNodes } from './populateNodes';
	import { populateStore } from './populateStore';

	export let mermaid = '';
	export let theme = 'light';
	export let width: number = 600;
	export let height: number = 600;
	export let graphId: GraphKey = '1';
	export let style: BackgroundStyles = 'dots';

	let graph: Graph;
	let nodeStore: NodeStore;

	onMount(() => {
		graph = createGraph(graphId);
		const nodes = populateNodes(mermaid);
		nodeStore = graph.nodes;
		populateStore(Object.values(nodes), graph.nodes);
		graphStore.add(graph);
	});
</script>

<div class="svelvet-wrapper" style="width: {width}px; height: {height}px;">
	{#if graph}
		<ZoomPanWrapper {graph}>
			<GraphRenderer {graph} {nodeStore} />
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
	}
	.svelvet-wrapper:focus {
		outline: none;
		box-shadow: 0 0 0 2px blue;
	}
	:global() * {
		box-sizing: border-box;
		user-select: none;
	}
	:root {
		--dark-background: hsl(0, 2%, 10%);
		--light-background: hsl(0, 0%, 93%);
	}
</style>
