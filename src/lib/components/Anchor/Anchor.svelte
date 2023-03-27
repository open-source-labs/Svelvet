<script lang="ts">
	import type { Graph, Node } from '$lib/types';
	import { writable } from 'svelte/store';

	// export let nodeId: string;
	// export let mode: string;
	// export let direction: string = 'TD';
	// export let node: Node;
	// export let graph: Graph;

	// import { createNode } from '$lib/utils/createNode';

	// const { transforms, connectingFrom, nodes } = graph;
	// const { scale } = transforms;

	// const dummyNode = createNode({id: 'dummy'});

	// const { position, dimensions, inputs } = dummyNode;
	// const { width, height } = dimensions;
	// const { x, y } = position;

	// const { position: nodePosition, dimensions: nodeDimensions } = node;
	// const { width: nodeWidth, height: nodeHeight } = nodeDimensions;
	// const { x: nodeX, y: nodeY } = nodePosition;

	// const { outputs } = node;

	// $: axis = direction === 'TD' ? 'Y' : 'X';

	let connecting = false;

	function handleClick(e: MouseEvent) {
		// console.log('click');
		// $connectingFrom = node;
		// $x = $nodeX;
		// $y = $nodeY + $nodeHeight;
		// $inputs = $inputs.add(node);
		// nodes.update((nodes) => {
		// 	return { ...nodes, dummy: writable(dummyNode) };
		// });
		// connecting = true;
		// $width = $nodeWidth;
		// $x = $nodeX;
		// $y = $nodeY + $nodeHeight;
		// outputNodes.update((nodes) => {
		// 	return new Set([...nodes, dummyNode]);
		// });
	}

	function handleMove(e: MouseEvent) {
		// const { movementX, movementY } = e;
		// $x += movementX / $scale;
		// $y += movementY / $scale;
	}

	function removeTemporaryEdge() {
		// nodes.update((nodes) => {
		// 	delete nodes.dummy;
		// 	return { ...nodes };
		// });
	}

	function connect() {
		// const { inputs } = node;
		// if ($connectingFrom) {
		// 	inputs.update((nodes): Set<Node> => {
		// 		return new Set([...nodes, $connectingFrom]);
		// 	});
		// }
	}
</script>

<div on:mousedown|stopPropagation={handleClick} on:mouseup={connect} class="anchor" />

<style>
	.anchor {
		position: absolute;
		left: -6px;
		z-index: 12;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: rgb(143, 140, 140);
		cursor: pointer;
		border: solid 1px black;
		pointer-events: auto;
	}
	.anchor:hover {
		background-color: rgb(200, 200, 200);
	}
</style>
