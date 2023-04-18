<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import { generateInput, generateOutput, Slider } from '$lib';
	import NodeWrapper from './NodeWrapper.svelte';

	type Inputs = {
		num: number;
	};

	const initialData = {
		num: 27
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.num;
	const output = generateOutput(inputs, procesor);
</script>

<Node id="numCircles" position={{ x: 40, y: 268 }} let:selected>
	<NodeWrapper title="Scale" outputStore={output} key="numCircles">
		<div class="node-body">
			<Slider min={1} max={27} step={1} parameterStore={$inputs.num} />
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
