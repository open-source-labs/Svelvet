<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';

	const ZOOM_INCREMENT = 0.1;
	let graph: Graph = getContext<Graph>('graph');

	const { transforms, locked, groups } = graph;
	const { scale, translation } = transforms;
	const { x: xOffset, y: yOffset } = translation;

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
	}

	function reset() {
		// Reset scale
		$scale = 1;

		// Reset offset
		$xOffset = 0;
		$yOffset = 0;
	}

	function lock() {
		// Toggle lock boolean
		$locked = !$locked;
	}
</script>

<nav class="controls-wrapper">
	<slot {zoomIn} {zoomOut} {reset} {lock} {unhideAll}>
		{#if $hidden.size > 0}
			<button on:click={unhideAll}>Unhide</button>
		{/if}
		<button on:click={zoomIn}>+</button>
		<button on:click={zoomOut}>-</button>
		<button on:click={reset}>Reset</button>
		<button on:click={lock}>{$locked ? 'Unlock' : 'Lock'}</button>
	</slot>
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
