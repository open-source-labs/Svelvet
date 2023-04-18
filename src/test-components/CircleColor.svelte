<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	import { generateInput, generateOutput, Resizer } from '$lib';
	import NodeWrapper from './NodeWrapper.svelte';
	import { ColorWheel } from '$lib';
	import type { CSSColorString } from '$lib/types';
	import ColorAnchor from './ColorAnchor.svelte';
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

<Node rotation={-5} position={{ x: 50, y: 400 }} let:selected>
	<p class="note" id="custom">
		Built In
		<br />
		Components
	</p>
	<NodeWrapper title="Color">
		<div class="node-body">
			<ColorWheel parameterStore={$inputs.color} />
		</div>
		<div class="output-anchors">
			<Anchor
				connections={[['output', 'color']]}
				let:linked
				let:connecting
				outputStore={output}
				output
				edgeStyle="bezier"
				edgeColor={output}
				edgeLabel="Dynamic Edges"
			>
				<ColorAnchor color={output} {connecting} {linked} />
			</Anchor>
		</div>
	</NodeWrapper>
	<Resizer rotation />
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
