<script lang="ts">
	import type { Graph, Node } from '$lib/types';
	import { writable } from 'svelte/store';
	import { source } from '$lib/stores';
	import { onMount, getContext } from 'svelte';
	import { get } from 'svelte/store';
	import { graphStore } from '$lib/stores';
	// export let nodeId: string;
	// export let mode: string;
	// export let direction: string = 'TD';
	// export let node: Node;
	// export let graph: Graph;

	export let input;
	export let object;
	export let label: string;
	export let type = 'input';

	const nodeId = getContext('nodeId');
	const { graphId } = getContext('graphId');
	const graph = graphStore.get(graphId);

	const { nodes, edges, connectingFrom } = get(graph);
	const node = nodes.get(nodeId);

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
		console.log(anchor.offsetLeft);
		if (!$source) {
			console.log(node);
			console.log("Source doesn't exist");
			console.log($object);
			$source = object;
			$connectingFrom = $node;
			console.log($source);
			console.log($edges);
		} else {
			console.log('Source exists');
			$object[label] = $source;
			$source = null;
			$edges.set($connectingFrom, { targetNode: $node, anchorId: label });
			$edges = $edges;
			console.log($edges);
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
	let anchor: HTMLDivElement;

	onMount(() => {
		console.log('THIS', nodeId, graphId);

		const { anchors } = get(node);
		const { offsetLeft, offsetTop, offsetHeight, offsetWidth } = anchor;
		anchors[label] = { x: offsetLeft + offsetWidth / 2, y: offsetTop + offsetHeight / 2 };
		console.log(get(node));
	});
</script>

<div
	bind:this={anchor}
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
	svg {
		height: 20px;
		right: 0px;
		position: absolute;
		border: solid 1px red;
	}
</style>
