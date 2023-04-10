<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import InternalEdge from '$lib/components/Edge/InternalEdge.svelte';

	const graph = getContext<Graph>('graph');
	$: edges = graph.edges;
</script>

{#each Object.entries($edges) as [edgeKey, edge] (edgeKey)}
	<InternalEdge {edge} />
{/each}
