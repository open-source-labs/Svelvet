<script lang="ts">
	import { Svelvet, Node } from '$lib';
	import InputNode from '../../example-components/InputNode.svelte';
	import { generateInput, generateOutput, Slider } from '$lib';
	import NodeWrapper from '../../example-components/test-components/NodeWrapper.svelte';
	type Inputs = {
		length: number;
	};

	const initialData = {
		length: 10
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.length;
	const output = generateOutput(inputs, procesor);
</script>

<body>
	<Svelvet>
		<Node useDefaults position={{ x: 40, y: 158 }} let:selected>
			<NodeWrapper title="Dash Count" outputStore={output} key="dashCount">
				<div class="node-body">
					<!-- REPLACE SLIDER COMPONENT WITH KNOB COMPONENT -->
					<Slider min={-100} fixed={0} max={100} step={5} parameterStore={$inputs.length} />
				</div>
			</NodeWrapper>
		</Node>
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
