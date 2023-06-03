<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import InternalEdge from '$lib/components/Edge/Edge.svelte';
	import EdgeContext from '$lib/components/Edge/EdgeContext.svelte';

	const graph = getContext<Graph>('graph');

	const edges = graph.edges;
</script>

<!-- {#each Array.from($edges) as [edgeKey, edge] (edgeKey)}
	{@const CustomEdge = edge.component}
	{#if CustomEdge}
		<EdgeContext {edge}>
			<CustomEdge />
		</EdgeContext>
	{:else}
		<InternalEdge {edge} />
	{/if}
{/each} -->
