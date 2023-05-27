<script lang="ts">
	import { Node } from '$lib';

	import { generateInput, generateOutput, Knob, Resizer } from '$lib';
	import NodeWrapper from '../../example-components/test-components/NodeWrapper.svelte';

	type Inputs = {
		data: number;
	};

	const initialData = {
		data: 2
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.data;
	const output = generateOutput(inputs, procesor);
</script>

<Node useDefaults position={{ x: 110, y: 100 }} let:selected>
	<NodeWrapper title="Bass" outputStore={output} key="bass">
		<div class="node-body">
			<Knob
				fixed={0}
				min={0}
				max={20}
				step={2}
				minDegree={30}
				maxDegree={330}
				parameterStore={$inputs.data}
			/>
		</div>
	</NodeWrapper>
	<Resizer width height rotation />
</Node>
