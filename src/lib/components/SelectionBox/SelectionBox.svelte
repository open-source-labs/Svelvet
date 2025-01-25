<script lang="ts">
	import { run } from 'svelte/legacy';

	import { onMount } from 'svelte';
	import { cursorPositionRaw } from '$lib/stores/CursorStore';
	import type { CSSColorString, Graph, Node, NodeDOMBounds, NodeKey } from '$lib/types';

	interface Props {
		graph: Graph;
		anchor: { x: number; y: number; top: number; left: number };
		adding?: boolean;
		creating?: boolean;
		color?: CSSColorString | null;
	}

	let {
		graph,
		anchor,
		adding = false,
		creating = false,
		color = null
	}: Props = $props();

	const { groups } = graph;

	let nodes: Array<NodeDOMBounds>;
	let box: HTMLDivElement = $state();




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
				if (!selectedNode) return accumulator;
				accumulator.push(selectedNode);
			}
			return accumulator;
		}, [] as Array<Node>);
		if (adding) {
			nodesUnderSelection.forEach((node) => {
				$selectedNodes.add(node);
			});
		} else {
			$selectedNodes = new Set(nodesUnderSelection);
		}
		$selectedNodes = $selectedNodes;
	}
	let selectedNodes = $derived($groups.selected.nodes);
	let height = $derived($cursorPositionRaw.y - anchor.y - anchor.top);
	let width = $derived($cursorPositionRaw.x - anchor.x - anchor.left);
	let top = $derived(Math.min(anchor.y, anchor.y + height));
	let left = $derived(Math.min(anchor.x, anchor.x + width));
	let CSStop = $derived(`${top}px`);
	let CSSleft = $derived(`${left}px`);
	let CSSheight = $derived(`${Math.abs(height)}px`);
	let CSSwidth = $derived(`${Math.abs(width)}px`);
	run(() => {
		if (width || height) {
			selectNodes();
		}
	});
</script>

<div
	class="selection-border"
	style:--prop-selection-box-color={color}
	style:height={CSSheight}
	style:width={CSSwidth}
	style:top={CSStop}
	style:left={CSSleft}
	class:creating
>
	<div class:creating bind:this={box} class="selection-box"></div>
</div>

<style>
	.selection-box,
	.selection-border {
		border-radius: 5px;
	}
	.selection-box {
		width: 100%;
		height: 100%;
		opacity: 20%;
		background-color: var(
			--prop-selection-box-color,
			var(--selection-box-color, var(--default-selection-box-color))
		);
	}

	.selection-border {
		position: absolute;
		border-radius: 5px;
		pointer-events: none;
		z-index: 100;
		cursor: crosshair;
		border: 1px dashed;
		border-color: var(
			--prop-selection-box-color,
			var(--selection-box-color, var(--default-selection-box-color))
		);
	}

	.selection-box.creating {
		background-color: rgba(220, 189, 13, 0.438);
	}

	.selection-border.creating {
		border: 1px solid goldenrod;
	}
</style>
