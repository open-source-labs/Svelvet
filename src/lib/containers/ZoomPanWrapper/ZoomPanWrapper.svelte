<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { updateTranslation } from '$lib/utils';
	import { get } from 'svelte/store';

	const graph = getContext<Graph>('graph');

	export let isMovable: boolean;

	$: transforms = graph.transforms;
	$: scale = transforms.scale;
	$: translationX = transforms.translation.x;
	$: translationY = transforms.translation.y;
	$: cursor = graph.cursor;

	// Reactive statement to update the transform attribute of the wrapper
	$: transform = `translate(${$translationX}px, ${$translationY}px) scale(${$scale})`;

	$: if (isMovable) {
		[$translationX, $translationY] = updateTranslation(
			get(initialClickPosition),
			$cursor,
			transforms
		);
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
