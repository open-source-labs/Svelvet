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
		const currentConnections = $edges.get($connectingFrom);
		if (currentConnections) {
			currentConnections.push({ targetNode: $node, anchorId: label });
		} else {
			$edges.set($connectingFrom, [{ targetNode: $node, anchorId: label }]);
		}
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

	let color = 'gray';
	$: side = type === 'output' ? 'right' : 'left';
</script>

<div
	bind:this={anchor}
	style="
		--color: {color};
		{side}: {-6}px;"
	on:mousedown|stopPropagation={handleClick}
	on:mouseup={connect}
	on:mouseover={() => (color = 'goldenrod')}
	on:mouseleave={() => (color = 'gray')}
	class="anchor"
/>

<svelte:window on:mouseup|stopPropagation={removeTemporaryEdge} />

<style>
	.anchor {
		position: absolute;
		width: 12px;
		z-index: 2;
		height: 12px;
		border-radius: 50%;
		background-color: var(--color);
		cursor: pointer;
		border: solid 1px black;
		pointer-events: auto;
	}
</style>
