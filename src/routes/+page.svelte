<script lang="ts">
	import { Svelvet, Controls, Minimap, Node } from '$lib';
	import NodeAdder from '$lib/components/NodeAdder/NodeAdder.svelte';
	import type { ConfigObject, NodeConfig, Inputs, Properties } from '$lib/types';
	const mermaid = `A & B --> C
	C--> D
	D --> E
	E --> F`;
	const returnValue = (inputs: Inputs, properties: Properties) => {
		return properties.value;
	};
	const valueConfig = {
		title: 'Value',
		description: 'Outputs a value',
		properties: {
			value: {
				id: 'value',
				type: 'slider',
				initial: 50,
				min: 0,
				max: 60,
				step: 1,
				rounding: 3,
				label: 'Value',
				connection: null
			}
		},
		processor: returnValue
	};

	const addConfig: ConfigObject = {
		title: 'Value',
		description: 'Outputs a value',
		inputs: {
			value1: {
				id: 'value',
				type: 'slider',
				initial: 50,
				min: 0,
				max: 60,
				step: 1,
				rounding: 3,
				label: 'Value',
				connection: null
			},
			value2: {
				id: 'value',
				type: 'slider',
				initial: 50,
				min: 0,
				max: 60,
				step: 1,
				rounding: 3,
				label: 'Value',
				connection: null
			}
		},
		properties: {
			property1: {
				id: 'value',
				type: 'radio',
				initial: 1,
				options: ['add', 'multiply', 'max'],
				label: 'Value',
				connection: null
			}
		},
		processor: (inputs, properties) => {
			console.log('Running');
			switch (properties.property1) {
				case 'add':
					return inputs.value1 + inputs.value2;
				case 'multiply':
					return inputs.value1 * inputs.value2;
				case 'max':
					return Math.max(inputs.value1, inputs.value2);
			}
		}
	};

	// INPUTS, PROPERTIES, PROCESSOR, OUTPUTS;
	let inputsStressTest = {};
	for (let i = 0; i < 10; i++) {
		inputsStressTest['value' + i] = {
			id: 'value',
			type: 'slider',
			initial: 50,
			min: 0,
			max: 60,
			step: 1,
			rounding: 3,
			label: 'Value',
			connection: null
		};
	}

	const mathConfig = {
		title: 'Minimum',
		description: 'Returns minimum',
		inputs: inputsStressTest,
		processor: (inputs: Inputs, properties: Properties) => {
			console.log('Running');
			return Object.values(inputs).reduce((a, b) => Math.min(a, b));
		}
	};

	const initialNodes = [
		{
			id: '1',
			config: mathConfig,
			header: true
		},
		{
			id: '2',
			config: valueConfig,
			header: true
		},
		{
			id: '3',
			config: valueConfig,
			header: true
		},

		{
			id: '4',
			config: valueConfig,
			header: true
		},
		{
			id: '5',
			config: addConfig,
			header: true
		}
	];

	const otherNodes = Array(2)
		.fill(null)
		.map((_, i) => ({
			id: `${i + 6}`,
			config: valueConfig
		}));

	const testNodes: Array<NodeConfig> = [
		{
			id: 1,
			position: { x: 50, y: 50 },
			data: { label: 'default styling' },
			width: 150,
			height: 40
		},
		{
			id: 2,
			position: { x: 50, y: 110 },
			data: { label: 'borderColor' },
			width: 150,
			height: 40,
			borderColor: 'red',
			bgColor: 'white'
		},
		{
			id: 3,
			position: { x: 220, y: 50 },
			data: { label: 'textColor' },
			width: 150,
			height: 40,
			textColor: '#3F6FD6',
			bgColor: 'white'
		},
		{
			id: 4,
			position: { x: 220, y: 110 },
			data: { label: 'bgColor' },
			width: 150,
			height: 40,
			textColor: 'white',
			borderColor: 'transparent',
			bgColor: '#FF9ABD'
		},
		{
			id: 5,
			position: { x: 85, y: 170 },
			data: { label: 'width and height' },
			width: 90,
			height: 110,
			bgColor: 'white'
		},
		{
			id: 6,
			position: { x: 250, y: 175 },
			data: { label: 'borderRadius' },
			width: 100,
			height: 100,
			bgColor: 'white',
			borderRadius: 50
		},
		{
			id: 7,
			position: { x: 50, y: 300 },
			data: { label: 'clickCallback' },
			width: 150,
			height: 40,
			bgColor: 'white',
			clickCallback: (node) => console.log(node)
		}
	];

	// const initialEdges = [
	// 	{
	// 		id: 'e1-2',
	// 		source: '2',
	// 		target: { anchorId: 'bottom-1', nodeId: '5' }
	// 	},
	// 	{
	// 		id: 'e3-2',
	// 		source: '3',
	// 		target: { anchorId: 'bottom-2', nodeId: '5' }
	// 	}
	// ];
</script>

<div class="wrapper">
	<Svelvet theme="dark" {mermaid}>
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
