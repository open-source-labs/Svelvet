<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import { generateInput, generateOutput, Slider, RadioGroup } from '$lib';
	import NodeWrapper from './NodeWrapper.svelte';

	type Inputs = {
		length: number;
		type: string;
	};

	const initialData = {
		length: 162,
		type: 'medium'
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.length;
	const output = generateOutput(inputs, procesor);
</script>

<Node useDefaults position={{ x: 40, y: 158 }} let:selected>
	<NodeWrapper title="Dash Length" outputStore={output} key="dashFactor">
		<div class="node-body">
			<Slider min={0} max={200} step={0.05} parameterStore={$inputs.length} />
		</div>
	</NodeWrapper>
</Node>

<style>
	.node-body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 5px;
	}
</style>
