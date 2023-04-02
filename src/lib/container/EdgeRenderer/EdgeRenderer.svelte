<script lang="ts">
	import { getContext } from 'svelte';
	import type { Graph } from '$lib/types';
	import Edge from '$lib/components/Edge/Edge.svelte';
	import { writable } from 'svelte/store';
	import { source } from '$lib/stores';
	import { get } from 'svelte/store';
	const graph = getContext<Graph>('graph');

	$: edges = graph.edges;
	$: connectingFrom = graph.connectingFrom;
	$: cursor = graph.cursor;
	$: groups = graph.groups;
	$: selectedNodes = $groups.selected.nodes;

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

{#each Object.entries($edges) as [edgeKey, { source, target }] (edgeKey)}
	<Edge
		sourceNode={get(source.node)}
		targetNode={get(target.node)}
		targetAnchor={get(target.input)}
		active={$selectedNodes.has(get(source.node)) || $selectedNodes.has(get(target.node))}
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
