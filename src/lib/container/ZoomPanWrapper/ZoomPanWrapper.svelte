<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';

	const graph = getContext<Graph>('graph');

	$: scale = graph.transforms.scale;
	$: x = graph.transforms.translation.x;
	$: y = graph.transforms.translation.y;

	const className = 'svelvet-graph-wrapper';

	// Reactive statement to update the transform attribute of the wrapper
	$: transform = `translate(${$x}px, ${$y}px) scale(${$scale})`;
</script>

<div
	on:contextmenu|preventDefault
	on:click|preventDefault
	style:transform
	class={className}
	role="presentation"
>
	<slot />
</div>

<style>
	.svelvet-graph-wrapper {
		position: absolute;
		width: 100%;
		height: 100%;
		/* outline: solid 1px red; */
	}
</style>
