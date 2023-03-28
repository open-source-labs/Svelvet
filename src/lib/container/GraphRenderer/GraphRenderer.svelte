<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import type { Graph } from '../../types';
	import Edge from '$lib/components/Edge/Edge.svelte';
	export let graph: Graph;
	import { cursorPosition } from '$lib/stores/CursorStore';
	import { writable } from 'svelte/store';
	const { nodes, edges, connectingFrom } = graph;
	console.log({ edges });
</script>

{#each Object.values($nodes) as node}
	<Node {node} {graph} />
{/each}

{#each Array.from($edges) as [sourceNode, { targetNode, anchorId }]}
	<Edge {sourceNode} {targetNode} sourceAnchor="output" targetAnchor={anchorId} curve />
{/each}

{#if $connectingFrom}
	<Edge
		sourceNode={$connectingFrom}
		targetAnchor="cursor"
		targetNode={{
			anchors: { cursor: { x: 0, y: 0 } },
			position: cursorPosition,
			dimensions: { width: writable(100), height: writable(100) }
		}}
	/>
{/if}
