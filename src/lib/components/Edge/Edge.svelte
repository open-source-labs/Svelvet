<script lang="ts">
	import type {
		CSSColorString,
		Direction,
		EdgeStyle,
		Graph,
		Theme,
		WritableEdge
	} from '$lib/types';
	import { getContext } from 'svelte';
	import { readable, writable } from 'svelte/store';
	import { EDGE_WIDTH } from '$lib/constants';
	import { THEMES } from '$lib/constants/themes';
	import { roundNum } from '$lib/utils/helpers';
	import { calculateStepPath } from '$lib/utils/calculators';
	import { onMount, onDestroy } from 'svelte';
	import { directionVectors } from '$lib/constants/math';
	import { buildArcStringKey, constructArcString } from '$lib/utils/helpers';

	const graph = getContext<Graph>('graph');
	const theme = getContext<Theme>('theme');
	const edgeStyle = getContext<EdgeStyle>('edgeStyle');

	const { cursor } = graph;

	export let width: number = EDGE_WIDTH;
	export let color: CSSColorString = THEMES[theme].edge;
	export let straight = edgeStyle === 'straight';
	export let step = edgeStyle === 'step';
	export let animate = false;
	export let edge: WritableEdge = getContext<WritableEdge>('edge');
	export let label: string = '';
	export let labelColor: CSSColorString = THEMES[theme].node;
	export let textColor: CSSColorString = THEMES[theme].text;
	export let cornerRadius = 8;

	$: edgeKey = edge && edge.id;
	$: source = edge && edge.source;
	$: target = edge && edge.target;

	let path: string;
	let animationFrameId: number;
	let DOMPath: SVGPathElement; // The SVG path element used for calculating the midpoint of the curve for labels
	let pathMidPointX = 0;
	let pathMidPointY = 0;
	let tracking = false; // Boolean that stops/starts tracking the path midpoint
	let renderLabel = $$slots.label || label !== ''; // Boolean that determines whether or not to render the label

	const stepBuffer = 40; // This is the buffer around the nodes that a step path should take

	// The coordinates of the source and target anchors
	// If there is no source or target, use the cursor position
	$: sourceX = (source && source.position.x) || readable($cursor.x);
	$: sourceY = (source && source.position.y) || readable($cursor.y);
	$: targetX = (target && target.position.x) || readable($cursor.x);
	$: targetY = (target && target.position.y) || readable($cursor.y);

	// The distances between the points
	$: deltaX = roundNum($targetX - $sourceX);
	$: deltaY = roundNum($targetY - $sourceY);
	$: anchorWidth = Math.abs(deltaX);
	$: anchorHeight = Math.abs(deltaY);

	// Strength of curvature
	$: maxCurveDisplaceX = Math.max(30, Math.min(600, anchorWidth / 2));
	$: maxCurveDisplaceY = Math.max(30, Math.min(600, anchorHeight / 2));

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
	$: if (!step || edgeKey === 'cursor') {
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
	const vectorMap = {
		north: { x: 0, y: -1 },
		south: { x: 0, y: 1 },
		east: { x: 1, y: 0 },
		west: { x: -1, y: 0 },
		self: { x: 0, y: 0 }
	};

	$: if (step && edgeKey !== 'cursor') {
		const sourceObject = { x: $sourceX, y: $sourceY, direction: vectorMap[$sourceDirection] };
		const targetObject = { x: $targetX, y: $targetY, direction: vectorMap[$targetDirection] };
		const steps = calculateStepPath(sourceObject, targetObject, stepBuffer);

		const buildArcStringIfNeeded = (
			step: { x: number; y: number },
			index: number,
			radius: number
		) => {
			if (index < steps.length - 1) {
				const arcStringKey = buildArcStringKey(step, steps[index + 1]);
				return constructArcString(radius, arcStringKey);
			}
			return '';
		};

		path = steps.reduce((string, step, index) => {
			const directionX = Math.sign(step.x);
			const directionY = Math.sign(step.y);
			let xStep = step.x;
			let yStep = step.y;
			let arcString = '';

			if (cornerRadius) {
				const nextStep = steps[index + 1] || { x: 0, y: 0 };
				const previousStep = steps[index - 1] || { x: 0, y: 0 };

				const radiusX = calculateRadius(step.x, nextStep.x);
				const radiusY = calculateRadius(nextStep.y, step.y);
				const previousRadiusX = calculateRadius(previousStep.x, step.x);
				const previousRadiusY = calculateRadius(previousStep.y, step.y);
				const previousRadius = Math.min(previousRadiusX, previousRadiusY);
				const radius = Math.min(radiusX, radiusY);

				if (step.x) {
					xStep = step.x - (radius + previousRadius) * directionX;
				} else {
					yStep = step.y - (radius + previousRadius) * directionY;
				}

				arcString = buildArcStringIfNeeded(step, index, radius);
			}

			return buildPath(string, xStep, yStep, arcString);
		}, `M ${$sourceX}, ${$sourceY}`);
	}

	const buildPath = (string: string, xStep: number, yStep: number, arcString: string) =>
		string + ` l ${xStep} ${yStep} ` + arcString;

	const calculateRadius = (value1: number, value2: number) =>
		Math.min(Math.abs(value1 || value2) / 2, cornerRadius);
</script>

{#if source || target}
	<path
		id={edgeKey}
		bind:this={DOMPath}
		class:animate
		d={path}
		style:stroke={color}
		style:stroke-width={width + 'px'}
	/>
	<slot {path} {destroy} />
	{#if $$slots.label || label}
		<foreignObject x={pathMidPointX} y={pathMidPointY}>
			<span class="label-wrapper">
				<slot name="label">
					<div class="default-label" style:background-color={labelColor} style:color={textColor}>
						{label}
					</div>
				</slot>
			</span>
		</foreignObject>
	{/if}
{/if}

<style>
	.label-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	foreignObject {
		width: 100%;
		height: 100%;
		transform: translate(-50%, -50%);
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
