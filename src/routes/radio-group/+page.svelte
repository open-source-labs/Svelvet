<script lang="ts">
	import { Svelvet, Node, RadioGroup } from '$lib';
	import { generateInput, generateOutput } from '$lib';

	// Type your input structure
	type InputStructure = {
		option: string;
	};

	// Create initial values for your parameters
	const initialData = {
		option: 'multiply'
	};

	// Generate a formatted inputs store
	const inputs = generateInput(initialData);

	// Specify processor function
	const processor = (inputs: InputStructure) => {
		return inputs.option;
	};

	// Generate output store
	const output = generateOutput(inputs, processor);
</script>

<Svelvet width={1000} height={1000}>
	<Node width={400} height={200} useDefaults>
		<RadioGroup
			options={['subtract', 'add', 'multiply', 'divide']}
			parameterStore={$inputs.option}
		/>
	</Node>
	<Node width={400} height={200} position={{ x: 0, y: 300 }} useDefaults>
		{$output}
	</Node>
</Svelvet>
