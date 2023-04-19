<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	import { generateInput, generateOutput, Slider } from '$lib';
	import CustomAnchor from './CustomAnchor.svelte';
	import NodeWrapper from './NodeWrapper.svelte';
	type Inputs = {
		width: number;
	};

	const initialData = {
		width: 2.35
	};
	const inputs = generateInput(initialData);
	const procesor = (inputs: Inputs) => inputs.width;
	const output = generateOutput(inputs, procesor);
</script>

<Node useDefaults position={{ x: 40, y: 50 }} let:selected>
	<span class="note" id="custom">Custom Nodes</span>
	<NodeWrapper title="Line Thickness" outputStore={output} key="strokeWidth">
		<div class="node-body">
			<Slider min={1.35} max={6} step={0.05} parameterStore={$inputs.width} />
		</div>
	</NodeWrapper>
</Node>

<style>
	.node-body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.note {
		font-family: 'Reenie Beanie', sans-serif;
		position: absolute;
		top: -20px;
		left: 40px;
		width: 400px;
		transform: rotate(3deg);
		color: inerhit;
		font-weight: 200px;
		font-size: 30px;
		pointer-events: none;
	}
</style>
