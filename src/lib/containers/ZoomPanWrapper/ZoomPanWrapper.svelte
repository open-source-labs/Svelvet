<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { updateTranslation } from '$lib/utils';
	import { get } from 'svelte/store';

	const graph = getContext<Graph>('graph'); //graph is an object with
	//console.log('this is our graph', graph); Upon cl, we sa wthe graph object but it does not show the edges, transforms, nodes
	const transforms = graph.transforms;
	const scale = transforms.scale; //zoom
	const translation = transforms.translation; //x and y coordinates
	const cursor = graph.cursor; //used to recognize dragging or dropping the graph

	export let isMovable: boolean; //whether the graph can be moved or not
	let animationFrameId: number; //stores the ID and is used for animations in the browser
	let moving = false; //if graph is moved

	//anything with the $ infront means REACTIVE STATE
	$: graphTranslation = $translation;

	// Reactive statement to update the transform attribute of the wrapper
	$: transform = `translate(${graphTranslation.x}px, ${graphTranslation.y}px) scale(${$scale})`;

	$: if (isMovable && !moving) {
		moving = true;
		animationFrameId = requestAnimationFrame(translate); //this works, we see the changes
	} else if (!isMovable || !moving) {
		moving = false;
		cancelAnimationFrame(animationFrameId);
	}

	function translate() {
		$translation = updateTranslation(get(initialClickPosition), $cursor, transforms);
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
