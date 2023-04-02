<script lang="ts">
	import { getContext } from 'svelte';
	import { graphStore } from '$lib/stores';
	import { createNode } from '$lib/utils';
	import { populateStore } from '$lib/container/Svelvet/populateStore';
	import { writable } from 'svelte/store';
	import type { Inputs, Outputs, Graph } from '$lib/types';
	import { get } from 'svelte/store';

	const graph = getContext<Graph>('graph');

	let title: string;
	let inputs: string;
	let outputs: string;
	let formIsVisible = false;

	$: nodes = graph.nodes;

	function addNode() {
		const newNode = createNode({
			id: Math.random(),
			position: { x: Math.random() * 400, y: Math.random() * 400 }
		});

		nodes.add(newNode);

		console.log($nodes);
	}

	function toggleForm() {
		formIsVisible = !formIsVisible;
	}
</script>

<button on:click={addNode} class="node-adder"> Add Node </button>

{#if formIsVisible}
	<div class="form">
		<input placeholder="Title" bind:value={title} />
		<input placeholder="Inputs" bind:value={inputs} />
		<input placeholder="Outputs" bind:value={outputs} />
		<button on:click={addNode}>Add</button>
	</div>
{/if}

<style>
	.node-adder {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 100000;
		width: 100x;
		height: 100px;
	}

	.form {
		width: 200px;
		height: fit-content;
		position: absolute;
		top: 200px;
		left: 200px;
		z-index: 100000;
		align-self: center;
		display: flex;
		flex-direction: column;
		gap: 10px;
		background-color: white;
		padding: 20px;
	}
</style>
