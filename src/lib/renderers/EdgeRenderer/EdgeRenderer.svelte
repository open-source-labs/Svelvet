<script lang="ts">
	import Edge from '$lib/components/Edge/Edge.svelte';
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import Line from '$lib/components/Line.svelte';

	const graph = getContext<Graph>('graph');

	$: edges = graph.edges;
	$: groups = graph.groups;
</script>

{#each Object.entries($edges) as [edgeKey, { source, target }] (edgeKey)}
	<Line {source} {target} />
{/each}
