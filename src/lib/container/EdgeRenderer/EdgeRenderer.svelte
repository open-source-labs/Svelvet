<script lang="ts">
	import { getContext } from 'svelte';
	import type { Graph } from '$lib/types';
	import Edge from '$lib/components/Edge/Edge.svelte';
	import { writable } from 'svelte/store';

	const graph = getContext<Graph>('graph');

	$: edges = graph.edges;
	$: connectingFrom = graph.connectingFrom;
	$: cursor = graph.cursor;

	let dummyNodePosition = {
		x: writable(0),
		y: writable(0)
	};

	$: console.log($connectingFrom);

	$: {
		dummyNodePosition.x.set($cursor.x);
		dummyNodePosition.y.set($cursor.y);
	}
</script>

{#each Array.from($edges) as [anchorId, connection] (`${connection.targetNode}-${anchorId}`)}
	<Edge
		sourceNode={connection.sourceNode}
		targetNode={connection.targetNode}
		sourceAnchor="output"
		targetAnchor={anchorId.split('-')[1]}
	/>
{/each}

<!-- TEMP EDGE WHEN CONNECTING-->
{#if $connectingFrom}
	<Edge
		sourceNode={$connectingFrom}
		targetNode={{
			anchors: { cursor: { x: 0, y: 0.5 } },
			position: dummyNodePosition,
			dimensions: { width: writable(0), height: writable(0) }
		}}
		active
		animate
		cursor
	/>
{/if}
