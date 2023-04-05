<script lang="ts">
	import Anchor from '../Anchor/Anchor.svelte';
	import type { Writable } from 'svelte/store';
	import type {
		Node,
		Parameter,
		Graph,
		EdgeKey,
		OutputKey,
		XYPair,
		InputKey,
		Anchor as AnchorType
	} from '$lib/types';
	import Visualizer from '../Visualizer/Visualizer.svelte';
	import { setContext, getContext, onDestroy, onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { writable } from 'svelte/store';

	export let outputStore: Writable<Parameter>;
	export let label: OutputKey;
	export let placed = false;
	export let anchor: AnchorType;

	const driven = writable(false);

	const node = getContext<Node>('node');
	const graph = getContext<Graph>('graph');
	setContext<string>('label', label);
	setContext<Writable<boolean>>('driven', driven);

	onMount(() => {
		anchor.position.x.set(initialPercentage.x * get(dimensions.width));
		anchor.position.y.set(initialPercentage.y * get(dimensions.height));
	});

	$: dimensions = node.dimensions;
	$: connectingFromNode = graph.connectingFrom.node;
	$: connectingFromOutput = graph.connectingFrom.output;
	$: initialPercentage = anchor.initialPercentage;
	$: outputsRemoved = graph.outputsRemoved;
	$: position = anchor.position;
	$: x = position.x;
	$: y = position.y;

	function startConnection(e) {
		console.log(e);
		console.log(label);
		if (!$connectingFromNode) {
			$connectingFromNode = node;
			$connectingFromOutput = label;
			$driven = true;
		}
	}

	onDestroy(() => {
		outputsRemoved.update((outputs) => {
			return new Set([...outputs, label]);
		});
	});
</script>

<div
	class:placed
	style:top="{$y}px"
	style:left="{$x}px"
	class="output"
	on:mousedown|stopPropagation|preventDefault={startConnection}
>
	{#if typeof $outputStore === 'object'}
		<Visualizer {outputStore} />
	{/if}

	<Anchor isOutput />
</div>

<style>
	.output {
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
