<script lang="ts">
	import type {
		CSSColorString,
		Direction,
		EdgeStyle,
		Graph,
		Theme,
		WritableEdge,
		XYPair
	} from '$lib/types';
	import type { ArcKey } from '$lib/types';
	import { getContext } from 'svelte';
	import { readable, writable } from 'svelte/store';
	import { EDGE_WIDTH } from '$lib/constants';
	import { THEMES } from '$lib/constants/themes';
	import { roundNum } from '$lib/utils/helpers';
	import { calculateStepPath } from '$lib/utils/calculators';
	import { onMount, onDestroy } from 'svelte';
	import { directionVectors } from '$lib/constants/math';

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

	const cornerRadius = 0;
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

	$: if (step && edgeKey !== 'cursor') {
		cornerRadiusX = Math.min(
			Math.min(Math.abs(deltaX - 80), Math.abs(deltaX - 80)) / 2,
			cornerRadius
		);
		cornerRadiusY = Math.min(Math.min(Math.abs(deltaY)) / 2, cornerRadius);

		const arcStrings = {
			'1001': `a ${cornerRadius} ${cornerRadius} 0 0 1 ${cornerRadius} ${cornerRadius}`,
			'0110': `a ${cornerRadius} ${cornerRadius} 0 0 0 ${cornerRadius} ${cornerRadius}`,
			'100-1': `a ${cornerRadius} ${cornerRadius} 0 0 0 ${cornerRadius} -${cornerRadius}`,
			'0-110': `a ${cornerRadius} ${cornerRadius} 0 0 1 ${cornerRadius} -${cornerRadius}`,
			'-1001': `a ${cornerRadius} ${cornerRadius} 0 0 0 -${cornerRadius} ${cornerRadius}`,
			'01-10': `a ${cornerRadius} ${cornerRadius} 0 0 1 -${cornerRadius} ${cornerRadius}`,
			'-100-1': `a ${cornerRadius} ${cornerRadius} 0 0 1 -${cornerRadius} -${cornerRadius}`,
			'0-1-10': `a ${cornerRadius} ${cornerRadius} 0 0 0 -${cornerRadius} -${cornerRadius}`
		};

		const vectorMap = {
			north: { x: 0, y: -1 },
			south: { x: 0, y: 1 },
			east: { x: 1, y: 0 },
			west: { x: -1, y: 0 },
			self: { x: 0, y: 0 }
		};

		const sourceObject = { x: $sourceX, y: $sourceY, direction: vectorMap[$sourceDirection] };
		const targetObject = { x: $targetX, y: $targetY, direction: vectorMap[$targetDirection] };

		const steps = calculateStepPath(sourceObject, targetObject, stepBuffer);

		path = steps.reduce((string, step, index) => {
			let arcString = '';
			const multiplier = index === 0 || index === steps.length - 1 ? 1 : 2;
			const directionX = Math.sign(step.x);
			const directionY = Math.sign(step.y);

			let xStep: number;
			let yStep: number;

			const customRadiusX = Math.min(cornerRadius, Math.abs(step.x));
			const customRadiusY = Math.min(cornerRadius, Math.abs(step.y));
			if (cornerRadius) {
				if (step.x !== 0) {
					xStep = step.x - 0 * multiplier * directionX;
				} else {
					xStep = step.x;
				}

				if (step.y !== 0) {
					yStep = step.y - 0 * multiplier * directionY;
				} else {
					yStep = step.y;
				}
			} else {
				xStep = step.x;
				yStep = step.y;
			}

			const stepDistanceString = ` l ${xStep} ${yStep} `;

			if (index < steps.length - 1) {
				const arcStringKey = buildArcStringKey(step, steps[index + 1]);
				arcString = arcStrings[arcStringKey] || '';
			}

			return string + stepDistanceString + arcString;
		}, `M ${$sourceX}, ${$sourceY}`);

		function buildArcStringKey(a: XYPair, b: XYPair): ArcKey {
			const aX = Math.sign(a.x).toString();
			const aY = Math.sign(a.y).toString();
			const bX = Math.sign(b.x).toString();
			const bY = Math.sign(b.y).toString();

			return `${aX}${aY}${bX}${bY}` as ArcKey;
		}
	}
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
