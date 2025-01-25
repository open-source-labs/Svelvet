<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<script lang="ts">
	import { getContext } from 'svelte';
	import MiniNode from './MiniNode.svelte';
	import MiniGroupBox from './MiniGroupBox.svelte';
	import type { CSSColorString, Graph, Corner } from '$lib/types';
	import type { Node } from '$lib/types';
	import { calculateRelativeCursor } from '$lib/utils';

	const graph = getContext<Graph>('graph');
	const width = 100;
	const height = width;
	const buffer = 0.9;
	const maxWidth = width * buffer;
	const maxHeight = height * buffer;
	const graphBounds = graph.bounds.graphBounds;
	const nodes = graph.nodes;
	const groups = graph.groups;
	const transforms = graph.transforms;
	const dimensions = graph.dimensions;
	const hidden = groups.hidden.nodes;
	const scale = transforms.scale;
	const translation = transforms.translation;
	const groupBoxes = graph.groupBoxes;
	let e = { clientX: 0, clientY: 0 };

	$props = {
		width,
		height,
		mapColor: null,
		nodeColor: null,
		borderColor: null,
		corner: 'SE',
		hideable: false
	};

	$state = {
		graph,
		width,
		height,
		mapColor: null,
		nodeColor: null,
		borderColor: null,
		corner: 'SE',
		hideable: false,
		buffer,
		maxWidth,
		maxHeight,
		graphBounds,
		nodes,
		groups,
		transforms,
		dimensions,
		hidden,
		scale,
		translation,
		groupBoxes,
		e
	};

	$derived bounds = graphBounds;
	$derived top = bounds.top;
	$derived left = bounds.left;
	$derived right = bounds.right;
	$derived bottom = bounds.bottom;
	$derived graphWidth = dimensions.width;
	$derived graphHeight = dimensions.height;
	$derived boundsWidth = right - left;
	$derived boundsHeight = bottom - top;
	$derived boundsRatio = boundsWidth / boundsHeight;
	$derived minimapRatio = width / height;
	$derived window = calculateRelativeCursor(e, 0, 0, graphWidth, graphHeight, scale, translation);
	$derived windowWidth = graphWidth / boundsWidth / scale;
	$derived windowHeight = graphHeight / boundsHeight / scale;
	$derived windowTop = (window.y - top) / boundsHeight;
	$derived windowLeft = (window.x - left) / boundsWidth;
	$derived windowStyle = `
		top: ${windowTopPx + windowTop * scaledBoundsHeight}px;
		left: ${windowLeftPx + windowLeft * scaledBoundsWidth}px;
		width: ${windowWidth * scaledBoundsWidth}px;
		height: ${windowHeight * scaledBoundsHeight}px;`;
	$derived landscape = boundsRatio >= minimapRatio;
	$derived boundsScale = landscape ? maxWidth / boundsWidth : maxHeight / boundsHeight;
	$derived windowLeftPx = (width - scaledBoundsWidth) / 2;
	$derived windowTopPx = (height - scaledBoundsHeight) / 2;
	$derived scaledBoundsWidth = boundsWidth * boundsScale;
	$derived scaledBoundsHeight = boundsHeight * boundsScale;

	function toggleHidden(node: Node) {
		try {
			if ($hidden.has(node)) {
				$hidden.delete(node);
			} else {
				$hidden.add(node);
			}
			$hidden = $hidden;
		} catch (error) {
			console.error('Error toggling node visibility:', error);
		}
	}
</script>

<div
	class="minimap-wrapper"
	style:width="{width}px"
	style:height="{height ? height : width}px"
	style:--prop-minimap-border-color={borderColor}
	style:--prop-minimap-background-color={mapColor}
	class:SW={corner === 'SW'}
	class:NE={corner === 'NE'}
	class:SE={corner === 'SE'}
	class:NW={corner === 'NW'}
>
	<div
		class="node-wrapper"
		style:width="{boundsWidth}px"
		style:height="{boundsHeight}px"
		style:transform="scale({boundsScale})"
	>
		{#each Array.from($nodes.entries()) as [id, node] (id)}
			{#if node.id !== 'N-editor'}
				<MiniNode
					{node}
					{top}
					{left}
					{nodeColor}
					hidden={$hidden.has(node)}
					toggleHidden={toggleHidden}
					{hideable}
				/>
			{/if}
		{/each}

		{#each Array.from($groupBoxes.entries()) as [id, group] (id)}
			<MiniGroupBox {...group} {top} {left} groupName={id} />
		{/each}
	</div>

	<div class="overlay" style={windowStyle} />
</div>

<style>
	* {
		box-sizing: border-box;
	}
	.minimap-wrapper {
		position: absolute;
		border-radius: 6px;
		overflow: hidden;
		box-shadow: var(--minimap-shadow, var(--default-minimap-shadow));
		border: solid 1px;
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(
			--prop-minimap-background-color,
			var(
				--minimap-background-color,
				var(--background-color, var(--default-minimap-background-color))
			)
		);
		border-color: var(
			--prop-minimap-border-color,
			var(--minimap-border, var(--default-minimap-border))
		);
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
		outline: 400px rgba(0, 0, 0, 0.25) solid;
		box-sizing: border-box;
		pointer-events: none;
	}
	.node-wrapper {
		position: absolute;
	}
</style>
