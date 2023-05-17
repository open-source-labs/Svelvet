<script lang="ts">
	import { Svelvet, Node } from '$lib';
	import InputNode from '../../example-components/InputNode.svelte';
	import { generateInput, generateOutput, Slider, Knob, Resizer } from '$lib';
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
		<Node useDefaults position={{ x: 0, y: 0 }} let:selected>
			<NodeWrapper title="Volume" outputStore={output} key="volume">
				<div class="node-body">
					<Knob fixed={0} min={0} max={10} step={5} parameterStore={$inputs.value} />
				</div>
			</NodeWrapper>
			<Resizer width height rotation />
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
