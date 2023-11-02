<script context="module" lang="ts">
	import { calculateStepPath, calculateRadius, calculatePath } from '$lib/utils/calculators';
	import { onMount, onDestroy, getContext, afterUpdate } from 'svelte';
	import { directionVectors, stepBuffer } from '$lib/constants';
	import { buildPath, rotateVector } from '$lib/utils/helpers';
	import { buildArcStringKey, constructArcString } from '$lib/utils/helpers';
	import { get } from 'svelte/store';
	import type { CSSColorString, Direction, EdgeStyle, EndStyle, Graph } from '$lib/types';
	import type { WritableEdge } from '$lib/types';

	let animationFrameId: number;

	function moveEdge(edgeElement: SVGElement) {
		const parentNode = edgeElement.parentNode;
		if (!parentNode) return;
		// Remove the anchor from its current container
		parentNode.removeChild(edgeElement);

		// Add the anchor to the new container
		const newContainer = document.querySelector(`.svelvet-graph-wrapper`);
		if (!newContainer) return;
		newContainer.appendChild(edgeElement);
	}
</script>

<script lang="ts">
	const edgeStore = getContext<Graph['edges']>('edgeStore');
	const edgeStyle = getContext<EdgeStyle>('edgeStyle');
	const endStyles = getContext<Array<EndStyle>>('endStyles');
	const raiseEdgesOnSelect = getContext('raiseEdgesOnSelect');
	const edgesAboveNode = getContext('edgesAboveNode');

	// Props
	export let edge: WritableEdge = getContext<WritableEdge>('edge');
	export let straight = edgeStyle === 'straight';
	export let step = edgeStyle === 'step';
	export let start = endStyles[0];
	export let end = endStyles[1];
	export let animate = false;
	export let label = '';
	export let enableHover = false;
	export let edgeClick: null | (() => void) = null;
	/**
	 * @default 0.5
	 * @type number
	 * @description The position of the label along the edge. 0 is the source, 1 is the target.
	 */
	export let labelPosition = 0.5;

	// Styling via props/objects will likely be deprecated
	export let width: number | null = null;
	export let color: CSSColorString | null = null;
	export let labelColor: CSSColorString | null = null;
	export let textColor: CSSColorString | null = null;
	export let cornerRadius = 8;
	export let targetColor: CSSColorString | null = null;

	// External stores
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
	const sourceNodePositionStore = source.node?.position;
	const targetNodePositionStore = target.node?.position;
	const edgeType = edge.type;
	const edgeKey = edge.id;

	// Reactive variables
	let path: string;
	let DOMPath: SVGPathElement; // The SVG path element used for calculating the midpoint of the curve for labels
	let labelPoint = { x: 0, y: 0 };
	let tracking = false; // Boolean that stops/starts tracking the path midpoint
	let prefersVertical = false;
	let sourceAbove = false;
	let sourceLeft = false;
	let hovering = false;
	let edgeElement: SVGElement;

	// Reactive declarations
	$: dynamic = $sourceDynamic || $targetDynamic;
	$: edgeColor = source?.edgeColor || target?.edgeColor || null;
	$: edgeLabel = edge.label?.text;
	$: finalColor = color || $edgeColor || null;
	$: labelText = label || $edgeLabel || '';
	$: renderLabel = labelText || $$slots.label; // Boolean that determines whether or not to render the label

	// Subscriptions
	$: sourcePosition = $sourcePositionStore;
	$: targetPosition = $targetPositionStore;
	$: sourceNodePosition = $sourceNodePositionStore;
	$: targetNodePosition = $targetNodePositionStore;

	//Reactive declarations
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
		const nodeXDelta = targetNodePosition.x - sourceNodePosition.x;
		const nodeYDelta = targetNodePosition.y - sourceNodePosition.y;
		sourceAbove = nodeYDelta > 0;
		sourceLeft = nodeXDelta > 0;
		let borderDeltaY;
		let borderDeltaX;
		if (sourceAbove) {
			const sourceHeight = get(source.node.dimensions.height);
			const sourceBottom = sourceNodePosition.y + sourceHeight;
			borderDeltaY = targetNodePosition.y - sourceBottom;
		} else {
			const targetHeight = get(target.node.dimensions.height);
			const targetBottom = targetNodePosition.y + targetHeight;
			borderDeltaY = sourceNodePosition.y - targetBottom;
		}
		if (sourceLeft) {
			const sourceWidth = get(source.node.dimensions.width);
			const sourceRight = sourceNodePosition.x + sourceWidth;
			borderDeltaX = targetNodePosition.x - sourceRight;
		} else {
			const targetWidth = get(target.node.dimensions.width);
			const targetRight = targetNodePosition.x + targetWidth;
			borderDeltaX = sourceNodePosition.x - targetRight;
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
	edge.rendered.set(true);
	// Lifecycle methods
	onMount(() => {
		setTimeout(() => {
			if (DOMPath) {
				labelPoint = calculatePath(DOMPath, labelPosition);
			}
		}, 0);
		moveEdge(edgeElement);
	});

	afterUpdate(() => {
		if (DOMPath) {
			labelPoint = calculatePath(DOMPath, labelPosition);
		}
	});

	onDestroy(() => {
		edgeElement.remove();
		cancelAnimationFrame(animationFrameId);
	});

	// Track the path in sync with browser animation frames
	function trackPath() {
		if (!tracking) return;
		if (DOMPath) {
			labelPoint = calculatePath(DOMPath, labelPosition);
		}
		animationFrameId = requestAnimationFrame(trackPath);
	}

	export function destroy() {
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

{#if source && target}
	<svg class="edges-wrapper" style:z-index={zIndex} bind:this={edgeElement}>
		<!-- store arrows in defs -->
		<defs>
			<marker
				id="end-arrow"
				viewBox="0 0 15 15"
				markerWidth="15"
				markerHeight="10"
				refX="12.5"
				refY="5"
				orient="auto"
			>
				<polygon class="arrow" points="0 0, 15 5, 0 10" style:--prop-edge-color={finalColor} />
			</marker>
		</defs>
		<path
			role="presentation"
			id={edgeKey + '-target'}
			class="target"
			class:cursor={edgeKey === 'cursor' || (!edgeClick && !enableHover)}
			style:cursor={edgeClick || hovering ? 'pointer' : 'move'}
			style:--prop-target-edge-color={edgeClick || hovering ? targetColor || null : 'transparent'}
			d={path}
			on:mousedown={edgeClick}
			on:mouseenter={() => (hovering = true)}
			on:mouseleave={() => (hovering = false)}
			bind:this={DOMPath}
		/>
		<slot {path} {destroy} {hovering}>
			<!-- add marker-end -->
			<path
				id={edgeKey}
				class="edge"
				class:animate
				d={path}
				marker-end={end === 'arrow' ? 'url(#end-arrow)' : ''}
				marker-start={start === 'arrow' ? 'url(#end-arrow)' : ''}
				style:--prop-edge-color={finalColor}
				style:--prop-stroke-width={width ? width + 'px' : null}
			/>
		</slot>

		{#if renderLabel}
			<foreignObject x={labelPoint.x} y={labelPoint.y} width="100%" height="100%">
				<span class="label-wrapper">
					<slot name="label">
						<div
							class="default-label"
							style:--prop-label-color={labelColor}
							style:--prop-label-text-color={textColor}
						>
							{labelText}
						</div>
					</slot>
				</span>
			</foreignObject>
		{/if}
	</svg>
{/if}

<style>
	.arrow {
		fill: var(--prop-edge-color, var(--edge-color, var(--default-edge-color)));
	}

	.edge {
		stroke: var(--prop-edge-color, var(--edge-color, var(--default-edge-color)));
		stroke-width: var(--prop-stroke-width, var(--edge-width, var(--default-edge-width)));
		contain: strict;
	}
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
		stroke-width: calc(var(--edge-width, var(--default-edge-width)) + 8px);
	}

	.target:hover {
		stroke: var(
			--prop-target-edge-color,
			var(--target-edge-color, var(--default-target-edge-color))
		);
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
		color: var(--prop-label-text-color, var(--label-text-color, var(--default-label-text-color)));
		background-color: var(--prop-label-color, var(--label-color, var(--default-label-color)));
	}

	@keyframes dash {
		from {
			stroke-dashoffset: 30;
		}
	}
</style>
