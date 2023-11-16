<script lang="ts">
	import { generateInput, generateOutput, Slider, Node } from '$lib';
	import NodeWrapper from './NodeWrapper.svelte';

	type Inputs = {
		num: number;
	};

	const initialData = {
		num: 0.9
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.num;
	const output = generateOutput(inputs, procesor);
</script>

<Node useDefaults position={{ x: 320, y: 550 }} let:destroy>
	<NodeWrapper {destroy} title="Noise" outputStore={output} key="noise">
		<div class="node-body">
			<Slider min={0} max={1} fixed={2} step={0.01} parameterStore={$inputs.num} />
		</div>
	</NodeWrapper>
</Node>

<style>
	.node-body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
