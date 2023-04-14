<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import InternalEdge from '$lib/components/Edge/Edge.svelte';
	import EdgeContext from '$lib/components/Edge/EdgeContext.svelte';
	const graph = getContext<Graph>('graph');

	$: edges = graph.edges;
</script>

<svg class="edges-wrapper">
	{#each Object.entries($edges) as [edgeKey, edge] (edgeKey)}
		{@const CustomEdge = edge.component}
		{#if CustomEdge}
			<EdgeContext {edge}>
				<CustomEdge />
			</EdgeContext>
		{:else}
			<InternalEdge {edge} />
		{/if}
	{/each}
</svg>

<style>
	.edges-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		fill: transparent;
		overflow: visible;
		pointer-events: auto;
	}
</style>
