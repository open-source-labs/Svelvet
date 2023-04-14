<script lang="ts">
	import { THEMES } from '$lib/constants/themes';
	import type { Graph, Theme } from '$lib/types';
	import { getContext } from 'svelte';
	import { calculateTranslation, zoomGraph, translateGraph, calculateZoom } from '$lib/utils';

	export let increment = 0.1;
	export let horizontal = false;

	const graph: Graph = getContext<Graph>('graph');
	const theme: Theme = getContext<Theme>('theme');

	const { transforms, locked, groups, dimensions } = graph;
	const { scale, translation } = transforms;
	const { x: xOffset, y: yOffset } = translation;

	$: hidden = $groups.hidden.nodes;
	$: translationX = translation.x;
	$: translationY = translation.y;

	function unhideAll() {
		hidden.set(new Set());
	}

	function zoom(direction = 1) {
		// Zoom in by 10%
		const { width, height, top, left } = $dimensions;

		const newScale = calculateZoom($scale, direction, increment);
		const newTranslation = calculateTranslation(
			$scale,
			newScale,
			{ x: $translationX, y: $translationY },
			{ x: width / 2 + left, y: height / 2 + top },
			$dimensions
		);
		zoomGraph(scale, newScale);
		translateGraph(translation, newTranslation);
	}

	function zoomIn() {
		zoom(-1);
	}

	function zoomOut() {
		zoom(1);
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

	export let bgColor = THEMES[theme].controls;
	export let iconColor = THEMES[theme].text;
	export let corner = 'SW';
</script>

<nav
	class="graph-controls"
	class:SW={corner === 'SW'}
	class:NE={corner === 'NE'}
	class:SE={corner === 'SE'}
	class:NW={corner === 'NW'}
	aria-label="navigation"
>
	<slot {zoomIn} {zoomOut} {reset} {lock} {unhideAll}>
		<div class="controls-wrapper" class:horizontal style:background-color={bgColor}>
			{#if $hidden.size > 0}
				<button on:mousedown|stopPropagation={unhideAll}>
					<span style:color={iconColor} class="material-symbols-outlined"> visibility_off </span>
				</button>
			{/if}
			<button on:mousedown|stopPropagation={zoomIn} on:touchstart={zoomIn}>
				<span style:color={iconColor} class="material-symbols-outlined"> zoom_in </span>
			</button>
			<button on:mousedown|stopPropagation={zoomOut} on:touchstart={zoomOut}>
				<span style:color={iconColor} class="material-symbols-outlined"> zoom_out </span>
			</button>
			<button on:mousedown|stopPropagation={reset} on:touchstart={reset}>
				<span style:color={iconColor} class="material-symbols-outlined"> restart_alt </span>
			</button>
			<button on:mousedown|stopPropagation={lock} on:touchstart={lock}>
				<span style:color={iconColor} class="material-symbols-outlined">
					{$locked ? 'lock_open' : 'lock'}
				</span>
			</button>
		</div>
	</slot>
</nav>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0');
	.graph-controls {
		position: absolute;
	}

	.NW {
		left: 10px;
		top: 10px;
	}

	.NE {
		right: 10px;
		top: 10px;
	}

	.SE {
		right: 10px;
		bottom: 10px;
	}

	.SW {
		left: 10px;
		bottom: 10px;
	}
	.controls-wrapper {
		left: 10px;
		bottom: 10px;
		display: flex;
		width: 1.5rem;
		flex-direction: column;
		border-radius: 6px;
		overflow: hidden;
		box-shadow: var(--shadow-elevation-low);
		padding: 4px;
	}

	/* reset button */
	button {
		margin: 0;
		padding: 0;
		border: none;
		background: none;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.2rem 0;
		border-bottom: solid 1px rgb(190, 188, 188);
	}

	.horizontal > button {
		border-bottom: none;
	}

	span {
		font-family: 'Material Symbols Outlined';
		font-size: 1.2rem;
	}
	button:last-child {
		border-bottom: none;
	}
	button:hover {
		color: black;
		cursor: pointer;
	}

	.horizontal {
		flex-direction: row-reverse !important;
		height: 1.5rem;
		gap: 6px;
		width: fit-content;
	}
</style>
