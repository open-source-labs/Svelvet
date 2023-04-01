<script lang="ts">
	import type { GraphKey, GraphTransforms } from '$lib/types';
	import type { Writable } from 'svelte/store';

	export let id: GraphKey;
	export let transforms: GraphTransforms;

	const { translation, scale } = transforms;
	const { x, y } = translation;

	// Reactive statement to update the transform attribute of the wrapper
	// We apply this with the style directive below
	$: transform = `translate(${$x}px, ${$y}px) scale(${$scale})`;

	const className = 'svelvet-graph-wrapper';
</script>

<div style:transform {id} class={className} role="presentation">
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
