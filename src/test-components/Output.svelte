<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	import { generateInput, generateOutput, type CSSColorString } from '$lib';
	import Visualizer from './Visualizer.svelte';
	import CustomAnchor from './CustomAnchor.svelte';
	import ColorAnchor from './ColorAnchor.svelte';

	type Inputs = {
		strokeWidth: number;
		dashFactor: number;
		numCircles: number;
		spacing: number;
		color: CSSColorString;
		noise: number;
	};

	const initialData = {
		strokeWidth: 2,
		dashFactor: 10,
		numCircles: 5,
		spacing: 10,
		color: 'red' as CSSColorString,
		noise: 1
	};
	const processor = (inputs: Inputs) => inputs;
	const inputs = generateInput(initialData);
	const output = generateOutput(inputs, processor);
</script>

<Node useDefaults id="output" position={{ x: 560, y: 30 }} let:selected locked>
	<div class="node" class:selected>
		<Visualizer {...$output} />
		<div class="input-anchors">
			{#each Object.keys(initialData) as key}
				{#if key === 'color'}
					<Anchor id={key} let:connecting let:linked inputsStore={inputs} {key} input locked>
						<ColorAnchor color={$inputs[key]} {connecting} {linked} />
					</Anchor>
				{:else}
					<Anchor id={key} let:hovering let:connecting let:linked inputsStore={inputs} {key} input>
						<CustomAnchor {hovering} {connecting} {linked} />
					</Anchor>
				{/if}
			{/each}
		</div>
	</div>
</Node>

<style>
	.node {
		box-sizing: border-box;
		width: 400px;
		height: 400px;
		border-radius: 8px;
		position: relative;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		padding: 10px;
		gap: 10px;
	}

	.selected {
		border: solid 2px white;
	}
	.input-anchors {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 10px;
		left: -24px;
	}
</style>
