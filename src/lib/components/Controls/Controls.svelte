<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import { calculateFitView } from '$lib/utils';
	import type { CSSColorString } from '$lib/types';
	import { zoomAndTranslate } from '$lib/utils/movers/';
	import { tracking } from '$lib/stores';

	export let increment = 0.1;
	export let horizontal = false;
	export let bgColor: CSSColorString | null = null;
	export let iconColor: CSSColorString | null = null;
	export let corner = 'SW';

	const transforms = getContext<Graph['transforms']>('transforms');
	const dimensions = getContext<Graph['dimensions']>('dimensions');
	const locked = getContext<Graph['locked']>('locked');
	const groups = getContext<Graph['groups']>('groups');
	const bounds = getContext<Graph['bounds']>('bounds');

	const { translation } = transforms;

	const hidden = $groups.hidden.nodes;

	const nodeBounds = bounds.nodeBounds;

	function unhideAll() {
		hidden.set(new Set());
	}

	function zoomIn() {
		zoomAndTranslate(-1, dimensions, transforms, increment);
	}

	function zoomOut() {
		zoomAndTranslate(1, dimensions, transforms, increment);
	}

	function fitView() {
		tracking.set(true);
		const { x, y, scale } = calculateFitView($dimensions, $nodeBounds);
		translation.set({ x: x || 0, y: y || 0 });
		transforms.scale.set(scale || 1);
		tracking.set(false);
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
			style:--prop-controls-background-color={bgColor}
			style:--prop-controls-text-color={iconColor}
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
		box-shadow: var(--controls-shadow, var(--default-controls-shadow));
		border: solid 1px var(--controls-border, var(--default-controls-border));
		padding: 4px;
		color: var(
			--prop-controls-text-color,
			var(--controls-text-color, var(--default-controls-text-color))
		);
		background-color: var(
			--prop-controls-background-color,
			var(--controls-background-color, var(--default-controls-background-color))
		);
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
		font-size: 1.3rem;
		color: inherit;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
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
