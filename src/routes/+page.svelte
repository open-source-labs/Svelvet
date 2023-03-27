<script lang="ts">
	import { Svelvet, Controls, Minimap, Node } from '$lib';
	import NodeAdder from '$lib/components/NodeAdder/NodeAdder.svelte';

	// const mermaid = `Brian --> Svelvet
	// Jen --> Svelvet
	// Britta --> Svelvet
	// Thomas|Geometry|musgraveConfig --> Svelvet
	// Svelvet --> Kevin`;

	const valueConfig = {
		title: 'Value',
		description: 'Outputs a value',
		properties: {
			value: {
				id: 'value',
				type: 'slider',
				initial: 50,
				min: 0,
				max: 100,
				step: 1,
				rounding: 3,
				label: 'Value',
				input: null
			}
		},
		processor: (inputs, properties) => {
			return {
				value: properties.value
			};
		}
	};

	// INPUTS, PROPERTIES, PROCESSOR, OUTPUTS;

	const mathConfig = {
		title: 'Minimum',
		description: 'Returns minimum',
		inputs: {
			value1: {
				id: 'value1',
				type: 'slider',
				initial: 3,
				min: 1,
				max: 4,
				step: 0.01,
				rounding: 3,
				label: 'Value',
				input: null
			},
			value2: {
				id: 'value2',
				type: 'slider',
				initial: 0.4,
				min: 0,
				max: 1,
				step: 0.01,
				rounding: 3,
				label: 'Value',
				input: null
			},
			value3: {
				id: 'value2',
				type: 'slider',
				initial: 0.4,
				min: 0,
				max: 1,
				step: 0.01,
				rounding: 3,
				label: 'Value',
				input: null
			}
		},
		processor: (inputs, properties) => {
			console.log('Running');
			return {
				value: Math.min(inputs.value1, inputs.value2, inputs.value3)
			};
		}
	};

	const initialNodes = [
		{
			id: '1',
			config: mathConfig
		},
		{
			id: '2',
			config: valueConfig
		},
		{
			id: '3',
			config: valueConfig
		}
	];
</script>

<div class="wrapper">
	<Svelvet theme="light" nodes={initialNodes}>
		<Controls />
		<Minimap />
		<NodeAdder />
	</Svelvet>
</div>

<style>
	.wrapper {
		display: flex;
		width: 100%;
		height: 100%;
	}
</style>
