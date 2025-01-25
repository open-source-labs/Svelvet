<script lang="ts">
	import { Node } from '$lib';

	import { generateInput, generateOutput, Knob, Resizer } from '$lib';
	import NodeWrapper from '../../example-components/test-components/NodeWrapper.svelte';

	type Inputs = {
		data: number;
	};

	const initialData = {
		data: 10
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.data;
	const output = generateOutput(inputs, procesor);
</script>

<Node useDefaults rotation={0} position={{ x: 110, y: 300 }} >
	{#snippet children({ selected })}
		<NodeWrapper title="Treble" outputStore={output} key="treble">
			<div class="node-body">
				<Knob
					fixed={0}
					min={-20}
					max={20}
					step={5}
					minDegree={30}
					maxDegree={330}
					parameterStore={$inputs.data}
				/>
			</div>
		</NodeWrapper>
		<Resizer width height rotation />
	{/snippet}
</Node>
