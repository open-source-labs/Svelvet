<script lang="ts">
	import { getContext } from 'svelte';
	import { graphStore } from '$lib/stores';
	import { createNode } from '$lib/utils/createNode';
	import { populateStore } from '$lib/container/Svelvet/populateStore';
	import { writable } from 'svelte/store';
	import type { Inputs, Outputs } from '$lib/types';
	let { graphId } = getContext('graphId');
	let graph = graphStore.get(graphId);

	let title: string;
	let inputs: string;
	let outputs: string;
	let formIsVisible = false;

	function addNode() {
		const inputsObject = inputs.split(',').reduce((acc: Inputs, input: string) => {
			acc[input.trim()] = null;
			return acc;
		}, {});

		const outputsObject = outputs.split(',').reduce((acc: Outputs, output: string) => {
			acc[output.trim()] = null;
			return acc;
		}, {});

		const newNode = createNode(
			title,
			100,
			200,
			300,
			100,
			[],
			'self',
			{},
			inputsObject,
			outputsObject
		);

		$graph.nodes.update((nodes) => {
			return { ...nodes, [newNode.id]: writable(newNode) };
		});
	}

	function toggleForm() {
		formIsVisible = !formIsVisible;
	}
</script>

<button on:click={toggleForm} class="node-adder"> Add Node </button>

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
		z-index: 100;
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
