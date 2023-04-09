<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import Line from '$lib/components/Line.svelte';

	const graph = getContext<Graph>('graph');

	$: edges = graph.edges;
	$: groups = graph.groups;
</script>

{#each Object.entries($edges) as [edgeKey, edge] (edgeKey)}
	<Line {edge} />
{/each}
