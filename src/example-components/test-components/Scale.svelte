<script lang="ts">
	import Visualizer from './Visualizer.svelte';
	import CustomAnchor from './CustomAnchor.svelte';
	import ColorAnchor from './ColorAnchor.svelte';
	import { Node, Anchor } from '$lib';
	import { generateInput, generateOutput, type CSSColorString } from '$lib';

	type Inputs = {
		strokeWidth: number;
		dashCount: number;
		scale: number;
		animation: number;
		color: CSSColorString;
		noise: number;
	};

	const initialData = {
		strokeWidth: 2,
		dashCount: 10,
		scale: 5,
		animation: 0,
		color: 'red' as CSSColorString,
		noise: 1
	};
	const processor = (inputs: Inputs) => inputs;
	const inputs = generateInput(initialData);
	const output = generateOutput(inputs, processor);
</script>

<Node useDefaults id="output" position={{ x: 560, y: 30 }}  locked>
	{#snippet children({ selected })}
		<div class="node" class:selected>
			<Visualizer {...$output} />
			<div class="input-anchors">
				{#each Object.keys(initialData) as key}
					{#if key === 'color'}
						<Anchor id={key}   inputsStore={inputs} {key} input locked>
							{#snippet children({ connecting, linked })}
												<ColorAnchor color={$inputs[key]} {connecting} {linked} />
																		{/snippet}
										</Anchor>
					{:else if key === 'animation'}
						<Anchor
							id={key}
							on:disconnection={() => {
								if ($inputs && typeof $inputs.animation.set === 'function') {
									$inputs.animation.set(0);
								}
							}}
							
							
							
							inputsStore={inputs}
							{key}
							input
						>
							{#snippet children({ hovering, connecting, linked })}
														<CustomAnchor {hovering} {connecting} {linked} />
																				{/snippet}
												</Anchor>
					{:else}
						<Anchor id={key}    inputsStore={inputs} {key} input>
							{#snippet children({ hovering, connecting, linked })}
														<CustomAnchor {hovering} {connecting} {linked} />
																				{/snippet}
												</Anchor>
					{/if}
				{/each}
			</div>
		</div>
	{/snippet}
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
