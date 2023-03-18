<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import type { Graph, Node as NodeType } from '../../types';
	import type { Writable } from 'svelte/store';
	import type { NodeStore } from '../../types';

	export let nodeStore: NodeStore;
	export let graph: Graph;

	const { isLocked, selectedNodes, transforms } = graph;
</script>

{#each Object.values($nodeStore) as node}
	<Node {node} {selectedNodes} {transforms} {isLocked} {nodeStore} />
{/each}

<style>
</style>
