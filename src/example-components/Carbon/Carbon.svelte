<script lang="ts">
	import { Node, Anchor, Resizer } from '$lib';
	import Table from './Table.svelte';
</script>

<Node useDefaults id="node-a" position={{ x: 10, y: 100 }} let:selected>
	<div class="node">
		<div class="header">
			<h1>Table 1</h1>
		</div>
		<Table />
		<div class="input-anchors">
			<Anchor />
		</div>
		<div class="output-anchors">
			<Anchor />
		</div>
	</div>
	<Resizer width height />
</Node>

<style>
	.node {
		box-sizing: border-box;
		width: fit-content;
		height: fit-content;
		min-height: 300px;
		border-radius: 8px;
		position: relative;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		padding: 10px;
		gap: 10px;
		outline: solid 1px yellow;
	}

	.input-anchors {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 10px;
		left: -16px;
	}
	.output-anchors {
		position: absolute;
		right: -16px;
		top: 8px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	h1 {
		font-size: 0.9rem;
		font-weight: 200;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		padding-bottom: 8px;
		border-color: inherit;
		font-weight: 800;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		width: 100%;
		border-bottom: solid 1px;
		border-color: lightgray;
	}
</style>
