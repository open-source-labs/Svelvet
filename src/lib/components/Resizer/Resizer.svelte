<!-- ParentComponent.svelte -->
<script lang="ts">
	import type { Graph, Node } from '$lib/types';
	import { getContext } from 'svelte';
	export let width = false;
	export let height = false;
	export let minHeight: number = 200;
	export let minWidth: number = 100;

	let graph = getContext<Graph>('graph');
	let node = getContext<Node>('node');

	const { cursor } = graph;

	let both = width && height;

	$: resizingWidth = node.resizingWidth;
	$: resizingHeight = node.resizingHeight;

	$: heightStore = node.dimensions.height;
	$: widthStore = node.dimensions.width;
	$: x = node.position.x;
	$: y = node.position.y;

	$: cursorY = $cursor.y;
	$: cursorX = $cursor.x;

	$: if ($resizingHeight) {
		const newHeight = Math.max(minHeight, cursorY - $y);
		$heightStore = newHeight;
	}
	$: if ($resizingWidth) {
		const newWidth = Math.max(minWidth, cursorX - $x);
		$widthStore = newWidth;
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
</script>

<div use:resizeHandler={{ width }} class:width />
<div use:resizeHandler={{ height }} class:height />
<div use:resizeHandler={{ both }} class:both />

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
</style>
