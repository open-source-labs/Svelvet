<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';

	const ZOOM_INCREMENT = 0.1;
	let graph: Graph = getContext<Graph>('graph');

	const { transforms, isLocked, groups } = graph;
	const { scale, translation } = transforms;
	const { x: xOffset, y: yOffset } = translation;
	const { x: translationX, y: translationY } = translation;

	$: hidden = $groups.hidden.nodes;

	function unhideAll() {
		hidden.set(new Set());
	}

	function zoomIn() {
		// Zoom in by 10%
		$scale *= 1 + ZOOM_INCREMENT;
	}

	function zoomOut() {
		// Zoom out by 10%

		$scale *= 1 - ZOOM_INCREMENT;
		// console.log($scale);
		// const translateX = 1600 * ZOOM_INCREMENT * $scale;
		// console.log(translateX);
		// $translationX += translateX / 10;
		// $translationY += translateX / 10;
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
	{#if $hidden.size > 0}
		<button on:click={unhideAll}>Unhide</button>
	{/if}
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
