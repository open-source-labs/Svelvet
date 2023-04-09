<script lang="ts">
	import { getContext } from 'svelte';
	import MinimapNode from './MinimapNode.svelte';
	import type { Graph } from '$lib/types';
	import type { Node } from '$lib/types';
	import { calculateRelativeCursor } from '$lib/utils';

	export let width = 100;
	export let height = 100;
	export let mapColor = 'white';

	let graph: Graph = getContext<Graph>('graph');

	$: bounds = graph.bounds;
	$: top = bounds.top;
	$: left = bounds.left;
	$: bottom = bounds.bottom;
	$: right = bounds.right;

	$: nodes = graph.nodes;
	$: groups = graph.groups;
	$: transforms = graph.transforms;

	$: dimensions = graph.dimensions;
	$: graphWidth = $dimensions.width;
	$: graphHeight = $dimensions.height;

	$: hidden = $groups.hidden.nodes;
	$: boundsWidth = $right - $left;
	$: boundsHeight = $bottom - $top;
	$: aspectRatio = boundsWidth / boundsHeight;

	$: scale = transforms.scale;
	$: xTranslation = transforms.translation.x;
	$: yTranslation = transforms.translation.y;

	$: window = calculateRelativeCursor(
		e,
		0,
		0,
		graphWidth,
		graphHeight,
		$scale,
		$xTranslation,
		$yTranslation
	);

	$: windowWidth = (graphWidth / boundsWidth / $scale) * 100;
	$: windowHeight = (graphHeight / boundsHeight / $scale) * 100;

	$: windowTop = ((window.y - $top) / boundsHeight) * 100;
	$: windowLeft = ((window.x - $left) / boundsWidth) * 100;

	const e = { clientX: 0, clientY: 0 };

	function toggleHidden(node: Node) {
		if ($hidden.has(node)) {
			$hidden.delete(node);
		} else {
			$hidden.add(node);
		}
		$hidden = $hidden;
	}

	$: windowStyle = `
		top: ${windowTop}%;
		left: ${windowLeft}%;
		width: ${windowWidth}%;
		height: ${windowHeight}%;`;

	$: nodeWrapperStyle = `
		aspect-ratio: ${aspectRatio};
		${boundsWidth > boundsHeight ? 'width: 90%' : 'height: 90%'};`;
</script>

<div
	class="minimap-wrapper"
	style="width: {width}px; height: {height
		? height
		: width}px; --default-minimap-background-color: {mapColor};"
>
	<div class="node-wrapper" style={nodeWrapperStyle}>
		{#each Object.values($nodes) as node}
			{#if node.id !== 'N-editor'}
				<MinimapNode
					{node}
					top={$top}
					left={$left}
					{boundsWidth}
					{boundsHeight}
					hidden={$hidden.has(node)}
					{toggleHidden}
				/>
			{/if}
		{/each}
		<div class="overlay" style={windowStyle} />
	</div>
</div>

<style>
	.minimap-wrapper {
		position: absolute;
		bottom: 10px;
		right: 10px;
		background-color: rgb(98, 98, 98);
		border-radius: 10px;
		overflow: hidden;
		width: 100%;
		height: 100%;
		box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.5);
		border: solid 1px black;
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.overlay {
		position: absolute;
		background-color: rgba(148, 234, 233, 0.322);
		pointer-events: none;
	}
</style>
