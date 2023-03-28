<script lang="ts">
	import type { Graph, Node } from '$lib/types';
	import { writable } from 'svelte/store';
	import { source } from '$lib/stores';
	import { onMount, getContext } from 'svelte';
	import { get } from 'svelte/store';
	import { graphStore } from '$lib/stores';
	import Edge from '../Edge/Edge.svelte';
	import { cursorPosition } from '$lib/stores/CursorStore';

	export let input;
	export let object;
	export let label: string;
	export let type = 'input';

	let potentialEdge = false;

	const nodeId = getContext('nodeId');
	const { graphId } = getContext('graphId');
	const graph = graphStore.get(graphId);

	const { nodes, edges, connectingFrom } = get(graph);
	const node = nodes.get(nodeId);

	function handleClick(e: MouseEvent) {
		if (!$source) {
			$source = object;
			$connectingFrom = $node;
			potentialEdge = true;
		} else {
		}
	}

	function removeTemporaryEdge() {
		$connectingFrom = null;
		$source = null;
	}

	function connect() {
		$object[label] = $source;
		$source = null;
		$edges.set($connectingFrom, { targetNode: $node, anchorId: label });
		$edges = $edges;
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

<svelte:window on:mouseup|stopPropagation={removeTemporaryEdge} />

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
