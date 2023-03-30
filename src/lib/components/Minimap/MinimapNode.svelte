<script lang="ts">
	import type { WritableNode } from '$lib/types';

	export let node: WritableNode;
	export let bounds;

	const { position, dimensions, visible } = $node;
	const { width, height } = dimensions;
	const { x, y } = position;
	const { top, bottom, left, right } = bounds;

	$: boundsWidth = $right - $left;
	$: boundsHeight = $bottom - $top;
	$: DOMwidth = ($width / boundsWidth) * 100;
	$: DOMheight = ($height / boundsHeight) * 100;
</script>

<button
	on:click={() => {
		visible.set(!$visible);
	}}
	class:hidden={!$visible}
	class="minimap-node"
	style="width: {DOMwidth}%;
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
