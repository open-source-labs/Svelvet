<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import type { Graph } from '../../types';

	export let graph: Graph;

	const { nodes } = graph;
</script>

{#each Object.values($nodes) as node}
	<Node {node} {graph} />
{/each}
