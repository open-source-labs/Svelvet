<script lang="ts">
	import type { CSSColorString, Node } from '$lib/types';
	import { onMount } from 'svelte';

	interface Props {
		node: Node;
		hidden?: boolean;
		toggleHidden: (node: Node) => void;
		top: number;
		left: number;
		nodeColor?: CSSColorString | null;
		hideable: boolean;
	}

	let {
		node,
		hidden = false,
		toggleHidden,
		top,
		left,
		nodeColor = null,
		hideable
	}: Props = $props();

	const { position, dimensions, bgColor, borderRadius, rotation } = node;
	const { width, height } = dimensions;
	let nodePosition = $derived($position);
	let nodeRotation = $derived($rotation);
	let zIndex = $derived(node.zIndex);
	let color: CSSColorString | null = $state(null);
	let colorIsTransparent = $derived(color === 'rgba(0, 0, 0, 0)');

	onMount(() => {
		try {
			const DOMnode = document.querySelector(`#${node.id}`)?.firstChild;
			if (DOMnode) {
				color = window.getComputedStyle(DOMnode as Element).backgroundColor as CSSColorString;
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
		}
	});
</script>

<button
	onclick={() => {
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
></button>

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
