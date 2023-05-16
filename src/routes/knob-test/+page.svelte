<script lang="ts">
	import { Svelvet, Node } from '$lib';
	import InputNode from '../../example-components/InputNode.svelte';
	import { generateInput, generateOutput, Slider, Knob } from '$lib';
	import NodeWrapper from '../../example-components/test-components/NodeWrapper.svelte';
	import Output from '../../example-components/test-components/Output.svelte';
	import Scale from '../../example-components/test-components/Scale.svelte';
	type Inputs = {
		value: number;
	};

	const initialData = {
		value: 0
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.value;
	const output = generateOutput(inputs, procesor);
</script>

<body>
	<Svelvet>
		<Node useDefaults position={{ x: 40, y: 358 }} let:selected>
			<NodeWrapper title="Volume" outputStore={output} key="volume">
				<div class="node-body">
					<Knob fixed={2} min={0} max={1} step={0.01} parameterStore={$inputs.value} />
				</div>
			</NodeWrapper>
		</Node>

		<Scale />

		<Output />

		<!-- <Node useDefaults position={{ x: 400, y: 558 }} /> -->
	</Svelvet>
</body>

<style>
	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>
