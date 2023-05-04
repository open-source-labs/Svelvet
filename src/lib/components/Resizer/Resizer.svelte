<script context="module" lang="ts">
	import { getContext } from 'svelte';
	import { get } from 'svelte/store';
	import { initialClickPosition } from '$lib/stores';
	import type { Graph, Node } from '$lib/types';
</script>

<script lang="ts">
	let graph = getContext<Graph>('graph');
	let node = getContext<Node>('node');

	export let width = false;
	export let height = false;
	export let rotation = false;
	export let minHeight = 0;
	export let minWidth = 0;

	let left = width;
	let right = width;
	let top = height;
	let bottom = height;

	let both = width && height;
	let startingRotation = 0;
	let initialClickAngle = 0;
	let initialNodePosition = get(node.position);

	const position = node.position;

	const resizingWidth = node.resizingWidth;
	const resizingHeight = node.resizingHeight;
	const rotating = node.rotating;

	const nodeRotation = node.rotation;

	const heightStore = node.dimensions.height;
	const widthStore = node.dimensions.width;

	const cursor = graph.cursor;

	let initialWidth: number;
	let initialHeight: number;

	let direction = 1;

	$: x = $position.x;
	$: y = $position.y;

	$: centerPoint = {
		x: x + $widthStore / 2,
		y: y + $heightStore / 2
	};

	$: if ($resizingHeight) {
		const initialClick = get(initialClickPosition);
		const newHeight = Math.max(minHeight, initialHeight + ($cursor.y - initialClick.y) * direction);
		$heightStore = newHeight;
		if (direction === -1) {
			$position = {
				x: initialNodePosition.x,
				y: initialNodePosition.y + $cursor.y - initialClick.y
			};
		}
	}

	$: if ($resizingWidth) {
		const initialClick = get(initialClickPosition);
		const newWidth = Math.max(minWidth, initialWidth + ($cursor.x - initialClick.x) * direction);
		$widthStore = newWidth;
		if (direction === -1) {
			$position = {
				x: initialNodePosition.x + $cursor.x - initialClick.x,
				y: initialNodePosition.y
			};
		}
	}

	$: if ($rotating) {
		$cursor;
		$nodeRotation = calculateRotation();
	}

	function resizeHandler(
		node: HTMLElement,
		dimensions: { left?: boolean; right?: boolean; both?: boolean; top?: boolean; bottom?: boolean }
	) {
		const setResize = (e: MouseEvent) => {
			e.stopPropagation();
			e.preventDefault();
			if (dimensions.left || dimensions.top) {
				direction = -1;
			} else {
				direction = 1;
			}
			$initialClickPosition = { x: $cursor.x, y: $cursor.y };
			initialWidth = $widthStore;
			initialHeight = $heightStore;
			initialNodePosition = $position;

			dimensions.both ? ($resizingWidth = true) : ($resizingWidth = false);
			$resizingWidth = dimensions.left || dimensions.right || dimensions.both || false;
			$resizingHeight = dimensions.top || dimensions.bottom || dimensions.both || false;
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
			$initialClickPosition = { x: $cursor.x, y: $cursor.y };

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
		const cursorPosition = get(cursor);
		const currentDeltaX = cursorPosition.x - centerPoint.x;
		const currentDeltaY = cursorPosition.y - centerPoint.y;

		const currentAngle = Math.atan2(currentDeltaY, currentDeltaX);

		const angleDifference = initialClickAngle - currentAngle;

		const newAngle = startingRotation - radiansToDegrees(angleDifference);
		return newAngle;
	}

	function radiansToDegrees(radians: number) {
		return radians * (180 / Math.PI);
	}
</script>

{#if width}
	<div use:resizeHandler={{ left }} class:width class="left" />
	<div use:resizeHandler={{ right }} class:width class="right" />
{/if}

{#if height}
	<div use:resizeHandler={{ top }} class:height class="top" />
	<div use:resizeHandler={{ bottom }} class:height class="bottom" />
{/if}
{#if both}
	<div use:resizeHandler={{ both }} class:both />
{/if}
{#if rotation}
	<div use:rotateHandler class:rotation />
{/if}

<style>
	* {
		position: absolute;
		width: 9px;
		height: 9px;
		z-index: 0;
		/* background-color: black; */
		pointer-events: auto;
	}
	.width {
		height: calc(100% - 3px);
		top: -3px;
		cursor: col-resize;
	}

	.left {
		left: -3px;
	}
	.right {
		right: -3px;
	}
	.height {
		width: calc(100% - 3px);
		left: -3px;
		cursor: row-resize;
	}

	.top {
		top: -3px;
	}
	.bottom {
		bottom: -3px;
	}
	.both {
		bottom: -3px;
		right: -3px;
		cursor: nwse-resize;
		/* background-color: green; */
	}
	.rotation {
		top: -3px;
		left: -3px;
		cursor: crosshair;
		/* background-color: blue; */
	}
</style>
