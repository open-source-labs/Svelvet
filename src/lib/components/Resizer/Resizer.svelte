<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<script lang="ts">
	import { calculateFitContentWidth } from '$lib/utils';
	import { beforeUpdate, getContext, onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { initialClickPosition, resizing } from '$lib/stores';
	import type { Graph, Node } from '$lib/types';
	import type { Writable } from 'svelte/store';

	const graph = getContext<Graph>('graph');
	const node = getContext<Node>('node');
	const resized = getContext<Writable<boolean>>('resized');

	$props = {
		width: false,
		height: false,
		rotation: false,
		minHeight: 0,
		minWidth: 0
	};

	$state = {
		DOMnode: null,
		left: $props.width,
		right: $props.width,
		top: $props.height,
		bottom: $props.height,
		both: $props.width && $props.height,
		startingRotation: 0,
		initialClickAngle: 0,
		initialNodePosition: get(node.position),
		initialWidth: 0,
		initialHeight: 0,
		direction: 1
	};

	const position = node.position;

	const resizingWidth = node.resizingWidth;
	const resizingHeight = node.resizingHeight;
	const rotating = node.rotating;

	const nodeRotation = node.rotation;

	const heightStore = node.dimensions.height;
	const widthStore = node.dimensions.width;

	const cursor = graph.cursor;

	$derived x = $position.x;
	$derived y = $position.y;

	$derived centerPoint = {
		x: x + $widthStore / 2,
		y: y + $heightStore / 2
	};

	$effect(() => {
		if ($resizingHeight) {
			const initialClick = get(initialClickPosition);
			const cursorPosition = $cursor;
			const newHeight = Math.max(
				$props.minHeight,
				$state.initialHeight + (cursorPosition.y - initialClick.y) * $state.direction
			);
			if (newHeight > $props.minHeight) {
				resized.set(true);
				$heightStore = newHeight;
			} else {
				resized.set(false);
			}

			if ($state.direction === -1) {
				$position = {
					x: $state.initialNodePosition.x,
					y: $state.initialNodePosition.y + cursorPosition.y - initialClick.y
				};
			}
			if ($nodeRotation !== 0) {
				node.position.update((pos) => {
					return {
						y: $state.initialNodePosition.y - (newHeight - $state.initialHeight) / 2,
						x: pos.x
					};
				});
			}
		}
	});

	$effect(() => {
		if ($resizingWidth) {
			const initialClick = get(initialClickPosition);
			const cursorPosition = $cursor;
			const newWidth = Math.max(
				$props.minWidth,
				$state.initialWidth + (cursorPosition.x - initialClick.x) * $state.direction
			);
			if (newWidth > $props.minWidth) {
				resized.set(true);
				$widthStore = newWidth;
			} else {
				resized.set(false);
			}

			if ($state.direction === -1) {
				$position = {
					x: $state.initialNodePosition.x + cursorPosition.x - initialClick.x,
					y: $state.initialNodePosition.y
				};
			}
			if ($nodeRotation !== 0) {
				node.position.update((pos) => {
					return {
						x: $state.initialNodePosition.x - (newWidth - $state.initialWidth) / 2,
						y: pos.y
					};
				});
			}
		}
	});

	$effect(() => {
		if ($rotating) {
			$cursor;
			$nodeRotation = calculateRotation();
		}
	});

	onMount(() => {
		try {
			$state.DOMnode = document.querySelector(`#${node.id}`) as HTMLElement;
			if ($state.DOMnode) [$props.minWidth, $props.minHeight] = calculateFitContentWidth($state.DOMnode);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
		}
	});

	function resizeHandler(
		node: HTMLElement,
		dimensions: { left?: boolean; right?: boolean; both?: boolean; top?: boolean; bottom?: boolean }
	) {
		const setResize = (e: MouseEvent) => {
			e.stopPropagation();
			e.preventDefault();
			if (dimensions.left || dimensions.top) {
				$state.direction = -1;
			} else {
				$state.direction = 1;
			}

			resizing.set(true);
			$initialClickPosition = get(cursor);
			$state.initialWidth = $widthStore;
			$state.initialHeight = $heightStore;
			$state.initialNodePosition = $position;

			dimensions.both ? ($resizingWidth = true) : ($resizingWidth = false);
			$resizingWidth = dimensions.left || dimensions.right || dimensions.both || false;
			$resizingHeight = dimensions.top || dimensions.bottom || dimensions.both || false;

			if ($state.DOMnode) [$props.minWidth, $props.minHeight] = calculateFitContentWidth($state.DOMnode);
			window.addEventListener('mouseup', removeResize);
		};

		const removeResize = () => {
			$resizingWidth = false;
			$resizingHeight = false;
			resizing.set(false);
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
			$state.startingRotation = $nodeRotation;

			//Capture current click position
			$initialClickPosition = get(cursor);

			// Calculate the initial angle
			const initialDeltaX = $initialClickPosition.x - $centerPoint.x;
			const initialDeltaY = $initialClickPosition.y - $centerPoint.y;
			$state.initialClickAngle = Math.atan2(initialDeltaY, initialDeltaX);

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
		const currentDeltaX = cursorPosition.x - $centerPoint.x;
		const currentDeltaY = cursorPosition.y - $centerPoint.y;

		const currentAngle = Math.atan2(currentDeltaY, currentDeltaX);

		const angleDifference = $state.initialClickAngle - currentAngle;

		const newAngle = $state.startingRotation - radiansToDegrees(angleDifference);
		return newAngle;
	}

	function radiansToDegrees(radians: number) {
		return radians * (180 / Math.PI);
	}

	beforeUpdate(() => {
		if ($state.DOMnode) [$props.minWidth, $props.minHeight] = calculateFitContentWidth($state.DOMnode);
		if ($widthStore < $props.minWidth) resized.set(false);
		if ($heightStore < $props.minHeight) resized.set(false);
	});
</script>

{#if $props.width}
	<div {...resizeHandler({ left: $state.left })} class:width class="left" />
	<div {...resizeHandler({ right: $state.right })} class:width class="right" />
{/if}

{#if $props.height}
	<div {...resizeHandler({ top: $state.top })} class:height class="top" />
	<div {...resizeHandler({ bottom: $state.bottom })} class:height class="bottom" />
{/if}
{#if $state.both}
	<div {...resizeHandler({ both: $state.both })} class:both />
{/if}
{#if $props.rotation}
	<div {...rotateHandler} class:rotation />
{/if}

<style>
	* {
		position: absolute;
		width: 9px;
		height: 9px;
		z-index: 0;
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
	}
	.rotation {
		top: -3px;
		left: -3px;
		cursor: crosshair;
	}
</style>
