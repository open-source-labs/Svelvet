<script lang="ts">
	import type { CSSColorString, Direction, EdgeStyle, Graph } from '$lib/types';
	import type { CursorAnchor, ThemeGroup, WritableEdge } from '$lib/types';
	import { get } from 'svelte/store';
	import { getContext } from 'svelte';
	import { EDGE_WIDTH } from '$lib/constants';
	import { calculateStepPath, calculateRadius } from '$lib/utils/calculators';
	import { onMount, onDestroy } from 'svelte';
	import { directionVectors, stepBuffer } from '$lib/constants';
	import {
		buildArcStringKey,
		constructArcString,
		buildPath,
		rotateVector
	} from '$lib/utils/helpers';
	import type { Writable } from 'svelte/store';

	const edgeStore = getContext<Graph['edges']>('edgeStore');
	const themeStore = getContext<Writable<ThemeGroup>>('themeStore');
	const edgeStyle = getContext<EdgeStyle>('edgeStyle');

	export let edge: WritableEdge = getContext<WritableEdge>('edge');
	export let width: number = EDGE_WIDTH;
	export let color: CSSColorString | null = null;
	export let straight = edgeStyle === 'straight';
	export let step = edgeStyle === 'step';
	export let animate = false;
	export let label = '';
	export let labelColor: CSSColorString | null = null;
	export let textColor: CSSColorString | null = null;
	export let cornerRadius = 8;
	export let edgeClick: null | (() => void) = null;
	export let targetColor: CSSColorString | null = null;

	const source = edge.source;
	const target = edge.target;
	const sourceDirection = source.direction;
	const targetDirection = target.direction;
	const sourceRotation = source.rotation;
	const targetRotation = target.rotation;
	const sourcePositionStore = source.position;
	const targetPositionStore = target.position;
	const sourceDynamic = source.dynamic;
	const targetDynamic = target.dynamic;
	const sourceMoving = source.moving;
	const targetMoving = target.moving;
	const sourceNodePosition = source.node?.position;
	const targetNodePosition = target.node?.position;
	const edgeType = edge.type;
	const edgeKey = edge.id;

	let path: string;
	let animationFrameId: number;
	let DOMPath: SVGPathElement; // The SVG path element used for calculating the midpoint of the curve for labels
	let pathMidPointX = 0;
	let pathMidPointY = 0;
	let tracking = false; // Boolean that stops/starts tracking the path midpoint
	let prefersVertical = false;
	let sourceAbove = false;
	let sourceLeft = false;

	$: dynamic = $sourceDynamic || $targetDynamic;

	$: edgeColor = source?.edgeColor || target?.edgeColor || null;
	$: edgeLabel = edge && edge.label?.text;
	$: finalColor = color || $edgeColor || $themeStore.edge;
	$: labelText = label || $edgeLabel || '';
	$: renderLabel = labelText || $$slots.label; // Boolean that determines whether or not to render the label

	$: sourcePosition = $sourcePositionStore;
	$: targetPosition = $targetPositionStore;

	// The coordinates of the source and target anchors
	// If there is no source or target, use the cursor position
	$: sourceX = sourcePosition.x;
	$: sourceY = sourcePosition.y;
	$: targetX = targetPosition.x;
	$: targetY = targetPosition.y;

	// The distances between the points
	$: deltaX = targetX - sourceX;
	$: deltaY = targetY - sourceY;
	$: anchorWidth = Math.abs(deltaX);
	$: anchorHeight = Math.abs(deltaY);

	// Strength of curvature
	$: maxCurveDisplaceX = Math.max(30, Math.min(600, anchorWidth / 2));
	$: maxCurveDisplaceY = Math.max(30, Math.min(600, anchorHeight / 2));

	// Helper XY pair to offset the control points
	$: sourceControlVector = rotateVector(directionVectors[$sourceDirection], $sourceRotation || 0);
	$: targetControlVector = rotateVector(directionVectors[$targetDirection], $targetRotation || 0);

	// Calculating the control points for the bezier curve
	$: sourceControlX = sourceX + sourceControlVector.x * maxCurveDisplaceX;
	$: sourceControlY = sourceY + sourceControlVector.y * maxCurveDisplaceY;
	$: targetControlX = targetX + targetControlVector.x * maxCurveDisplaceX;
	$: targetControlY = targetY + targetControlVector.y * maxCurveDisplaceY;

	// Constructing the control point element of the path string
	$: controlPointString = `C ${sourceControlX}, ${sourceControlY} ${targetControlX}, ${targetControlY}`;

	// The full SVG path string
	$: if (!step || edgeKey === 'cursor' || $edgeType === 'bezier') {
		path = `M ${sourceX}, ${sourceY} ${!straight && controlPointString} ${targetX}, ${targetY}`;
	}

	// We only want to recalculate the path midpoints if the source or target is moving
	// And we only want to recalculate the path midpoints if there is a label
	$: if (renderLabel && !tracking && ($sourceMoving || $targetMoving || edgeKey === 'cursor')) {
		tracking = true;
		trackPath();
	} else if (tracking && !$sourceMoving && !$targetMoving && edgeKey !== 'cursor') {
		tracking = false;
		cancelAnimationFrame(animationFrameId);
	}

	$: if (dynamic && source.node && target.node) {
		const nodeXDelta = $targetNodePosition.x - $sourceNodePosition.x;
		const nodeYDelta = $targetNodePosition.y - $sourceNodePosition.y;
		sourceAbove = nodeYDelta > 0;
		sourceLeft = nodeXDelta > 0;
		let borderDeltaY;
		let borderDeltaX;
		if (sourceAbove) {
			const sourceHeight = get(source.node.dimensions.height);
			const sourceBottom = $sourceNodePosition.y + sourceHeight;
			borderDeltaY = $targetNodePosition.y - sourceBottom;
		} else {
			const targetHeight = get(target.node.dimensions.height);
			const targetBottom = $targetNodePosition.y + targetHeight;
			borderDeltaY = $sourceNodePosition.y - targetBottom;
		}
		if (sourceLeft) {
			const sourceWidth = get(source.node.dimensions.width);
			const sourceRight = $sourceNodePosition.x + sourceWidth;
			borderDeltaX = $targetNodePosition.x - sourceRight;
		} else {
			const targetWidth = get(target.node.dimensions.width);
			const targetRight = $targetNodePosition.x + targetWidth;
			borderDeltaX = $sourceNodePosition.x - targetRight;
		}

		prefersVertical = borderDeltaY > borderDeltaX;
	}

	$: if (dynamic) {
		let newSourceDirection: Direction;
		let newTargetDirection: Direction;
		if (prefersVertical) {
			newSourceDirection = sourceAbove ? 'south' : 'north';
			newTargetDirection = sourceAbove ? 'north' : 'south';
		} else {
			newSourceDirection = sourceLeft ? 'east' : 'west';
			newTargetDirection = sourceLeft ? 'west' : 'east';
		}
		if ($sourceDynamic) $sourceDirection = newSourceDirection;
		if ($targetDynamic) $targetDirection = newTargetDirection;
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
		setTimeout(() => {
			calculatePath();
		}, 0);
	});

	onDestroy(() => {
		cancelAnimationFrame(animationFrameId);
	});

	function destroy() {
		if (source.id === null || target.id === null) return;
		const edgeKey = edgeStore.match(source, target);
		edgeStore.delete(edgeKey[0]);
		source?.connected.update((connected) => {
			if (target) connected.delete(target);
			return connected;
		});
		target?.connected.update((connected) => {
			if (source) connected.delete(source);
			return connected;
		});
	}

	$: if (step && edgeKey !== 'cursor' && !($edgeType && $edgeType === 'bezier')) {
		const sourceObject = {
			x: sourceX,
			y: sourceY,
			direction: directionVectors[$sourceDirection]
		};
		const targetObject = {
			x: targetX,
			y: targetY,
			direction: directionVectors[$targetDirection]
		};

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

				const radiusX = calculateRadius(step.x, nextStep.x, cornerRadius);
				const radiusY = calculateRadius(nextStep.y, step.y, cornerRadius);
				const previousRadiusX = calculateRadius(previousStep.x, step.x, cornerRadius);
				const previousRadiusY = calculateRadius(previousStep.y, step.y, cornerRadius);
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
		}, `M ${sourceX}, ${sourceY}`);
	}

	$: sourceZIndex = source.node.zIndex || 0;
	$: targetZIndex = target.node.zIndex || 0;
	$: maxZIndex = Math.max($sourceZIndex, $targetZIndex);
	const raiseEdgesOnSelect = getContext('raiseEdgesOnSelect');
	const edgesAboveNode = getContext('edgesAboveNode');

	$: zIndex =
		edgesAboveNode === 'all'
			? 100000
			: edgesAboveNode
			? maxZIndex
			: raiseEdgesOnSelect === true
			? maxZIndex - 1
			: raiseEdgesOnSelect === 'source'
			? $sourceZIndex - 1
			: raiseEdgesOnSelect === 'target'
			? $targetZIndex - 1
			: 0;
