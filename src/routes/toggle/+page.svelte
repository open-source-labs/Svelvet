<script lang="ts">
	import { Svelvet, Node, Toggle, Anchor } from '$lib';
	import { generateInput, generateOutput } from '$lib';

	type InputStructure = {
		value: boolean;
	};

	const initialData = {
		value: false
	};

	const inputs = generateInput(initialData);
	const processor = (inputs: InputStructure) => inputs.value;
	const outputs = generateOutput(inputs, processor);
</script>

<Svelvet minimap controls theme={'dark'} width={800} height={500}>
	<Node width={200} height={100} useDefaults position={{ x: 100, y: 200 }}>
		<Toggle parameterStore={$inputs.value} />
		<Anchor outputStore={outputs} output />
	</Node>

	<Node id={'displayNode'} useDefaults width={200} height={100} position={{ x: 400, y: 200 }}>
		<p id="output-num">{$outputs}</p>
		<Anchor inputsStore={inputs} input direction={'west'} />
	</Node>
</Svelvet>
