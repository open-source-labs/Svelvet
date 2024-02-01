<script lang="ts">
	import { getContext } from 'svelte';
	import MiniNode from './MiniNode.svelte';
	import MiniGroupBox from './MiniGroupBox.svelte';
	import type { CSSColorString, Graph, Corner } from '$lib/types';
	import type { Node } from '$lib/types';
	import { calculateRelativeCursor } from '$lib/utils';

	let graph: Graph = getContext<Graph>('graph');

	export let width = 100;
	export let height = width;
	export let mapColor: CSSColorString | null = null;
	export let nodeColor: CSSColorString | null = null;
	export let borderColor: CSSColorString | null = null;
	export let corner: Corner = 'SE';
	export let hideable = false;

	const buffer = 0.9;
	const maxWidth = width * buffer;
	const maxHeight = height * buffer;

	const graphBounds = graph.bounds.graphBounds;
	$: bounds = $graphBounds;
	$: top = bounds.top;
	$: left = bounds.left;
	$: right = bounds.right;
	$: bottom = bounds.bottom;

	const nodes = graph.nodes;
	const groups = graph.groups;
	const transforms = graph.transforms;
	const dimensions = graph.dimensions;
	const hidden = $groups.hidden.nodes;
	const scale = transforms.scale;
	const translation = transforms.translation;
	const groupBoxes = graph.groupBoxes;

	$: graphWidth = $dimensions.width;
	$: graphHeight = $dimensions.height;

	$: boundsWidth = right - left;
	$: boundsHeight = bottom - top;
	$: boundsRatio = boundsWidth / boundsHeight;

	$: minimapRatio = width / height;

	$: window = calculateRelativeCursor(e, 0, 0, graphWidth, graphHeight, $scale, $translation);

	$: windowWidth = graphWidth / boundsWidth / $scale;
	$: windowHeight = graphHeight / boundsHeight / $scale;

	$: windowTop = (window.y - top) / boundsHeight;
	$: windowLeft = (window.x - left) / boundsWidth;

	const e = { clientX: 0, clientY: 0 };

	$: windowStyle = `
		top: ${windowTopPx + windowTop * scaledBoundsHeight}px;
		left: ${windowLeftPx + windowLeft * scaledBoundsWidth}px;
		width: ${windowWidth * scaledBoundsWidth}px;
		height: ${windowHeight * scaledBoundsHeight}px;`;

	$: landscape = boundsRatio >= minimapRatio;
	$: boundsScale = landscape ? maxWidth / boundsWidth : maxHeight / boundsHeight;

	$: windowLeftPx = (width - scaledBoundsWidth) / 2;
	$: windowTopPx = (height - scaledBoundsHeight) / 2;

	$: scaledBoundsWidth = boundsWidth * boundsScale;
	$: scaledBoundsHeight = boundsHeight * boundsScale;

	function toggleHidden(node: Node) {
		if ($hidden.has(node)) {
			$hidden.delete(node);
		} else {
			$hidden.add(node);
		}
		$hidden = $hidden;
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
					{toggleHidden}
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
