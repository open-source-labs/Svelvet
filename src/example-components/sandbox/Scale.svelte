<script lang="ts">
	import NodeWrapper from './NodeWrapper.svelte';
	import { generateInput, generateOutput, Slider, Node } from '$lib';

	type Inputs = {
		num: number;
	};

	const initialData = {
		num: 56 - Math.random() * 4
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.num;
	const output = generateOutput(inputs, procesor);
</script>

<Node useDefaults id="numCircles" position={{ x: 40, y: 268 }} >
	{#snippet children({ selected })}
		<NodeWrapper title="Scale" outputStore={output} key="scale">
			<div class="node-body">
				<Slider min={25} max={90} step={1} parameterStore={$inputs.num} />
			</div>
		</NodeWrapper>
	{/snippet}
</Node>

<style>
	.node-body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
