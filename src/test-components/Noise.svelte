<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import { generateInput, generateOutput, Slider } from '$lib';
	import NodeWrapper from './NodeWrapper.svelte';

	type Inputs = {
		num: number;
	};

	const initialData = {
		num: 6.5
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.num;
	const output = generateOutput(inputs, procesor);
</script>

<Node position={{ x: 320, y: 550 }} let:selected>
	<NodeWrapper title="Noise" outputStore={output} key="noise">
		<div class="node-body">
			<Slider min={0} max={10} step={0.5} parameterStore={$inputs.num} />
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