</script>

<svg class="edges-wrapper" style:z-index={zIndex}>
	<path
		bind:this={DOMPath}
		class:cursor={edgeKey === 'cursor'}
		on:mousedown={edgeClick}
		style:cursor={edgeClick ? 'pointer' : 'move'}
		class="target"
		id={edgeKey + '-target'}
		style:--hover-color={edgeClick ? targetColor || $themeStore.node : 'transparent'}
		d={path}
		style:stroke-width={width + 8 + 'px'}
	/>
	<slot {path} {destroy}>
		<path
			class="edge"
			id={edgeKey}
			class:animate
			d={path}
			style:stroke={finalColor}
			style:stroke-width={width + 'px'}
		/>
	</slot>

	{#if renderLabel}
		<foreignObject x={pathMidPointX} y={pathMidPointY} width="100%" height="100%">
			<span class="label-wrapper">
				<slot name="label">
					<div
						class="default-label"
						style:background-color={labelColor || $themeStore.node}
						style:color={textColor || $themeStore.text}
					>
						{labelText}
					</div>
				</slot>
			</span>
		</foreignObject>
	{/if}
</svg>

<style>
	.label-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: fit-content;
		height: fit-content;
		transform: translate(-50%, -50%);
		pointer-events: auto;
	}
	.edges-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		fill: transparent;
		overflow: visible;
	}

	.target {
		pointer-events: stroke;
		stroke: none;
	}

	.target:hover {
		stroke: var(--hover-color);
		opacity: 50%;
	}

	.cursor {
		pointer-events: none;
	}

	foreignObject {
		overflow: visible;
	}
	path {
		cursor: pointer;
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
		width: fit-content;
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
