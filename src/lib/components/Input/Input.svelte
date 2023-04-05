<script lang="ts">
	import type {
		Anchor as AnchorType,
		Graph,
		Node,
		Connection,
		EdgeKey,
		InputKey,
		OutputKey
	} from '$lib/types';
	import Anchor from '../Anchor/Anchor.svelte';
	import { writable, get } from 'svelte/store';
	import { getContext, onDestroy, onMount } from 'svelte';
	import { createEdge } from '$lib/utils';
	import type { Writable } from 'svelte/store';

	const node = getContext<Node>('node');
	const graph = getContext<Graph>('graph');
	const driven = getContext<Writable<boolean>>('driven');

	export let label: InputKey;
	export let placed = false;
	export let anchor: AnchorType;

	let outputKey: OutputKey | null = null;

	$: outputsRemoved = graph.outputsRemoved;
	$: edgeKey = `${outputKey}+${label}` as EdgeKey;

	$: dimensions = node.dimensions;

	$: edges = graph.edges;
	$: connectingFrom = graph.connectingFrom;
	$: inputs = node.inputs;
	$: connectingFromOutput = connectingFrom.output;
	$: connectingFromNode = connectingFrom.node;

	$: dynamic = anchor.dynamic;
	$: position = anchor.position;
	$: x = position.x;
	$: y = position.y;
	$: initialPercentage = anchor.initialPercentage;
	$: type = anchor.type;
	$: direction = anchor.direction;

	onMount(() => {
		anchor.position.x.set(initialPercentage.x * get(dimensions.width));
		anchor.position.y.set(initialPercentage.y * get(dimensions.height));
	});

	$: if (outputKey && $outputsRemoved.has(outputKey)) {
		removeConnection();
		outputKey = null;
	}

	function makeConnection(e: MouseEvent) {
		console.log(e);
		if (!$connectingFromNode || !$connectingFromOutput || outputKey) {
			connectingFrom.node.set(null);
			connectingFrom.output.set(null);
			return;
		}
		console.log('Connecting');
		// if ($inputs) $inputs[label] = $connectingFrom.outputs;
		outputKey = $connectingFromOutput;
		const connection: Connection = {
			source: $connectingFromNode,
			target: node,
			input: label,
			output: $connectingFromOutput
		};

		edges.add(createEdge(connection), `${$connectingFromOutput}+${label}`);

		if (driven) $driven = true;
		connectingFrom.node.set(null);
		connectingFrom.output.set(null);
	}

	onDestroy(() => {
		removeConnection();
	});

	function removeConnection() {
		//$inputs[label] = writable(get($inputs[label]));
		edges.delete(edgeKey);
		//$driven = false;
	}

	function detachEdge() {
		// const test = edges.get(edgeKey);
		// if (test) {
		// 	const { source } = test;
		// 	$connectingFromNode = get(source.node);
		// 	removeConnection();
		// }
	}
</script>

<div
	class:placed
	style:top="{$y}px"
	style:left="{$x}px"
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
		width: fit-content;
		height: fit-content;
	}
	.placed {
		position: absolute;
	}
</style>
