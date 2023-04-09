<script lang="ts">
	import type { Node } from '$lib/types';

	export let node: Node;
	export let hidden = false;
	export let toggleHidden: (node: Node) => void;
	export let boundsWidth: number;
	export let boundsHeight: number;
	export let top: number;
	export let left: number;

	const { position, dimensions, bgColor } = node;
	const { width, height } = dimensions;
	const { x, y } = position;

	$: DOMwidth = ($width / boundsWidth) * 100;
	$: DOMheight = ($height / boundsHeight) * 100;
</script>

<button
	on:click={() => toggleHidden(node)}
	class:hidden
	class="minimap-node"
	style:background-color={$bgColor}
	style:width="{DOMwidth}%"
	style:height="{DOMheight}%"
	style:top="{(($y - top) / boundsHeight) * 100}%"
	style:left="{(($x - left) / boundsWidth) * 100}%"
/>

<style>
	.minimap-node {
		position: absolute;
		border-radius: 1px;
		cursor: pointer;
		border: none;
	}
	.hidden {
		opacity: 25%;
	}
</style>
