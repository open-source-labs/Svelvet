<script lang="ts">
	import NodeWrapper from './NodeWrapper.svelte';
	import ColorAnchor from './ColorAnchor.svelte';
	import { generateInput, generateOutput, Resizer, ColorPicker, Node, Anchor } from '$lib';
	import type { CSSColorString } from '$lib';
	import CustomEdge from '../CustomEdge.svelte';

	type Inputs = {
		color: CSSColorString;
	};

	const initialData: Inputs = {
		color: '#E94646'
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.color;
	const output = generateOutput(inputs, procesor);
</script>

<Node useDefaults rotation={-5} position={{ x: 50, y: 400 }} >
	{#snippet children({ selected })}
		<p class="note" id="custom">
			Built In
			<br />
			Components
		</p>
		<NodeWrapper title="Color">
			<div class="node-body">
				<ColorPicker parameterStore={$inputs.color} />
			</div>
		</NodeWrapper>
		<div class="output-anchors">
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
						<ColorAnchor color={output} {connecting} {linked} />
									{/snippet}
				</Anchor>
		</div>
		<Resizer rotation />
	{/snippet}
</Node>

<style>
	.node-body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.output-anchors {
		position: absolute;
		right: -24px;
		top: 8px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.note {
		font-family: 'Reenie Beanie', sans-serif;
		position: absolute;
		top: 10%;
		left: 240px;
		width: 400px;
		transform: rotate(-6deg);
		color: inerhit;
		font-weight: 200px;
		font-size: 30px;
		pointer-events: none;
	}
</style>
