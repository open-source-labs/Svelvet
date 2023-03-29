<script lang="ts">
	import type { Graph, Node } from '$lib/types';
	import Anchor from '../Anchor/Anchor.svelte';

	export let node: Node;
	export let label: string;
	export let graph: Graph;

	const { edges, connectingFrom } = graph;

	const { inputs } = node;

	function makeConnection() {
		if (!$connectingFrom) return;
		$inputs[label] = $connectingFrom.outputs;

		const currentConnections = $edges.get($connectingFrom);
		if (currentConnections) {
			currentConnections.push({ targetNode: node, anchorId: label });
		} else {
			$edges.set($connectingFrom, [{ targetNode: node, anchorId: label }]);
		}
		$edges = $edges;
		$connectingFrom = null;
	}
</script>

<div class="input" on:mouseup|stopPropagation={makeConnection} on:mousedown|stopPropagation>
	<Anchor {label} {graph} />
</div>

<style>
	.input {
		/* border: solid 1px green; */
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
