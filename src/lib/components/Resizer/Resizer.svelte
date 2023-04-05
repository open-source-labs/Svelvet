<!-- ParentComponent.svelte -->
<script lang="ts">
	import type { Graph, Node, ResizeDataContext } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { get } from 'svelte/store';
	export let width = false;
	export let height = false;
	export let both = false;
	export let minHeight: number;
	export let minWidth: number;

	let graph = getContext<Graph>('graph');
	let node = getContext<Node>('node');

	$: resizingWidth = node.resizingWidth;

	$: resizingHeight = node.resizingHeight;

	const { cursor } = graph;

	$: heightStore = node.dimensions.height;
	$: widthStore = node.dimensions.width;
	$: x = node.position.x;
	$: y = node.position.y;
	$: anchors = node.anchors;

	$: cursorY = $cursor.y;
	$: cursorX = $cursor.x;

	$: if ($resizingHeight) {
		const anchorsToUpdate = Object.values($anchors).filter((anchor) => {
			const direction = get(anchor.side);
			const dynamic = get(anchor.dynamic);
			return direction === 'bottom' || (dynamic && direction !== 'top');
		});
		const newHeight = Math.max(minHeight, cursorY - $y);
		// anchorsToUpdate.forEach((anchor) => {
		// 	anchor.position.y.update((n) => n + (n / $heightStore) * (newHeight - $heightStore));
		// });
		$heightStore = newHeight;
	}
	$: if ($resizingWidth) {
		const anchorsToUpdate = Object.values($anchors).filter((anchor) => {
			const direction = get(anchor.side);
			const dynamic = get(anchor.dynamic);
			return direction === 'right' || (dynamic && direction !== 'left');
		});
		const newWidth = Math.max(minWidth, cursorX - $x);
		// anchorsToUpdate.forEach((anchor) => {
		// 	anchor.position.x.update((posX) => posX + (posX / $widthStore) * (newWidth - $widthStore));
		// });
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
		background-color: red;
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
