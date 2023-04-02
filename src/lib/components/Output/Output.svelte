<script lang="ts">
	import Anchor from '../Anchor/Anchor.svelte';
	import type { Writable } from 'svelte/store';
	import type { Node, Parameter } from '$lib/types';
	import Visualizer from '../Visualizer/Visualizer.svelte';
	import { setContext, getContext } from 'svelte';

	export let outputStore: Writable<Parameter>;
	export let label = 'output';
	export let connectingFrom: Writable<Node | null>;

	setContext<string>('label', label);
	const node = getContext<Node>('node');

	function startConnection() {
		if (!$connectingFrom) {
			$connectingFrom = node;
		}
	}
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
