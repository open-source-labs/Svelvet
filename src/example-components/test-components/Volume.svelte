<script lang="ts">
	import { Node } from '$lib';

	import { generateInput, generateOutput, Knob, Resizer } from '$lib';
	import NodeWrapper from '../../example-components/test-components/NodeWrapper.svelte';

	type Inputs = {
		degree: number;
	};

	const initialData = {
		degree: 30
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.degree;
	const output = generateOutput(inputs, procesor);
</script>

<Node useDefaults position={{ x: 0, y: 0 }} let:selected>
	<NodeWrapper title="Volume" outputStore={output} key="volume">
		<div class="node-body">
			<Knob
				fixed={0}
				min={10}
				max={20}
				step={2}
				minDegree={30}
				maxDegree={330}
				parameterStore={$inputs.degree}
			/>
		</div>
	</NodeWrapper>
	<Resizer width height rotation />
</Node>
