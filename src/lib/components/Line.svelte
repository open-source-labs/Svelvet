<!-- Line.svelte -->
<script lang="ts">
	import type { Anchor, Direction, Graph, XYPair, Theme, EdgeKey } from '$lib/types';
	import { getContext } from 'svelte';
	import { readable } from 'svelte/store';
	import { EDGE_WIDTH } from '$lib/constants';
	import { THEMES } from '$lib/constants/themes';
	import EdgeLabel from './EdgeLabel/EdgeLabel.svelte';

	const graph = getContext<Graph>('graph');
	const theme = getContext<Theme>('theme');

	const { cursor } = graph;

	export let source: Anchor | null = null;
	export let target: Anchor | null = null;
	export let strokeWidth = 1;
	export let strokeColor = THEMES[theme].edge;
	export let type = 'bezier';
	export let edgeKey: EdgeKey = 'cursor';

	const buffer = 200;
	let active = false;
	let animate = false;

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

	$: maxCurveDisplaceX = Math.max(30, Math.min(600, width / 2));
	$: maxCurveDisplaceY = Math.max(30, Math.min(600, height / 2));

	$: sourceControlX = sourcePointX + sourceControlVector.x * maxCurveDisplaceX;
	$: sourceControlY = sourcePointY + sourceControlVector.y * maxCurveDisplaceY;
	$: targetControlX = targetPointX + targetControlVector.x * maxCurveDisplaceX;
	$: targetControlY = targetPointY + targetControlVector.y * maxCurveDisplaceY;

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

	let DOMPath: SVGPathElement;
	let animationFrameId: number;
	let pathMidPointX = 0;
	let pathMidPointY = 0;
	let tracking = false;

	$: sourceMoving = source?.moving || readable(false);
	$: targetMoving = target?.moving || readable(false);

	$: if (!tracking && ($sourceMoving || $targetMoving || edgeKey === 'cursor')) {
		tracking = true;
		trackPath();
	} else if (tracking && !$sourceMoving && !$targetMoving && edgeKey !== 'cursor') {
		tracking = false;
		cancelAnimationFrame(animationFrameId);
	}

	function trackPath() {
		if (!tracking) return;
		if (DOMPath) {
			calculatePath();
		}

		animationFrameId = requestAnimationFrame(trackPath);
	}

	function calculatePath() {
		console.log('Calculating');
		const pathLength = DOMPath.getTotalLength();
		const halfLength = pathLength / 2;
		const pathMidPoint = DOMPath.getPointAtLength(halfLength);
		pathMidPointX = pathMidPoint.x;
		pathMidPointY = pathMidPoint.y;
	}

	import { onMount, onDestroy } from 'svelte';
	onMount(() => {
		calculatePath();
	});

	onDestroy(() => {
		cancelAnimationFrame(animationFrameId);
	});
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
			bind:this={DOMPath}
			class:animate
			d={path}
			style:stroke={strokeColor}
			style:--default-edge-stroke-width={strokeWidth + 'px'}
			stroke={strokeColor}
			stroke-width={strokeWidth}
			fill="transparent"
		/>
	</svg>
	<EdgeLabel label="Hello" top={pathMidPointY} left={pathMidPointX} />
</div>

<style>
	path {
		pointer-events: auto;
		stroke: var(--edge-color, var(--default-edge-color));
		stroke-width: var(--edge-stroke-width, var(--default-edge-stroke-width));
	}
	.wrapper {
		position: absolute;
		pointer-events: none;
		/* border: solid 1px red; */
	}

	svg {
		width: 100%;
		height: 100%;
		z-index: -4;
	}

	.active:hover {
		stroke: red;
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
