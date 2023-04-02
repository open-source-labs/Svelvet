<script lang="ts">
	import Anchor from '../Anchor/Anchor.svelte';
	import type { Writable } from 'svelte/store';
	import type { Node, Parameter, Graph, EdgeKey, OutputKey } from '$lib/types';
	import Visualizer from '../Visualizer/Visualizer.svelte';
	import { setContext, getContext, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { writable } from 'svelte/store';

	export let outputStore: Writable<Parameter>;
	export let label = 'output';
	export let connectingFrom: Writable<Node | null>;

	const driven = writable(false);

	setContext<string>('label', label);
	const node = getContext<Node>('node');
	const graph = getContext<Graph>('graph');

	setContext<Writable<boolean>>('driven', driven);

	const outputKey: OutputKey = `O-${label}/${node.id}`;

	function startConnection() {
		if (!$connectingFrom) {
			$connectingFrom = node;
			$driven = true;
		}
	}

	onDestroy(() => {
		graph.outputRemoved.set(outputKey);
	});
</script>

<div class="output" on:mousedown|stopPropagation={startConnection}>
	{#if typeof $outputStore === 'object'}
		<Visualizer {outputStore} />
	{:else}
		<p>{label}</p>
	{/if}

	<Anchor isOutput />
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
