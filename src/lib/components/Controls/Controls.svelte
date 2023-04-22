<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import { calculateFitView } from '$lib/utils';
	import type { Writable } from 'svelte/store';
	import type { ThemeGroup, CSSColorString } from '$lib/types';
	import { zoomAndTranslate } from '$lib/utils/movers/';

	export let increment = 0.1;
	export let horizontal = false;
	export let bgColor: CSSColorString | null = null;
	export let iconColor: CSSColorString | null = null;
	export let corner = 'SW';

	const graph: Graph = getContext<Graph>('graph');
	const themeStore: Writable<ThemeGroup> = getContext('themeStore');

	const { transforms, locked, groups, dimensions } = graph;
	const { translation } = transforms;

	const hidden = $groups.hidden.nodes;
	const translationX = translation.x;
	const translationY = translation.y;
	const bounds = graph.bounds;
	const nodeBounds = bounds.nodeBounds;

	function unhideAll() {
		hidden.set(new Set());
	}

	function zoomIn() {
		zoomAndTranslate(-1, graph, increment);
	}

	function zoomOut() {
		zoomAndTranslate(1, graph, increment);
	}

	function fitView() {
		const { x, y, scale } = calculateFitView($dimensions, $nodeBounds);
		translationX.set(x || 0);
		translationY.set(y || 0);
		transforms.scale.set(scale || 1);
	}

	function lock() {
		// Toggle lock boolean
		$locked = !$locked;
	}
</script>

<nav
	class="graph-controls"
	class:SW={corner === 'SW'}
	class:NE={corner === 'NE'}
	class:SE={corner === 'SE'}
	class:NW={corner === 'NW'}
	aria-label="navigation"
>
	<slot {zoomIn} {zoomOut} {fitView} {lock} {unhideAll}>
		<div
			class="controls-wrapper"
			class:horizontal
			style:background-color={bgColor || $themeStore.controls}
			style:color={iconColor || $themeStore.text}
		>
			{#if $hidden.size > 0}
				<button class="unhide" on:mousedown|stopPropagation={unhideAll}>
					<span class="material-symbols-outlined">visibility_off</span>
				</button>
			{/if}
			<button class="zoom-in" on:mousedown|stopPropagation={zoomIn} on:touchstart={zoomIn}>
				<span class="material-symbols-outlined"> zoom_in </span>
			</button>
			<button class="zoom-out" on:mousedown|stopPropagation={zoomOut} on:touchstart={zoomOut}>
				<span class="material-symbols-outlined"> zoom_out </span>
			</button>
			<button class="reset" on:mousedown|stopPropagation={fitView} on:touchstart={fitView}>
				<span class="material-symbols-outlined"> filter_center_focus</span>
			</button>
			<button class="lock" on:mousedown|stopPropagation={lock} on:touchstart={lock}>
				<span class="material-symbols-outlined">
					{$locked ? 'lock_open' : 'lock'}
				</span>
			</button>
		</div>
	</slot>
</nav>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0');
	* {
		box-sizing: border-box;
	}

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
		width: 1.8rem;
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
		color: inherit;
	}

	.horizontal > button {
		border-bottom: none;
	}

	span {
		font-family: 'Material Symbols Outlined';
		font-size: 1.2rem;
		color: inherit;
	}
	button:last-child {
		border-bottom: none;
	}
	button:hover {
		cursor: pointer;
	}

	.horizontal {
		flex-direction: row-reverse !important;
		height: 1.5rem;
		gap: 6px;
		width: fit-content;
	}
</style>
