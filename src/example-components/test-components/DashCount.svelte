<script lang="ts">
	import { generateInput, generateOutput, Slider, Node } from '$lib';
	import NodeWrapper from './NodeWrapper.svelte';

	type Inputs = {
		length: number;
	};

	const initialData = {
		length: 26
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.length;
	const output = generateOutput(inputs, procesor);
</script>

<Node useDefaults position={{ x: 40, y: 158 }} >
	{#snippet children({ selected })}
		<NodeWrapper title="Dash Count" outputStore={output} key="dashCount">
			<div class="node-body">
				<Slider min={0} fixed={0} max={30} step={1} parameterStore={$inputs.length} />
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
		gap: 5px;
	}
</style>
