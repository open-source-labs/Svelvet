<script lang="ts">
	import { Node } from '$lib';

	import { generateInput, generateOutput, Knob, Resizer } from '$lib';
	import NodeWrapper from '../../example-components/test-components/NodeWrapper.svelte';

	type Inputs = {
		data: number;
	};

	const initialData = {
		data: 1
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.data;
	const output = generateOutput(inputs, procesor);
</script>

<Node useDefaults position={{ x: 110, y: 700 }} let:selected>
	<NodeWrapper title="Volume" outputStore={output} key="volume">
		<div class="node-body">
			<Knob
				fixed={0}
				min={0}
				max={100}
				step={5}
				minDegree={30}
				maxDegree={330}
				knobValueColor={'#666565'}
				parameterStore={$inputs.data}
			/>
		</div>
	</NodeWrapper>
	<Resizer width height rotation />
</Node>
