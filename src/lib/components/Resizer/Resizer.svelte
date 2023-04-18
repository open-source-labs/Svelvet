<!-- ParentComponent.svelte -->
<script lang="ts">
	import type { Graph, Node } from '$lib/types';
	import { getContext } from 'svelte';
	import { initialClickPosition } from '$lib/stores';

	export let width = false;
	export let height = false;
	export let rotation = false;
	export let minHeight: number = 100;
	export let minWidth: number = 200;

	let graph = getContext<Graph>('graph');
	let node = getContext<Node>('node');

	const { cursor } = graph;
	const position = node.position;
	let both = width && height;
	let startingRotation = 0;
	let initialClickAngle = 0;

	$: resizingWidth = node.resizingWidth;
	$: resizingHeight = node.resizingHeight;
	$: rotating = node.rotating;

	$: nodeRotation = node.rotation;

	$: heightStore = node.dimensions.height;
	$: widthStore = node.dimensions.width;

	$: x = $position.x;
	$: y = $position.y;

	$: centerPoint = {
		x: x + $widthStore / 2,
		y: y + $heightStore / 2
	};

	$: cursorY = $cursor.y;
	$: cursorX = $cursor.x;

	$: if ($resizingHeight) {
		const newHeight = Math.max(minHeight, cursorY - $position.y);
		$heightStore = newHeight;
	}
	$: if ($resizingWidth) {
		const newWidth = Math.max(minWidth, cursorX - $position.x);
		$widthStore = newWidth;
	}

	$: if ($rotating) {
		$cursor;
		$nodeRotation = calculateRotation();
	}

	function resizeHandler(
		node: HTMLElement,
		dimensions: { width?: boolean; height?: boolean; both?: boolean }
	) {
		const setResize = (e: MouseEvent) => {
			e.stopPropagation();
			e.preventDefault();

			dimensions.both ? ($resizingWidth = true) : ($resizingWidth = false);
			$resizingWidth = dimensions.width || dimensions.both || false;
			$resizingHeight = dimensions.height || dimensions.both || false;
			window.addEventListener('mouseup', removeResize);
		};

		const removeResize = () => {
			$resizingWidth = false;
			$resizingHeight = false;
			window.removeEventListener('mouseup', removeResize);
		};

		node.addEventListener('mousedown', setResize);

		return {
			destroy() {
				node.removeEventListener('mousedown', setResize);
			}
		};
	}

	// set rotaiton based on xy mouse movement
	function rotateHandler(node: HTMLElement) {
		const setRotation = (e: MouseEvent) => {
			e.stopPropagation();
			e.preventDefault();

			//Capture current node rotation
			startingRotation = $nodeRotation;

			//Capture current click position
			$initialClickPosition = { x: cursorX, y: cursorY };

			// Calculate the initial angle
			const initialDeltaX = $initialClickPosition.x - centerPoint.x;
			const initialDeltaY = $initialClickPosition.y - centerPoint.y;
			initialClickAngle = Math.atan2(initialDeltaY, initialDeltaX);

			$rotating = true;
			window.addEventListener('mouseup', removeRotation);
		};

		const removeRotation = () => {
			$rotating = false;
			window.removeEventListener('mouseup', removeRotation);
		};

		node.addEventListener('mousedown', setRotation);

		return {
			destroy() {
				node.removeEventListener('mousedown', setRotation);
			}
		};
	}

	function calculateRotation() {
		const currentDeltaX = cursorX - centerPoint.x;
		const currentDeltaY = cursorY - centerPoint.y;

		const currentAngle = Math.atan2(currentDeltaY, currentDeltaX);

		const angleDifference = initialClickAngle - currentAngle;

		const newAngle = startingRotation - radiansToDegrees(angleDifference);
		return newAngle;
	}

	function radiansToDegrees(radians: number) {
		return radians * (180 / Math.PI);
	}
</script>

<div use:resizeHandler={{ width }} class:width />
<div use:resizeHandler={{ height }} class:height />
<div use:resizeHandler={{ both }} class:both />
<div use:rotateHandler class:rotation />

<style>
	* {
		position: absolute;
		width: 9px;
		height: 9px;
		z-index: 0;
		/* background-color: red; */
		pointer-events: auto;
	}
	.width {
		height: calc(100% - 3px);
		right: -3px;
		top: -3px;
		cursor: col-resize;
	}
	.height {
		width: calc(100% - 3px);
		left: -3px;
		bottom: -3px;
		cursor: row-resize;
	}
	.both {
		bottom: -3px;
		right: -3px;
		cursor: nwse-resize;
	}
	.rotation {
		top: -3px;
		left: -3px;
		cursor: crosshair;
	}
</style>
