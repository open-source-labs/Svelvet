<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import { generateInput, generateOutput, Slider } from '$lib';
	import NodeWrapper from './NodeWrapper.svelte';

	type Inputs = {
		length: number;
	};

	const initialData = {
		length: 162
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.length;
	const output = generateOutput(inputs, procesor);
</script>

<Node position={{ x: -80, y: 48 }} let:selected>
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
	}

	.note {
		font-family: 'Reenie Beanie', sans-serif;
		position: absolute;
		top: -30px;
		left: 40px;
		width: 400px;
		transform: rotate(3deg);
		color: inerhit;
		font-weight: 200px;
		font-size: 30px;
	}
</style>
