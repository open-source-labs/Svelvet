<script lang="ts">
	import { Node, Anchor } from '$lib';
	import CustomAnchor from './CustomAnchor.svelte';
	import { generateInput, generateOutput, type CSSColorString } from '$lib';

	type Inputs = {
		bass: number;
		treble: number;
		volume: number;
	};

	const initialData = {
		bass: 2,
		treble: 2,
		volume: 1
	};
	const processor = (inputs: Inputs) => inputs;
	const inputs = generateInput(initialData);
	const output = generateOutput(inputs, processor);
</script>

<Node useDefaults id="output" position={{ x: 560, y: 650 }}  locked>
	{#snippet children({ selected })}
		<div class="node" class:selected>
			<p class="output-value">Bass: {$output.bass}</p>
			<p class="output-value">Treble: {$output.treble}</p>
			<p class="output-value">Volume: {$output.volume}</p>
			<div class="input-anchors">
				{#each Object.keys(initialData) as key}
					<Anchor id={key}    inputsStore={inputs} {key} input>
						{#snippet children({ hovering, connecting, linked })}
										<CustomAnchor {hovering} {connecting} {linked} />
															{/snippet}
								</Anchor>
				{/each}
			</div>
		</div>
	{/snippet}
</Node>

<style>
	.node {
		box-sizing: border-box;

		border-radius: 8px;
		position: relative;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		padding: 10px;
		/* gap: 10px; */
	}

	.selected {
		border: solid 2px white;
	}
	.input-anchors {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		left: -24px;
		padding-block: 0.7rem;
	}

	.output-value {
		font-size: 1rem;
		line-height: 0;
	}
</style>
