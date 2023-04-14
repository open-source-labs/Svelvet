<script lang="ts">
	import type { CSSColorString, Direction, Graph, Theme, WritableEdge } from '$lib/types';
	import type { StepDirection, ArcStringKey } from '$lib/types';
	import { getContext } from 'svelte';
	import { readable, writable } from 'svelte/store';
	import { EDGE_WIDTH } from '$lib/constants';
	import { THEMES } from '$lib/constants/themes';
	import { roundNum } from '$lib/utils/helpers';
	import { calculateStepPath } from '$lib/utils/calculators';
	import { onMount, onDestroy } from 'svelte';
	import { directionVectors } from '$lib/constants/math';
	import { createEdge } from '$lib/utils';

	const graph = getContext<Graph>('graph');
	const theme = getContext<Theme>('theme');

	const { cursor } = graph;

	export let strokeWidth: number = EDGE_WIDTH;
	export let strokeColor: CSSColorString = THEMES[theme].edge;
	export let straight = false;
	export let step = false;
	export let animate = false;
	export let edge: WritableEdge = getContext<WritableEdge>('edge');
	export let label: string = '';
	export let labelColor: CSSColorString = THEMES[theme].node;
	export let textColor: CSSColorString = THEMES[theme].text;

	$: edgeKey = edge && edge.id;
	$: source = edge && edge.source;
	$: target = edge && edge.target;

	let path: string;
	let cornerRadiusX = 0;
	let cornerRadiusY = 0;
	let animationFrameId: number;
	let DOMPath: SVGPathElement; // The SVG path element used for calculating the midpoint of the curve for labels
	let pathMidPointX = 0;
	let pathMidPointY = 0;
	let tracking = false; // Boolean that stops/starts tracking the path midpoint
	let renderLabel = $$slots.label || label !== ''; // Boolean that determines whether or not to render the label

	const cornerRadiusConstant = 8;
	const stepBuffer = 20; // This is the buffer around the nodes that a step path should take

	// The coordinates of the source and target anchors
	// If there is no source or target, use the cursor position
	$: sourceX = (source && source.position.x) || readable($cursor.x);
	$: sourceY = (source && source.position.y) || readable($cursor.y);
	$: targetX = (target && target.position.x) || readable($cursor.x);
	$: targetY = (target && target.position.y) || readable($cursor.y);

	// The distances between the points
	$: deltaX = roundNum($targetX - $sourceX);
	$: deltaY = roundNum($targetY - $sourceY);
	$: width = Math.abs(deltaX);
	$: height = Math.abs(deltaY);

	// Strength of curvature
	$: maxCurveDisplaceX = Math.max(30, Math.min(600, width / 2));
	$: maxCurveDisplaceY = Math.max(30, Math.min(600, height / 2));

	// The directionality of the source and target anchors
	$: sourceDirection = source?.direction || writable('self' as Direction);
	$: targetDirection = target?.direction || writable('self' as Direction);

	// Helper XY pair to offset the control points
	$: sourceControlVector = directionVectors[$sourceDirection];
	$: targetControlVector = directionVectors[$targetDirection];

	// Calculating the control points for the bezier curve
	$: sourceControlX = roundNum($sourceX + sourceControlVector.x * maxCurveDisplaceX);
	$: sourceControlY = roundNum($sourceY + sourceControlVector.y * maxCurveDisplaceY);
	$: targetControlX = roundNum($targetX + targetControlVector.x * maxCurveDisplaceX);
	$: targetControlY = roundNum($targetY + targetControlVector.y * maxCurveDisplaceY);

	// Constructing the control point element of the path string
	$: controlPointString = `C ${sourceControlX}, ${sourceControlY} ${targetControlX}, ${targetControlY}`;

	// The full SVG path string
	$: if (!step) {
		path = `M ${$sourceX}, ${$sourceY} ${!straight && controlPointString} ${$targetX}, ${$targetY}`;
	}

	// Is the source or target moving?
	$: sourceMoving = source?.moving || readable(false);
	$: targetMoving = target?.moving || readable(false);

	// We only want to recalculate the path midpoints if the source or target is moving
	// And we only want to recalculate the path midpoints if there is a label
	$: if (renderLabel && !tracking && ($sourceMoving || $targetMoving || edgeKey === 'cursor')) {
		tracking = true;
		trackPath();
	} else if (tracking && !$sourceMoving && !$targetMoving && edgeKey !== 'cursor') {
		tracking = false;
		cancelAnimationFrame(animationFrameId);
	}

	// Track the path in sync with browser animation frames
	function trackPath() {
		if (!tracking) return;
		if (DOMPath) calculatePath();
		animationFrameId = requestAnimationFrame(trackPath);
	}

	// One time calculatin of path midpoint
	function calculatePath() {
		const pathLength = DOMPath.getTotalLength();
		const halfLength = pathLength / 2;
		const pathMidPoint = DOMPath.getPointAtLength(halfLength);
		pathMidPointX = pathMidPoint.x;
		pathMidPointY = pathMidPoint.y;
	}

	onMount(() => {
		calculatePath();
	});

	onDestroy(() => {
		cancelAnimationFrame(animationFrameId);
	});

	function destroy() {
		graph.edges.delete(edgeKey);
		source?.connected.update((connected) => {
			if (target) connected.delete(target);
			return connected;
		});
		target?.connected.update((connected) => {
			if (source) connected.delete(source);
			return connected;
		});
	}

	$: if (step && edgeKey !== 'cursor') {
		cornerRadiusX = Math.min(
			Math.min(Math.abs(deltaY), Math.abs(deltaY)) / 2,
			cornerRadiusConstant
		);
		cornerRadiusY = Math.min(
			Math.min(Math.abs(deltaY), Math.abs(deltaY)) / 2,
			cornerRadiusConstant
		);

		const arcStrings = {
			rightdown: `a ${cornerRadiusX} ${cornerRadiusY} 0 0 1 ${cornerRadiusX} ${cornerRadiusY}`,
			downright: `a ${cornerRadiusX} ${cornerRadiusY} 0 0 0 ${cornerRadiusX} ${cornerRadiusY}`,
			rightup: `a ${cornerRadiusX} ${cornerRadiusY} 0 0 0 ${cornerRadiusX} -${cornerRadiusY}`,
			upright: `a ${cornerRadiusX} ${cornerRadiusY} 0 0 1 ${cornerRadiusX} -${cornerRadiusY}`,
			leftdown: `a ${cornerRadiusX} ${cornerRadiusY} 0 0 0 -${cornerRadiusX} ${cornerRadiusY}`,
			downleft: `a ${cornerRadiusX} ${cornerRadiusY} 0 0 1 -${cornerRadiusX} ${cornerRadiusY}`,
			leftup: `a ${cornerRadiusX} ${cornerRadiusY} 0 0 1 -${cornerRadiusX} -${cornerRadiusY}`,
			upleft: `a ${cornerRadiusX} ${cornerRadiusY} 0 0 0 -${cornerRadiusX} -${cornerRadiusY}`
		};

		function buildArcStringKey(a: StepDirection, b: StepDirection): ArcStringKey {
			return `${a}${b}` as ArcStringKey;
		}

		const { steps, distance } = calculateStepPath(
			$sourceDirection,
			$targetDirection,
			deltaX,
			deltaY,
			stepBuffer
		);

		path = steps.reduce((acc, curr, index) => {
			let stepDistanceString = '';
			let arcString = '';
			let multiplier = index === 0 || index === steps.length - 1 ? 1 : 2;

			if (curr === 'left') {
				stepDistanceString += ` l ${-distance[index] + multiplier * cornerRadiusX} 0 `;
			} else if (curr === 'right') {
				stepDistanceString += ` l ${distance[index] - multiplier * cornerRadiusX} 0 `;
			} else if (curr === 'up') {
				stepDistanceString += ` l 0 ${-distance[index] + multiplier * cornerRadiusY} `;
			} else if (curr === 'down') {
				stepDistanceString += ` l 0 ${distance[index] - multiplier * cornerRadiusY} `;
			}

			if (index < steps.length - 1) {
				const arcStringKey = buildArcStringKey(curr, steps[index + 1]);
				arcString = arcStrings[arcStringKey] || '';
			}

			return acc + stepDistanceString + arcString;
		}, `M ${$sourceX}, ${$sourceY}`);
	}
