<script lang="ts">
	import SpecialNode from '$lib/components/Node/Node.svelte';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	import CustomEdge from './CustomEdge.svelte';

	export let id: number | string = Math.random();

	const connections: [string, string][] = [['1', '1']];
</script>

<SpecialNode let:grabHandle let:selected {id}>
	<div class="node" use:grabHandle class:selected>
		<div class="input-anchors">
			<Anchor input id="1" />
			<Anchor input id="2" />
		</div>
		<div class="output-anchors">
			<Anchor output id="3" {connections} edge={CustomEdge} />
			<Anchor output id="4" {connections} />
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
