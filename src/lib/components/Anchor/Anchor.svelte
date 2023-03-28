<script lang="ts">
	import type { Graph, Node } from '$lib/types';
	import { writable } from 'svelte/store';
	import { source } from '$lib/stores';

	// export let nodeId: string;
	// export let mode: string;
	// export let direction: string = 'TD';
	// export let node: Node;
	// export let graph: Graph;

	export let input;
	export let object;
	export let label;
	export let type = 'input';

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
		if (!$source) {
			console.log("Source doesn't exist");
			console.log($object);
			$source = object;
			console.log($source);
		} else {
			console.log('Source exists');
			$object[label] = $source;
			$source = null;
		}
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

<div
	style={type === 'output' ? 'right: -6px;' : 'left: -6px;'}
	on:mousedown|stopPropagation={handleClick}
	on:mouseup={connect}
	class="anchor"
/>

<style>
	.anchor {
		position: absolute;
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
