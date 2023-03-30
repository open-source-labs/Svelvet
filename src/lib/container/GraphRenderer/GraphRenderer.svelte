<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import type { Graph } from '../../types';
	import Edge from '$lib/components/Edge/Edge.svelte';
	import { cursorPosition } from '$lib/stores/CursorStore';
	import { writable, get } from 'svelte/store';

	export let graph: Graph;
	const { nodes, edges, connectingFrom } = graph;

	$: console.log($edges);
</script>

{#each Object.values($nodes) as node (get(node).id)}
	<Node {...get(node)} {graph} />
{/each}

{#each Array.from($edges) as [anchorId, connection] (anchorId)}
	{@const { sourceNode, targetNode } = connection}
	<Edge
		{sourceNode}
		{targetNode}
		sourceAnchor="output"
		targetAnchor={anchorId.split('-')[1]}
		curve
	/>
{/each}

{#if $connectingFrom}
	<Edge
		step={false}
		sourceNode={$connectingFrom}
		targetNode={{
			anchors: { cursor: { x: 0, y: 0 } },
			position: cursorPosition,
			dimensions: { width: writable(100), height: writable(100) }
		}}
	/>
{/if}
