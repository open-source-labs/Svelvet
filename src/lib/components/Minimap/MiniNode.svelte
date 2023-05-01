<script lang="ts">
	import type { CSSColorString, Node } from '$lib/types';
	import { onMount } from 'svelte';

	export let node: Node;
	export let hidden = false;
	export let toggleHidden: (node: Node) => void;
	export let top: number;
	export let left: number;
	export let nodeColor: CSSColorString | null = null;
	export let hideable: boolean;

	const { position, dimensions, bgColor, borderRadius, rotation } = node;
	const { width, height } = dimensions;
	$: nodePosition = $position;
	$: nodeRotation = $rotation;
	$: zIndex = node.zIndex;
	let color: CSSColorString | null = null;
	$: colorIsTransparent = color === 'rgba(0, 0, 0, 0)';

	onMount(() => {
		const DOMnode = document.querySelector(`#${node.id}`)?.firstChild;
		if (DOMnode) {
			color = window.getComputedStyle(DOMnode as Element).backgroundColor as CSSColorString;
		}
	});
</script>

<button
	on:click={() => {
		if (!hideable) return;
		toggleHidden(node);
	}}
	class:hidden
	class="minimap-node"
	style:z-index={$zIndex}
	style:border-radius="{$borderRadius}px"
	style:--prop-background-color={nodeColor || $bgColor || (!colorIsTransparent && color) || null}
	style:width="{$width}px"
	style:height="{$height}px"
	style:transform="rotate({nodeRotation}deg)"
	style:top="{nodePosition.y - top}px"
	style:left="{nodePosition.x - left}px"
	class:hideable
/>

<style>
	* {
		box-sizing: border-box;
	}
	.minimap-node {
		position: absolute;
		border: none;
		background-color: var(
			--prop-background-color,
			var(--minimap-node-color, var(--default-minimap-node-color))
		);
	}
	.hidden {
		opacity: 25%;
	}

	.hideable {
		cursor: pointer;
	}
</style>
