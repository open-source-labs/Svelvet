<script lang="ts">
	import { Svelvet, ThemeToggle, Node, ColorPicker, type CSSColorString } from '$lib';
	import { generateInput, generateOutput, Resizer, Anchor } from '$lib';
	import CustomEdge from '../../example-components/CustomEdge.svelte';
	import NodeWrapper from '../../example-components/test-components/NodeWrapper.svelte';
	import Output from '../../example-components/test-components/Output.svelte';
	import Treble from '../../example-components/test-components/Treble.svelte';
	import CircleColor from '../../example-components/test-components/CircleColor.svelte';
	import ColorWheel from '$lib/components/data/ColorPicker/ColorWheel.svelte';
	import ColorAnchor from '../../example-components/test-components/ColorAnchor.svelte';
	import Drawer from '$lib/components/Drawer/Drawer.svelte';

	// Define a variable for the node's color
	let nodeColor = '#E94646';

	// Input data with the initial color
	const initialData = {
		color: nodeColor
	};

	const inputs = generateInput(initialData);

	const processor = (inputs) => inputs.color;
	const output = generateOutput(inputs, processor);
</script>

<Svelvet minimap controls theme={'light'} width={800} height={800}>
	<Node width={350} height={100} useDefaults position={{ x: 100, y: 200 }}>
		<!-- Bind the nodeColor variable to the ColorPicker -->
		<ColorPicker parameterStore={$inputs.color} />

		<Anchor
			connections={[['output', 'color']]}
			
			
			outputStore={output}
			output
			edgeColor={output}
			edgeLabel="Dynamic Edges"
			edgeStyle="bezier"
			edge={CustomEdge}
			locked
		>
			{#snippet children({ linked, connecting })}
						<ColorAnchor color={output} {connecting} linked />
								{/snippet}
				</Anchor>
	</Node>
	<!-- <Drawer height={750}/> -->
	<!-- Bind the node's color to the variable -->
	<!-- <Node --node-color={nodeColor} --node-border-radius="40px" id="node2" label="test" /> -->
</Svelvet>
