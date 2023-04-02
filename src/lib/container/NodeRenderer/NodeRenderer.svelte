<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';

	const graph = getContext<Graph>('graph');

	$: groups = graph.groups;
	$: hidden = $groups.hidden.nodes;
	$: nodes = graph.nodes;
</script>

{#each Object.entries($nodes) as [id, node] (id)}
	{#if !$hidden.has(node)}
		<Node on:nodeClicked {...node} {node} />
	{/if}
{/each}
