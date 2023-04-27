<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { updateTranslation } from '$lib/utils';
	import { get } from 'svelte/store';

	const graph = getContext<Graph>('graph');
	const transforms = graph.transforms;
	const scale = transforms.scale;
	const translationX = transforms.translation.x;
	const translationY = transforms.translation.y;
	const cursor = graph.cursor;

	export let isMovable: boolean;
	let animationFrameId: number;
	let moving = false;

	// Reactive statement to update the transform attribute of the wrapper
	$: transform = `translate(${$translationX}px, ${$translationY}px) scale(${$scale})`;

	$: if (isMovable && !moving) {
		moving = true;
		animationFrameId = requestAnimationFrame(translate);
	} else if (!isMovable || !moving) {
		moving = false;
		cancelAnimationFrame(animationFrameId);
	}

	function translate() {
		[$translationX, $translationY] = updateTranslation(
			get(initialClickPosition),
			$cursor,
			transforms
		);
		animationFrameId = requestAnimationFrame(translate);
	}
</script>

<div
	on:contextmenu|preventDefault|self
	on:click|preventDefault|self
	on:touchstart|preventDefault|self
	style:transform
	class="svelvet-graph-wrapper"
	role="presentation"
>
	<slot />
</div>

<style>
	.svelvet-graph-wrapper {
		box-sizing: border-box;
		position: absolute;
		width: 100%;
		height: 100%;
		pointer-events: none !important;
		touch-action: none;
		/* outline: solid 1px red; */
	}
</style>
