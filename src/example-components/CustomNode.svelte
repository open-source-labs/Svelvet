<script lang="ts">
	import { Node, Anchor, Slider } from '$lib';
	import { writable } from 'svelte/store';

	const parameter = writable(10);
</script>

<Node>
	{#snippet children({ grabHandle, selected })}
		<div class="node" use:grabHandle class:selected>
			<Slider parameterStore={parameter} />
			<div class="input-anchors">
				<Anchor
					on:disconnection={() => console.log('disconnection')}
					on:connection={() => console.log('connection')}
					input
					id="1"
				/>
			</div>
			<div class="output-anchors">
				<Anchor output id="5" />
			</div>
		</div>
	{/snippet}
</Node>

<style>
	.node {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		background-color: rgba(128, 128, 128, 0.673);
		border-radius: 20px;
		position: relative;
		height: fit-content;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		padding: 10px;
		border: solid 2px rgb(99, 99, 99);
	}

	.selected {
		border: solid 2px white;
	}
	.input-anchors {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 10px;
		top: -20px;
	}

	.output-anchors {
		position: absolute;
		right: 20px;
		bottom: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
