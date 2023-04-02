<script lang="ts">
	import type { Graph, Node, Connection, EdgeKey, InputKey, OutputKey } from '$lib/types';
	import Anchor from '../Anchor/Anchor.svelte';
	import { writable, get } from 'svelte/store';
	import { getContext, onDestroy } from 'svelte';
	import { createEdge } from '$lib/utils';
	import type { Writable } from 'svelte/store';

	const node = getContext<Node>('node');
	const graph = getContext<Graph>('graph');
	const label = getContext<string>('label');
	const driven = getContext<Writable<boolean>>('driven');

	const inputKey: InputKey = `I-${label}/${node.id}`;
	const outputKey: Writable<OutputKey> = writable(`O-?/N-?/${graph.id}` as OutputKey);

	$: outputRemoved = graph.outputRemoved;
	$: edgeKey = `${$outputKey}+${inputKey}` as EdgeKey;

	$: edges = graph.edges;
	$: connectingFrom = graph.connectingFrom;
	$: inputs = node.inputs;

	$: if ($outputRemoved === $outputKey) removeConnection();

	function makeConnection() {
		if (!$connectingFrom) return;
		$inputs[label] = $connectingFrom.outputs;

		$outputKey = `O-output/${$connectingFrom.id}`;

		const connection: Connection = {
			source: $connectingFrom,
			target: node,
			input: inputKey,
			output: $outputKey
		};

		edges.add(createEdge(connection), `${$outputKey}+${inputKey}`);

		$driven = true;
		$connectingFrom = null;
	}

	onDestroy(() => {
		removeConnection();
	});

	function removeConnection() {
		$inputs[label] = writable(get($inputs[label]));
		edges.delete(edgeKey);
		$driven = false;
	}

	function detachEdge() {
		const test = edges.get(edgeKey);
		if (test) {
			const { source } = test;
			$connectingFrom = get(source.node);
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
