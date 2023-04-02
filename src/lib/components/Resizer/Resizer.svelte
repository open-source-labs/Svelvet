<!-- ParentComponent.svelte -->
<script lang="ts">
	import type { Graph, Node, ResizeDataContext } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let width = false;
	export let height = false;
	export let both = false;
	export let minHeight: number;
	export let minWidth: number;

	let graph = getContext<Graph>('graph');
	let node = getContext<Node>('node');

	let resizingWidth = false;
	let resizingHeight = false;

	const { cursor } = graph;

	$: heightStore = node.dimensions.height;
	$: widthStore = node.dimensions.width;
	$: x = node.position.x;
	$: y = node.position.y;

	$: cursorY = $cursor.y;
	$: cursorX = $cursor.x;

	$: if (resizingHeight) $heightStore = Math.max(minHeight, cursorY - $y);
	$: if (resizingWidth) $widthStore = Math.max(minWidth, cursorX - $x);

	function resizeHandler(
		node: HTMLElement,
		dimensions: { width?: boolean; height?: boolean; both?: boolean }
	) {
		const setResize = (e: MouseEvent) => {
			e.stopPropagation();
			e.preventDefault();
			dimensions.both ? (resizingWidth = true) : (resizingWidth = false);
			resizingWidth = dimensions.width || dimensions.both || false;
			resizingHeight = dimensions.height || dimensions.both || false;
			window.addEventListener('mouseup', removeResize);
		};

		const removeResize = () => {
			resizingWidth = false;
			resizingHeight = false;
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
		width: 6px;
		height: 6px;
	}
	.width {
		height: calc(100% - 3px);
		right: -1px;
		top: -1px;
		cursor: col-resize;
	}
	.height {
		width: calc(100% - 3px);
		left: -1px;
		bottom: -1px;
		cursor: row-resize;
	}
	.both {
		bottom: -1px;
		right: -1px;
		cursor: nwse-resize;
	}
</style>
