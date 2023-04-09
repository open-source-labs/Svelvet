<script lang="ts">
	import SpecialNode from '$lib/components/Node/Node.svelte';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	import InternalNode from '$lib/components/Node/InternalNode.svelte';
	import Slider from '$lib/components/Slider/Slider.svelte';
	import CustomAnchor from './CustomAnchor.svelte';
	import { get, writable } from 'svelte/store';
	import { generateOutput, generateInput } from '$lib/utils';
	import type { Writable } from 'svelte/store';
	import CustomEdge from './CustomEdge.svelte';
	import Resizer from '$lib/components/Resizer/Resizer.svelte';

	export let id: number | string = Math.random();

	const connections: [string, string][] = [['sam', 'son']];
</script>

<SpecialNode let:grabHandle let:selected {id}>
	<div class="node" use:grabHandle class:selected>
		<div class="input-anchors">
			<Anchor input id="son" />
			<Anchor input id="grandpa" />
		</div>
		<div class="output-anchors">
			<Anchor output id="dad" {connections} edge={CustomEdge} />
			<Anchor output id="mom" {connections} />
		</div>
	</div>
</SpecialNode>

<style>
	p {
		color: white;
	}
	.node {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		background-color: rgba(128, 128, 128, 0.673);
		border-radius: 20px;
		position: relative;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		padding: 10px;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
		border: solid 2px rgb(99, 99, 99);
	}
	.handle {
		width: fit-content;
		position: absolute;
		left: -40px;
		height: 40px;
		border-radius: 10px;
		top: -80px;
		padding: 10px;
		background-color: rgb(247, 241, 241);
		color: rgb(9, 9, 9);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.output {
		color: black;
	}
	.selected {
		border: solid 2px white;
	}
	.input-anchors {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.sliders {
		display: flex;
		flex-direction: column;
		gap: 10px;
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
