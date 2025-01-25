<script>
	import { stopPropagation } from 'svelte/legacy';

	import { Controls } from '$lib';
</script>

<Controls     corner="SW">
	{#snippet children({ zoomIn, zoomOut, fitView, unhideAll })}
		<button onclick={stopPropagation(zoomIn)}>ZOOMER</button>
		<button onclick={stopPropagation(zoomOut)}>UN ZOOMER</button>
	{/snippet}
</Controls>
