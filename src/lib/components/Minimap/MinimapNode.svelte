<script lang="ts">
	import type { CSSColorString, Node } from '$lib/types';

	export let node: Node;
	export let hidden = false;
	export let toggleHidden: (node: Node) => void;
	export let top: number;
	export let left: number;
	export let nodeColor: CSSColorString | null = null;

	const { position, dimensions, bgColor, borderRadius } = node;
	const { width, height } = dimensions;
	const { x, y } = position;

	$: zIndex = node.zIndex;
</script>

<button
	on:click={() => toggleHidden(node)}
	class:hidden
	class="minimap-node"
	style:z-index={$zIndex}
	style:border-radius="{$borderRadius}px"
	style:background-color={nodeColor || $bgColor}
	style:width="{$width}px"
	style:height="{$height}px"
	style:top="{$y - top}px"
	style:left="{$x - left}px"
/>

<style>
	.minimap-node {
		position: absolute;
		cursor: pointer;
		border: none;
	}
	.hidden {
		opacity: 25%;
	}
</style>
