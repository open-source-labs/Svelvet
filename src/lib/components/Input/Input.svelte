<script lang="ts">
	import type { Graph, Node, AnchorKey } from '$lib/types';
	import Anchor from '../Anchor/Anchor.svelte';
	import { writable, get } from 'svelte/store';
	import { getContext } from 'svelte';

	const node = getContext<Node>('node');
	const graph = getContext<Graph>('graph');
	const label = getContext<string>('label');

	let anchorId: AnchorKey = `${node.id}-${label}`;

	$: edges = graph.edges;
	$: connectingFrom = graph.connectingFrom;
	$: inputs = node.inputs;

	function makeConnection() {
		if (!$connectingFrom) return;
		$inputs[label] = $connectingFrom.outputs;

		$edges.set(anchorId, { targetNode: node, sourceNode: $connectingFrom });

		$edges = $edges;
		$connectingFrom = null;
	}

	function removeConnection() {
		$inputs[label] = writable(get($inputs[label]));
		$edges.delete(anchorId);
		$edges = $edges;
	}

	function detachEdge() {
		const test = $edges.get(anchorId);
		if (test) {
			const { sourceNode } = test;
			$connectingFrom = sourceNode;
			removeConnection();
		}
	}
</script>

<div
	class="input"
	on:mouseup|stopPropagation={makeConnection}
	on:mousedown|stopPropagation={detachEdge}
>
	<Anchor />
</div>

<style>
	.input {
		/* border: solid 1px green; */
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
