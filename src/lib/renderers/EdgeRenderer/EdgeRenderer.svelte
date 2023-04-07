<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import Line from '$lib/components/Line.svelte';

	const graph = getContext<Graph>('graph');

	$: edges = graph.edges;
	$: groups = graph.groups;
</script>

{#each Object.entries($edges) as [edgeKey, { source, target, component: CustomEdge }] (edgeKey)}
	{#if CustomEdge}
		<Line {source} {target} {edgeKey} let:path>
			<CustomEdge {path} slot="label" />
			<CustomEdge {path} />
		</Line>
	{:else}
		<Line {source} {target} {edgeKey} let:path />
	{/if}
{/each}

<style>
	path {
		stroke: blue;
		stroke-width: 4px;
	}
</style>
