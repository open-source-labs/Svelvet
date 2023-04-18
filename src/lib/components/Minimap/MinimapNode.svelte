<script lang="ts">
	import type { CSSColorString, Node } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { ThemeGroup } from '$lib/types';

	export let node: Node;
	export let hidden = false;
	export let toggleHidden: (node: Node) => void;
	export let top: number;
	export let left: number;
	export let nodeColor: CSSColorString | null = null;
	export let hideable: boolean;

	const themeStore = getContext<Writable<ThemeGroup>>('themeStore');

	const { position, dimensions, bgColor, borderRadius, rotation } = node;
	const { width, height } = dimensions;
	$: nodePosition = $position;
	$: nodeRotation = $rotation;
	$: zIndex = node.zIndex;
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
	style:background-color={nodeColor || $bgColor || $themeStore.node}
	style:width="{$width}px"
	style:height="{$height}px"
	style:transform="rotate({nodeRotation}deg)"
	style:top="{nodePosition.y - top}px"
	style:left="{nodePosition.x - left}px"
	class:hideable
/>

<style>
	.minimap-node {
		position: absolute;
		border: none;
	}
	.hidden {
		opacity: 25%;
	}

	.hideable {
		cursor: pointer;
	}
</style>
