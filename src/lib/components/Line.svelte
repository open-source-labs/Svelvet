<!-- Line.svelte -->
<script lang="ts">
	import type { Anchor, Direction, Graph, XYPair, Theme } from '$lib/types';
	import { getContext } from 'svelte';
	import { readable } from 'svelte/store';
	import { EDGE_WIDTH } from '$lib/constants';
	import { THEMES } from '$lib/constants/themes';

	const graph = getContext<Graph>('graph');
	const theme = getContext<Theme>('theme');

	const { cursor } = graph;

	export let source: Anchor<false> | null = null;
	export let target: Anchor<true> | null = null;
	export let strokeWidth = 3;
	export let strokeColor = THEMES[theme].edge;
	export let type = 'bezier';

	const buffer = 200;
	let active = false;
	let animate = true;

	const directionVectors: Record<Direction, XYPair> = {
		north: { x: 0, y: -1 },
		south: { x: 0, y: 1 },
		east: { x: 1, y: 0 },
		west: { x: -1, y: 0 },
		self: { x: 0, y: 0 }
	};

	$: sourceDirection = source?.direction;
	$: targetDirection = target?.direction;

	$: sourceControlVector = directionVectors[$sourceDirection || 'self'];
	$: targetControlVector = directionVectors[$targetDirection || 'self'];

	$: sourceX = (source && source.position.x) || readable($cursor.x);
	$: sourceY = (source && source.position.y) || readable($cursor.y);
	$: targetX = (target && target.position.x) || readable($cursor.x);
	$: targetY = (target && target.position.y) || readable($cursor.y);

	$: deltaX = $targetX - $sourceX;
	$: deltaY = $targetY - $sourceY;

	$: width = Math.abs($sourceX - $targetX);
	$: height = Math.abs($sourceY - $targetY);

	$: top = Math.min($sourceY, $targetY);
	$: left = Math.min($sourceX, $targetX);

	$: bufferWidth = width + buffer * 2;
	$: bufferHeight = height + buffer * 2;

	$: CSSwidth = bufferWidth + 'px';
	$: CSSheight = bufferHeight + 'px';

	$: CSStop = top - buffer + 'px';
	$: CSSleft = left - buffer + 'px';

	$: sourceControlX = sourcePointX + sourceControlVector.x * (width / 2);
	$: sourceControlY = sourcePointY + sourceControlVector.y * (height / 2);
	$: targetControlX = targetPointX + targetControlVector.x * (width / 2);
	$: targetControlY = targetPointY + targetControlVector.y * (height / 2);

	$: sourcePointX = flipX ? buffer + width : buffer;
	$: sourcePointY = flipY ? buffer + height : buffer;

	$: targetPointX = flipX ? buffer : buffer + width;
	$: targetPointY = flipY ? buffer : buffer + height;

	$: path = `M ${sourcePointX}, ${sourcePointY}
	${
		type === 'bezier'
			? `C ${sourceControlX}, ${sourceControlY}
	${targetControlX}, ${targetControlY}`
			: ''
	}
	${targetPointX}, ${targetPointY}`;

	$: flipX = deltaX < 0;
	$: flipY = deltaY < 0;
</script>

<div
	class="wrapper"
	style:width={CSSwidth}
	style:height={CSSheight}
	style:top={CSStop}
	style:left={CSSleft}
>
	<svg class:active>
		<path
			class:animate
			d={path}
			style:stroke={strokeColor}
			style:--default-edge-stroke-width={EDGE_WIDTH}
			stroke={strokeColor}
			stroke-width={strokeWidth}
			fill="transparent"
		/>
	</svg>
</div>

<style>
	path {
		pointer-events: auto;
		cursor: pointer;
		stroke: var(--edge-color, var(--default-edge-color));
		stroke-width: var(--edge-stroke-width, var(--default-edge-stroke-width));
	}
	svg {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: -4;
		pointer-events: none;
	}
	.active:hover {
		stroke: red;
	}
	.wrapper {
		position: absolute;
		pointer-events: none;
	}

	.animate {
		stroke-dasharray: 5;
		animation: dash 1s linear infinite;
		will-change: stroke-dashoffset;
	}

	@keyframes dash {
		from {
			stroke-dashoffset: 30;
		}
	}

	.retract {
		stroke-dasharray: 1000;
		stroke-dashoffset: 0;
		animation: retract 1s linear infinite forwards;
	}
	@keyframes retract {
		to {
			stroke-dashoffset: 1000;
		}
	}
</style>
