<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	import type { Node as NodeType } from '$lib/types';
	export let id: number | string = Math.random();

	const connections: [string, string][] = [['1', '1']];

	function handleClick(node: NodeType) {
		node.dimensions.width.set(800);
		node.locked.set(true);
	}
</script>

<Node let:grabHandle let:selected let:node {id}>
	<div class="node" use:grabHandle class:selected>
		<button on:click={() => handleClick(node)}>Click Me</button>
		<div class="input-anchors">
			<Anchor input id="1" />
			<Anchor input id="2" />
		</div>
		<div class="output-anchors">
			<Anchor output id="3" {connections} />
			<Anchor output id="4" {connections} />
			<Anchor output id="5" />
		</div>
	</div>
</Node>

<style>
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
