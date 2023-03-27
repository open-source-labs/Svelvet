<script lang="ts">
	let height = 0;
	let width = 0;
	export let anchor = { x: 0, y: 0 };
	import { onMount } from 'svelte';

	export let graph;

	const { groups, nodes: nodeStore } = graph;
	const { selected: selectedNodes } = groups;

	interface Node {
		id: string;
		top: number;
		left: number;
		width: number;
		height: number;
	}
	let nodes: Array<Node>;
	let box: HTMLDivElement;
	let selectionBoxBounds: DOMRect;

	onMount(() => {
		updateNodes();
	});

	function updateNodes() {
		const DOMnodes = Array.from(document.querySelectorAll('.graph-node'));
		nodes = DOMnodes.map((node) => {
			const { top, left, width, height } = node.getBoundingClientRect();

			return { id: node.id, top, left, width, height };
		});
	}

	function resizeSelectionBox(e: MouseEvent) {
		const { movementX, movementY } = e;
		height += movementY;
		width += movementX;

		if (box) {
			selectionBoxBounds = box.getBoundingClientRect();
			checkSelections();
		}
	}
	function checkSelections() {
		console.log(selectionBoxBounds);
		if (!nodes) return;

		const nodeIdsUnderSelection: Array<string> = [];
		console.log(nodes);
		nodes.forEach((node) => {
			if (
				node.top < selectionBoxBounds.top + selectionBoxBounds.height &&
				node.top + node.height > selectionBoxBounds.top &&
				node.left < selectionBoxBounds.left + selectionBoxBounds.width &&
				node.left + node.width > selectionBoxBounds.left
			) {
				nodeIdsUnderSelection.push(node.id);
			}
		});
		console.log({ nodeIdsUnderSelection });
		$selectedNodes = new Set(
			nodeIdsUnderSelection.map((id) => {
				let foundNode;
				const storedNode = nodeStore.get(id);
				storedNode.subscribe((node) => {
					foundNode = node;
				});

				return foundNode;
			})
		);
		$selectedNodes = $selectedNodes;
	}
</script>

<div
	bind:this={box}
	class="selection-box"
	style={`height: ${Math.abs(height)}px;
    width: ${Math.abs(width)}px;
    ${height > 0 ? `top: ${anchor.y}px` : `top: ${anchor.y + height}px`}; 
    ${width > 0 ? `left: ${anchor.x}px` : `left: ${anchor.x + width}px`}; `}
/>
<svelte:window on:mousemove={resizeSelectionBox} />

<style>
	.selection-box {
		position: absolute;
		background-color: rgba(84, 220, 239, 0.135);
		border: 1px dashed rgb(84, 148, 252);
		border-radius: 5px;
		pointer-events: none;
		z-index: 10;
		cursor: crosshair;
	}
</style>
