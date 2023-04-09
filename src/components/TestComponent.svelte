<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	import Slider from '$lib/components/Slider/Slider.svelte';
	import CustomAnchor from './CustomAnchor.svelte';
	import { generateOutput, generateInput } from '$lib/utils';
	import CustomEdge from './CustomEdge.svelte';
	import Resizer from '$lib/components/Resizer/Resizer.svelte';
	let handle = true;

	type InputStructure = {
		value1: number;
		value2: number;
	};
	const initialData = {
		value1: 10,
		value2: 30
	};

	const inputs = generateInput(initialData);

	const processor = (inputs: InputStructure) => {
		return inputs.value1 + inputs.value2;
	};

	const processor2 = (inputs: InputStructure) => {
		return inputs.value1 * inputs.value2;
	};

	const outputTest = generateOutput(inputs, processor);
	const output2 = generateOutput(inputs, processor2);
</script>

<Node let:grabHandle let:selected>
	<div use:grabHandle class:selected class:handle>Custom Grab Element</div>
	<div class="node">
		<div class="input-anchors">
			{#each Object.entries($inputs) as [key, value]}
				<Anchor {key} inputsStore={inputs} input />
			{/each}
		</div>
		<div class="sliders">
			{#each Object.entries($inputs) as [key, value]}
				<Slider parameterStore={value} />
			{/each}
		</div>
		<div class="output-anchors">
			<Anchor outputStore={outputTest} output edge={CustomEdge}>
				<CustomAnchor />
			</Anchor>
			<Anchor outputStore={output2} output>
				<CustomAnchor />
			</Anchor>
		</div>
		<p class="output">{$outputTest}</p>
		<p class="output">{$output2}</p>
	</div>
	<Resizer width height minHeight={200} minWidth={400} />
</Node>

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
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
	}
	.handle {
		width: fit-content;
		position: absolute;
		left: -40px;
		height: 40px;
		border-radius: 10px;
		top: -80px;
		padding: 10px;
		background-color: rgb(247, 241, 241);
		color: rgb(9, 9, 9);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.output {
		color: black;
	}
	.selected {
		background-color: rgb(255, 230, 0);
	}
	.input-anchors {
		position: absolute;
		top: -29px;
		display: flex;
		gap: 10px;
		margin-right: 10x;
	}

	.sliders {
		display: flex;
		flex-direction: column;
		gap: 10px;
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
