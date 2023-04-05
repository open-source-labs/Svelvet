<script lang="ts">
	import SpecialNode from '$lib/components/SpecialNode/SpecialNode.svelte';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	import Node from '$lib/components/Node/Node.svelte';
	import Tracker from '$lib/components/Tracker.svelte';
	import Slider from '$lib/components/Slider/Slider.svelte';
	import CustomAnchor from './CustomAnchor.svelte';
	import { get, writable } from 'svelte/store';
	import { generateOutput } from '$lib/utils';

	let handle = true;

	type InputStructure = {
		value1: number;
		value2: number;
	};

	const inputs = writable({
		value1: writable(10),
		value2: writable(30)
	});

	const processor = (inputs: InputStructure) => {
		return inputs.value1 + inputs.value2;
	};

	const processor2 = (inputs: InputStructure) => {
		return inputs.value1 * inputs.value2;
	};

	let outputTest = generateOutput<InputStructure, number>(inputs, processor);
	let output2 = generateOutput<InputStructure, number>(inputs, processor2);
</script>

<SpecialNode let:grabHandle let:selected>
	<div use:grabHandle class:selected class:handle>Grab Me!</div>
	<div class="node">
		<div class="input-anchors">
			{#each Object.entries($inputs) as [key, value]}
				<Anchor {key} {inputs} input />
			{/each}
		</div>
		<p>Hello</p>
		{#each Object.entries($inputs) as [key, value]}
			<p>{key}: {get(value)}</p>
			<Slider parameterStore={value} />
		{/each}
		<div class="output-anchors">
			<Anchor output={outputTest}>
				<CustomAnchor />
			</Anchor>
			<Anchor output={output2}>
				<CustomAnchor />
			</Anchor>
		</div>
		<p>{$outputTest}</p>
	</div>
</SpecialNode>

<style>
	p {
		color: white;
	}
	.node {
		width: 100%;
		height: 100%;
		background-color: gray;
		border-radius: 20px;
		position: relative;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		padding: 10px;
	}
	.handle {
		width: 100%;
		position: relative;
		left: -40px;
		height: 40px;
		border-radius: 10px;
		width: 50px;
		top: -80px;
		background-color: red;
	}
	.selected {
		background-color: blue;
	}
	.input-anchors {
		position: absolute;
		top: -29px;
		display: flex;
		gap: 10px;
		margin-right: 10x;
	}

	.output-anchors {
		position: absolute;
		right: -20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-right: 10x;
	}
</style>
