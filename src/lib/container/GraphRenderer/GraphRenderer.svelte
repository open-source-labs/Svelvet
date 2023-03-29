<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import type { Graph } from '../../types';
	import Edge from '$lib/components/Edge/Edge.svelte';
	import { cursorPosition } from '$lib/stores/CursorStore';
	import { writable, get } from 'svelte/store';

	export let graph: Graph;
	const { nodes, edges, connectingFrom } = graph;
</script>

{#each Object.values($nodes) as node}
	{#if get(node).hidden}
		<Node {...get(node)} {graph} />
	{/if}
{/each}

{#each Array.from($edges) as [sourceNode, targets]}
	{#each targets as { targetNode, anchorId }}
		<Edge {sourceNode} {targetNode} sourceAnchor="output" targetAnchor={anchorId} curve />
	{/each}
{/each}

{#if $connectingFrom}
	<Edge
		sourceNode={$connectingFrom}
		targetNode={{
			anchors: { cursor: { x: 0, y: 0 } },
			position: cursorPosition,
			dimensions: { width: writable(100), height: writable(100) }
		}}
	/>
{/if}
