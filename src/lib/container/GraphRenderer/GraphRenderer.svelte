<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import type { Graph } from '../../types';
	import Edge from '$lib/components/Edge/Edge.svelte';
	export let graph: Graph;

	const { nodes, edges } = graph;
	console.log({ edges });
</script>

{#each Object.values($nodes) as node}
	<Node {node} {graph} />
{/each}

{#each Array.from($edges) as [sourceNode, connection]}
	<Edge
		{sourceNode}
		targetNode={connection.targetNode}
		sourceAnchor="output"
		targetAnchor={connection.anchorId}
		curve
	/>
{/each}
