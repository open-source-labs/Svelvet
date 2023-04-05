<script lang="ts">
	import type { Node } from '$lib/types';

	export let node: Node;
	export let bounds;
	export let hidden = false;
	export let toggleHidden: (node: Node) => void;

	const { position, dimensions, visible } = node;
	const { width, height } = dimensions;
	const { x, y } = position;
	const { top, bottom, left, right } = bounds;

	$: boundsWidth = $right - $left;
	$: boundsHeight = $bottom - $top;
	$: DOMwidth = ($width / boundsWidth) * 100;
	$: DOMheight = ($height / boundsHeight) * 100;
</script>

<button
	on:click={() => toggleHidden(node)}
	class:hidden
	class="minimap-node"
	style:width="{DOMwidth}%"
	style="
    aspect-ratio: {$width}/{$height};
        top: {(($y - $top) / boundsHeight) * 100}%;
        left: {(($x - $left) / boundsWidth) * 100}%"
/>

<style>
	.minimap-node {
		position: absolute;
		background-color: white;
		border-radius: 2px;
		border: solid 0.5px black;
		cursor: pointer;
	}
	.hidden {
		opacity: 25%;
	}
</style>
