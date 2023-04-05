<script lang="ts">
	import { Svelvet, Controls, Minimap, Node, SpecialNode } from '$lib';
	import CustomAnchor from '$lib/components/CustomAnchor/CustomAnchor.svelte';
	import CustomComponent from '$lib/components/CustomComponent/CustomComponent.svelte';
	import MinimapNode from '$lib/components/Minimap/MinimapNode.svelte';
	import NodeAdder from '$lib/components/NodeAdder/NodeAdder.svelte';
	import type { ConfigObject, NodeConfig, Inputs, Properties } from '$lib/types';
	import type { UserConfig } from 'vitest/config';
	import TestComponent from '../components/TestComponent.svelte';
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

	const singleColor = {
		title: 'Value',
		description: 'Outputs a value',
		properties: {
			value: {
				id: 'value',
				type: 'color',
				initial: '222222'
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
				max: 100,
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

	const colorConfig = {
		inputs: {
			color1: {
				id: 'color',
				type: 'color',
				initial: '#884020',
				label: 'Color',
				connection: null
			},
			color2: {
				id: 'color',
				type: 'color',
				initial: '#044068',
				label: 'Color',
				connection: null
			},
			color3: {
				id: 'color',
				type: 'color',
				initial: '#024440',
				label: 'Color',
				connection: null
			}
		},
		processor: (inputs: Inputs, properties: Properties) => {
			function hexToRgb(hex) {
				const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result
					? {
							r: parseInt(result[1], 16),
							g: parseInt(result[2], 16),
							b: parseInt(result[3], 16)
					  }
					: null;
			}

			// Convert an RGB object to a hex color
			function rgbToHex(r, g, b) {
				function componentToHex(c) {
					const hex = c.toString(16);
					return hex.length === 1 ? '0' + hex : hex;
				}
				return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
			}

			// Convert the hex colors to RGB objects
			const rgbColor1 = hexToRgb(inputs.color1);
			const rgbColor2 = hexToRgb(inputs.color2);
			const rgbColor3 = hexToRgb(inputs.color3);

			// Add the RGB components and clamp the values to the range [0, 255]
			const r = Math.min(rgbColor1.r + rgbColor2.r + rgbColor3.r, 255);
			const g = Math.min(rgbColor1.g + rgbColor2.g + rgbColor3.g, 255);
			const b = Math.min(rgbColor1.b + rgbColor2.b + rgbColor3.b, 255);

			// Convert the result back to a hex value
			return rgbToHex(r, g, b);
		}
	};

	const visualizer = {
		title: 'Visualizer',
		description: 'Visualizer',
		inputs: {
			value1: {
				id: 'value',
				type: 'slider',
				initial: 2,
				min: 0,
				max: 20,
				step: 1,
				rounding: 3,
				label: 'YCount',
				connection: null
			},
			value2: {
				id: 'value',
				type: 'slider',
				initial: 4,
				min: 0,
				max: 20,
				step: 1,
				rounding: 3,
				label: 'XCount',
				connection: null
			},
			color1: {
				type: 'color',
				initial: '#FFFF22'
			},
			color2: {
				type: 'color',
				initial: '#992883'
			}
		},
		properties: {
			radio: {
				type: 'radio',
				initial: '1',
				options: ['circle', 'square']
			}
		},
		outputs: {
			visualizer: {
				id: 'visualizer',
				type: 'visualizer',
				label: 'Visualizer',
				connection: null
			}
		},
		processor: (inputs: Inputs, properties: Properties) => {
			console.log('Running');
			return { ...inputs, ...properties };
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
			config: colorConfig,
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
		},
		{
			id: '6',
			config: singleColor,
			header: true
		},
		{
			id: '7',
			config: visualizer,
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

	const anchorTest: Array<NodeConfig> = [
		{
			width: 200,
			height: 500,
			bgColor: 'gray',
			outputs: [
				{
					count: 3,
					side: 'right',
					align: 'end',
					gap: 0.1,
					offset: {
						x: -0.1,
						y: -0.1
					},
					component: CustomAnchor
				}
			]
		},
		{
			width: 200,
			height: 100,
			bgColor: 'white',
			header: true,
			headerColor: 'skyblue',
			inputs: [
				{
					side: 'left',
					align: 'start',
					offset: {
						y: 0.1
					}
				}
			]
		},
		{
			width: 200,
			height: 100,
			bgColor: 'white',
			header: true,
			headerColor: 'orange',
			inputs: [
				{
					side: 'left',
					align: 'start',
					offset: {
						y: 0.1
					}
				}
			]
		},
		{
			width: 200,
			height: 100,
			bgColor: 'white',
			header: true,
			headerColor: 'gold',
			inputs: [
				{
					side: 'left',
					align: 'start',
					offset: {
						y: 0.1
					}
				}
			]
		}
	];
</script>

<div class="wrapper">
	<Svelvet theme="light3">
		<TestComponent />
		<SpecialNode width={200} height={200} borderRadius={20} label="Hello From Svelvet" />
	</Svelvet>
</div>

<style>
	.wrapper {
		display: flex;
		width: 100%;
		height: 100%;
	}
</style>
