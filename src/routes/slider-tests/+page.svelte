<script lang="ts">
	import { Svelvet, Node, Slider, Anchor } from '$lib';
	import { generateInput, generateOutput } from '$lib';

	type InputStructure = {
		sliderVal: number;
	};

	const initialData = {
		sliderVal: 10
	};

	const inputs = generateInput(initialData);
	const processor = (inputs: InputStructure) => inputs.sliderVal;
	const outputs = generateOutput(inputs, processor);
	console.log(outputs);
</script>

<Svelvet minimap controls theme={'dark'} width={800} height={500}>
	<Node width={200} height={100} useDefaults position={{ x: 100, y: 200 }}>
		<Slider parameterStore={$inputs.sliderVal} />
		<Anchor outputStore={outputs} output />
	</Node>

	<Node id={'displayNode'} useDefaults width={200} height={100} position={{ x: 400, y: 200 }}>
		<p>{$outputs}</p>
		<Anchor inputsStore={inputs} input direction={'west'} />
	</Node>
</Svelvet>