</script>

{#if source || target}
	<path
		bind:this={DOMPath}
		class:animate
		d={path}
		style:stroke={strokeColor}
		style:stroke-width={strokeWidth + 'px'}
	/>
	<slot {path} {destroy} />
	{#if $$slots.label || label}
		<foreignObject x={pathMidPointX} y={pathMidPointY} width="300" height="300">
			<div role="note" class="label-wrapper">
				<slot name="label">
					<div class="default-label" style:background-color={labelColor} style:color={textColor}>
						{label}
					</div>
				</slot>
			</div>
		</foreignObject>
	{/if}
{/if}

<style>
	.label-wrapper {
		transform: translate(-50%, -50%);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.animate {
		stroke-dasharray: 5;
		animation: dash 1s linear infinite;
		will-change: stroke-dashoffset;
	}

	.default-label {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100px;
		height: 100px;
		font-size: 1rem;
		height: 1.5rem;
		border-radius: 5px;
		padding: 10px;
	}

	foreignObject {
	}

	@keyframes dash {
		from {
			stroke-dashoffset: 30;
		}
	}

	/* .retract {
		stroke-dasharray: 1000;
		stroke-dashoffset: 0;
		animation: retract 1s linear infinite forwards;
	} */
	@keyframes retract {
		to {
			stroke-dashoffset: 1000;
		}
	}
</style>
