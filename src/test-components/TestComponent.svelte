<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	import Slider from '$lib/components/data/Slider/Slider.svelte';
	import CustomAnchor from './CustomAnchor.svelte';
	import { generateOutput, generateInput } from '$lib/utils';
	import CustomEdge3 from './CustomEdge3.svelte';
	import CustomEdge from './CustomEdge.svelte';
	import Resizer from '$lib/components/Resizer/Resizer.svelte';
	import RadioGroup from '$lib/components/data/RadioGroup/RadioGroup.svelte';
	import { get, writable } from 'svelte/store';
	let handle = true;

	type InputStructure = {
		value1: number;
		value2: number;
		option: string;
	};
	const initialData = {
		value1: 10,
		value2: 30,
		option: 'multiply'
	};

	const inputs = generateInput(initialData);

	const processor = (inputs: InputStructure) => {
		return inputs.value1 + inputs.value2;
	};

	const processor2 = (inputs: InputStructure) => {
		if (inputs.option === 'add') {
			return inputs.value1 + inputs.value2;
		} else if (inputs.option === 'subtract') {
			return inputs.value1 - inputs.value2;
		} else if (inputs.option === 'multiply') {
			return inputs.value1 * inputs.value2;
		} else {
			return inputs.value1 / inputs.value2;
		}
	};
	const outputTest = generateOutput(inputs, processor);
	const output2 = generateOutput(inputs, processor2);
</script>

<Node id="55" let:grabHandle let:selected edge={CustomEdge3}>
	<div use:grabHandle class:selected class:handle>Custom Grab Element</div>
	<div class="node">
		<div class="radio-group">
			<RadioGroup
				options={['subtract', 'add', 'multiply', 'divide']}
				parameterStore={$inputs.option}
			/>
		</div>
		<div class="input-anchors">
			{#each Object.entries($inputs) as [key, value] (key)}
				<Anchor {key} inputsStore={inputs} input />
			{/each}
		</div>
		<div class="sliders">
			<Slider parameterStore={$inputs.value1} />
			<Slider parameterStore={$inputs.value2} />
		</div>
		<div class="output-anchors">
			<Anchor let:linked outputStore={outputTest} direction="east" output edge={CustomEdge}>
				<CustomAnchor {linked} />
			</Anchor>
			<Anchor outputStore={output2} direction="east" output>
				<CustomAnchor />
			</Anchor>
		</div>
		<p>{$output2}</p>
	</div>
	<Resizer width height minHeight={200} minWidth={400} />
</Node>

<style>
	* {
		box-sizing: border-box;
	}

	.radio-group {
		display: flex;
		gap: 10px;
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
