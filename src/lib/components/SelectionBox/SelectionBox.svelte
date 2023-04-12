<script lang="ts">
	import { onMount } from 'svelte';
	import { cursorPositionRaw } from '$lib/stores/CursorStore';
	import type { Graph, Node, NodeDOMBounds, NodeKey } from '$lib/types';
	export let graph: Graph;
	export let anchor: { x: number; y: number; top: number; left: number };
	export let adding = false;

	export let creating = false;

	const { groups, nodes: nodeStore, cursor, bounds } = graph;
	const { x, y } = $cursorPositionRaw;

	let nodes: Array<NodeDOMBounds>;
	let box: HTMLDivElement;

	$: selectedNodes = $groups.selected.nodes;
	$: height = $cursorPositionRaw.y - anchor.y - anchor.top;
	$: width = $cursorPositionRaw.x - anchor.x - anchor.left;
	$: top = Math.min(anchor.y, anchor.y + height);
	$: left = Math.min(anchor.x, anchor.x + width);

	$: CSStop = `${top}px`;
	$: CSSleft = `${left}px`;
	$: CSSheight = `${Math.abs(height)}px`;
	$: CSSwidth = `${Math.abs(width)}px`;

	$: if (width || height) {
		selectNodes();
	}

	onMount(updateNodes);

	function updateNodes() {
		const DOMnodes = Array.from(document.querySelectorAll('.svelvet-node'));

		nodes = DOMnodes.map((node) => {
			const { top, left, width, height } = node.getBoundingClientRect();

			return { id: node.id, top, left, width, height };
		});
	}

	function selectNodes() {
		if (!nodes) return;

		const nodesUnderSelection = nodes.reduce((accumulator, node) => {
			if (
				left + anchor.left <= node.left &&
				top + anchor.top <= node.top &&
				left + anchor.left + Math.abs(width) >= node.left + node.width &&
				top + anchor.top + Math.abs(height) >= node.top + node.height
			) {
				const id = node.id as NodeKey;
				const selectedNode = graph.nodes.get(id);
				accumulator.push(selectedNode);
			}
			return accumulator;
		}, [] as Array<Node>);
		console.log(nodes);
		if (adding) {
			nodesUnderSelection.forEach((node) => {
				$selectedNodes.add(node);
			});
		} else {
			$selectedNodes = new Set(nodesUnderSelection);
		}
		$selectedNodes = $selectedNodes;
	}
</script>

<div
	class:creating
	bind:this={box}
	class="selection-box"
	style:height={CSSheight}
	style:width={CSSwidth}
	style:top={CSStop}
	style:left={CSSleft}
/>

<style>
	.selection-box {
		position: absolute;
		background-color: rgba(84, 220, 239, 0.135);
		border: 1px dashed rgb(84, 148, 252);
		border-radius: 5px;
		pointer-events: none;
		z-index: 100;
		cursor: crosshair;
	}

	.creating {
		background-color: rgba(220, 189, 13, 0.438);
		border: 1px solid goldenrod;
	}
</style>
