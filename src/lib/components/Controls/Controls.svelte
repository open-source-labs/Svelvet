<script lang="ts">
	import { graphStore } from '$lib/stores';
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const ZOOM_INCREMENT = 0.1;
	let graph: Writable<Graph>;
	let { graphId } = getContext('graphId');
	console.log(graphId);
	graph = graphStore.get(graphId);

	const { transforms, isLocked } = $graph;
	const { scale, translation } = transforms;
	const { x: xOffset, y: yOffset } = translation;

	function zoomIn() {
		// Zoom in by 10%
		$scale *= 1 + ZOOM_INCREMENT;
	}

	function zoomOut() {
		// Zoom out by 10%
		$scale *= 1 - ZOOM_INCREMENT;
	}

	function resetTransforms() {
		// Reset scale
		$scale = 1;

		// Reset offset
		$xOffset = 0;
		$yOffset = 0;
	}

	function toogleNodeLock() {
		// Toggle lock boolean
		$isLocked = !$isLocked;
	}
</script>

<nav class="controls-wrapper">
	<button on:click={zoomIn}>+</button>
	<button on:click={zoomOut}>-</button>
	<button on:click={resetTransforms}>Reset</button>
	<button on:click={toogleNodeLock}>{$isLocked ? 'Unlock' : 'Lock'}</button>
</nav>

<style>
	.controls-wrapper {
		position: absolute;
		left: 10px;
		bottom: 10px;
		display: flex;
		width: 60px;
		flex-direction: column;
	}
</style>
