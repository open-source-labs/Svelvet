<script lang="ts">
	import Anchor from '../Anchor/Anchor.svelte';
	import type { Writable } from 'svelte/store';
	import type { Node, Graph } from '$lib/types';

	export let outputStore;
	export let label = 'output';
	export let node: Node;
	export let connectingFrom: Writable<Node | null>;
	export let graph: Graph;

	function startConnection() {
		if (!$connectingFrom) {
			$connectingFrom = node;
		}
	}
</script>

<div class="output" on:mousedown|stopPropagation={startConnection}>
	<p>{$outputStore}</p>
	<Anchor {graph} {label} isOutput />
</div>

<style>
	.output {
		/* border: solid 1px green; */
		display: flex;
		align-items: center;
		align-self: end;
		justify-content: center;
	}

	p {
		margin: 0;
	}
</style>
