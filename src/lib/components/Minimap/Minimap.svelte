<script lang="ts">
	import { getContext } from 'svelte';
	import MinimapNode from './MinimapNode.svelte';
	import type { Theme, CSSColorString, Graph, Corner } from '$lib/types';
	import type { Node } from '$lib/types';
	import { calculateRelativeCursor } from '$lib/utils';
	import { THEMES } from '$lib/constants/themes';

	let graph: Graph = getContext<Graph>('graph');
	const theme = getContext<Theme>('theme');

	export let width = 100;
	export let height = 100;
	export let mapColor = THEMES[theme].map;
	export let nodeColor: CSSColorString | null = null;
	export let borderColor: CSSColorString = THEMES[theme].border;
	export let corner: Corner = 'SE';

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
	style:background-color={mapColor}
	style:width="{width}px"
	style:height="{height ? height : width}px"
	class:SW={corner === 'SW'}
	class:NE={corner === 'NE'}
	class:SE={corner === 'SE'}
	class:NW={corner === 'NW'}
>
	<div class="node-wrapper" style={nodeWrapperStyle} style:border-color={borderColor}>
		{#each Object.values($nodes) as node}
			{#if node.id !== 'N-editor'}
				<MinimapNode
					{node}
					top={$top}
					left={$left}
					{boundsWidth}
					{boundsHeight}
					{nodeColor}
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
		background-color: rgb(255, 255, 255);
		border-radius: 6px;
		overflow: hidden;
		box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.5);
		border: solid 1px black;
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
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
	.overlay {
		position: absolute;
		background-color: transparent;
		border: solid 1px rgb(129, 129, 129);
		border-radius: 4px;
		pointer-events: none;
		z-index: 2;
		box-sizing: border-box;
	}
	.node-wrapper {
		position: absolute;
	}
</style>
