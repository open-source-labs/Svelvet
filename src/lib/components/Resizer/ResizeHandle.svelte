<script lang="ts">
	import { cursorPosition } from '$lib/stores/CursorStore';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Graph } from '$lib/types';

	interface ResizeDataContext {
		heightStore: Writable<number>;
		widthStore: Writable<number>;
		minWidth: number;
		minHeight: number;
		x: Writable<number>;
		y: Writable<number>;
	}

	export let width = false;
	export let height = false;
	export let both = false;
	export let graph: Graph;
	const { cursor } = graph;

	let resizingWidth = false;
	let resizingHeight = false;

	$: cursorY = $cursor.y;
	$: cursorX = $cursor.x;

	const { heightStore, widthStore, minWidth, minHeight, x, y } =
		getContext<ResizeDataContext>('resizeData');

	$: if (resizingHeight) $heightStore = Math.max(minHeight, cursorY - $y);
	$: if (resizingWidth) $widthStore = Math.max(minWidth, cursorX - $x);

	function resizeHandler(node: HTMLElement) {
		const setResize = (e: MouseEvent) => {
			console.log('CLICK');
			e.stopPropagation();
			resizingWidth = width || both;
			resizingHeight = height || both;
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

<div class:width class:height class:both use:resizeHandler />

<style>
	* {
		position: absolute;
		width: 5px;
		height: 5px;
	}
	.width {
		height: calc(100% - 4px);
		right: -1px;
		top: -1px;
		cursor: ew-resize;
	}
	.height {
		width: calc(100% - 4px);
		left: -1px;
		bottom: -1px;
		cursor: ns-resize;
	}
	.both {
		height: 6px;
		bottom: -1px;
		right: -1px;
		cursor: nwse-resize;
	}
</style>
