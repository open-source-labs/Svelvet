<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
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

	$props = {
		edge: getContext<WritableEdge>('edge'),
		straight: edgeStyle === 'straight',
		step: edgeStyle === 'step',
		start: endStyles[0],
		end: endStyles[1],
		animate: false,
		label: '',
		enableHover: false,
		edgeClick: null,
		labelPosition: 0.5,
		width: null,
		color: null,
		labelColor: null,
		textColor: null,
		cornerRadius: 8,
		targetColor: null
	};

	$state = {
		path: '',
		DOMPath: null,
		labelPoint: { x: 0, y: 0 },
		tracking: false,
		prefersVertical: false,
		sourceAbove: false,
		sourceLeft: false,
		hovering: false,
		edgeElement: null,
		sourcePosition: null,
		targetPosition: null,
		sourceNodePosition: null,
		targetNodePosition: null,
		sourceX: 0,
		sourceY: 0,
		targetX: 0,
		targetY: 0,
		deltaX: 0,
		deltaY: 0,
		anchorWidth: 0,
		anchorHeight: 0,
		maxCurveDisplaceX: 0,
		maxCurveDisplaceY: 0,
		sourceControlVector: null,
		targetControlVector: null,
		sourceControlX: 0,
		sourceControlY: 0,
		targetControlX: 0,
		targetControlY: 0,
		controlPointString: '',
		sourceZIndex: 0,
		targetZIndex: 0,
		maxZIndex: 0,
		zIndex: 0
	};

	$derived dynamic = $sourceDynamic || $targetDynamic;
	$derived edgeColor = source?.edgeColor || target?.edgeColor || null;
	$derived edgeLabel = edge.label?.text;
	$derived finalColor = color || $edgeColor || null;
	$derived labelText = label || $edgeLabel || '';
	$derived renderLabel = labelText || $$snippets.label;

	$derived sourcePosition = $sourcePositionStore;
	$derived targetPosition = $targetPositionStore;
	$derived sourceNodePosition = $sourceNodePositionStore;
	$derived targetNodePosition = $targetNodePositionStore;

	$derived sourceX = sourcePosition.x;
	$derived sourceY = sourcePosition.y;
	$derived targetX = targetPosition.x;
	$derived targetY = targetPosition.y;

	$derived deltaX = targetX - sourceX;
	$derived deltaY = targetY - sourceY;
	$derived anchorWidth = Math.abs(deltaX);
	$derived anchorHeight = Math.abs(deltaY);

	$derived maxCurveDisplaceX = Math.max(30, Math.min(600, anchorWidth / 2));
	$derived maxCurveDisplaceY = Math.max(30, Math.min(600, anchorHeight / 2));

	$derived sourceControlVector = rotateVector(directionVectors[$sourceDirection], $sourceRotation || 0);
	$derived targetControlVector = rotateVector(directionVectors[$targetDirection], $targetRotation || 0);

	$derived sourceControlX = sourceX + sourceControlVector.x * maxCurveDisplaceX;
	$derived sourceControlY = sourceY + sourceControlVector.y * maxCurveDisplaceY;
	$derived targetControlX = targetX + targetControlVector.x * maxCurveDisplaceX;
	$derived targetControlY = targetY + targetControlVector.y * maxCurveDisplaceY;

	$derived controlPointString = `C ${sourceControlX}, ${sourceControlY} ${targetControlX}, ${targetControlY}`;

	$effect(() => {
		if (!step || edgeKey === 'cursor' || $edgeType === 'bezier') {
			$state.path = `M ${sourceX}, ${sourceY} ${!straight ? controlPointString : ''} ${targetX}, ${targetY}`;
		}
	});

	$effect(() => {
		if (renderLabel && !$state.tracking && ($sourceMoving || $targetMoving || edgeKey === 'cursor')) {
			$state.tracking = true;
			trackPath();
		} else if ($state.tracking && !$sourceMoving && !$targetMoving && edgeKey !== 'cursor') {
			$state.tracking = false;
			cancelAnimationFrame(animationFrameId);
		}
	});

	$effect(() => {
		if (dynamic && source.node && target.node) {
			const nodeXDelta = targetNodePosition.x - sourceNodePosition.x;
			const nodeYDelta = targetNodePosition.y - sourceNodePosition.y;
			$state.sourceAbove = nodeYDelta > 0;
			$state.sourceLeft = nodeXDelta > 0;
			let borderDeltaY;
			let borderDeltaX;
			if ($state.sourceAbove) {
				const sourceHeight = get(source.node.dimensions.height);
				const sourceBottom = sourceNodePosition.y + sourceHeight;
				borderDeltaY = targetNodePosition.y - sourceBottom;
			} else {
				const targetHeight = get(target.node.dimensions.height);
				const targetBottom = targetNodePosition.y + targetHeight;
				borderDeltaY = sourceNodePosition.y - targetBottom;
			}
			if ($state.sourceLeft) {
				const sourceWidth = get(source.node.dimensions.width);
				const sourceRight = sourceNodePosition.x + sourceWidth;
				borderDeltaX = targetNodePosition.x - sourceRight;
			} else {
				const targetWidth = get(target.node.dimensions.width);
				const targetRight = targetNodePosition.x + targetWidth;
				borderDeltaX = sourceNodePosition.x - targetRight;
			}

			$state.prefersVertical = borderDeltaY > borderDeltaX;
		}
	});

	$effect(() => {
		if (dynamic) {
			let newSourceDirection: Direction;
			let newTargetDirection: Direction;
			if ($state.prefersVertical) {
				newSourceDirection = $state.sourceAbove ? 'south' : 'north';
				newTargetDirection = $state.sourceAbove ? 'north' : 'south';
			} else {
				newSourceDirection = $state.sourceLeft ? 'east' : 'west';
				newTargetDirection = $state.sourceLeft ? 'west' : 'east';
			}
			if ($sourceDynamic) $sourceDirection = newSourceDirection;
			if ($targetDynamic) $targetDirection = newTargetDirection;
		}
	});

	edge.rendered.set(true);

	onMount(() => {
		setTimeout(() => {
			if ($state.DOMPath) {
				$state.labelPoint = calculatePath($state.DOMPath, labelPosition);
			}
		}, 0);
		moveEdge($state.edgeElement);
	});

	afterUpdate(() => {
		if ($state.DOMPath) {
			$state.labelPoint = calculatePath($state.DOMPath, labelPosition);
		}
	});

	onDestroy(() => {
		$state.edgeElement.remove();
		cancelAnimationFrame(animationFrameId);
	});

	function trackPath() {
		if (!$state.tracking) return;
		if ($state.DOMPath) {
			$state.labelPoint = calculatePath($state.DOMPath, labelPosition);
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

	$effect(() => {
		if (step && edgeKey !== 'cursor' && !($edgeType && $edgeType === 'bezier')) {
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

			$state.path = steps.reduce((string, step, index) => {
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
	});

	$derived sourceZIndex = source.node.zIndex || 0;
	$derived targetZIndex = target.node.zIndex || 0;
	$derived maxZIndex = Math.max($sourceZIndex, $targetZIndex);

	$derived zIndex =
		edgesAboveNode === 'all'
			? 100000
			: edgesAboveNode
			? $state.maxZIndex
			: raiseEdgesOnSelect === true
			? $state.maxZIndex - 1
			: raiseEdgesOnSelect === 'source'
			? $sourceZIndex - 1
			: raiseEdgesOnSelect === 'target'
			? $targetZIndex - 1
			: 0;

	// Add checks for edge cases when moving edges
	$effect(() => {
		if (sourceX === targetX && sourceY === targetY) {
			$state.path = '';
		}
		if (sourceX < 0 || sourceY < 0 || targetX < 0 || targetY < 0) {
			$state.path = '';
		}
		if (sourceX > window.innerWidth || sourceY > window.innerHeight || targetX > window.innerWidth || targetY > window.innerHeight) {
			$state.path = '';
		}
	});
</script>

{#if source && target}
	<svg class="edges-wrapper" style:z-index={$state.zIndex} bind:this={$state.edgeElement}>
		{#if start || end}
			<defs>
				<marker
					id={edgeKey + '-end-arrow'}
					viewBox="0 0 15 15"
					markerWidth="15"
					markerHeight="10"
					refX="12.5"
					refY="5"
					orient="auto"
				>
					<polygon class="arrow" points="0 0, 15 5, 0 10" style:--prop-edge-color={$state.finalColor} />
				</marker>
				<marker
					id={edgeKey + '-start-arrow'}
					viewBox="0 0 15 15"
					markerWidth="15"
					markerHeight="10"
					refX="0"
					refY="5"
					orient="auto"
				>
					<polygon class="arrow" points="0 5, 15 0, 15 10" style:--prop-edge-color={$state.finalColor} />
				</marker>
			</defs>
		{/if}
		<path
			role="presentation"
			id={edgeKey + '-target'}
			class="target"
			class:cursor={edgeKey === 'cursor' || (!edgeClick && !enableHover)}
			style:cursor={edgeClick || $state.hovering ? 'pointer' : 'move'}
			style:--prop-target-edge-color={edgeClick || $state.hovering ? targetColor || null : 'transparent'}
			d={$state.path}
			onmousedown={edgeClick}
			onmouseenter={() => ($state.hovering = true)}
			onmouseleave={() => ($state.hovering = false)}
			bind:this={$state.DOMPath}
		/>
			{@render linked={$connectedAnchors?.size >= 1} {hovering} {connecting}}
			<path
				id={edgeKey}
				class="edge"
				class:animate
				d={$state.path}
				style:--prop-edge-color={$state.finalColor}
				marker-end={end === 'arrow' ? `url(#${edgeKey + '-end-arrow'})` : ''}
				marker-start={start === 'arrow' ? `url(#${edgeKey + '-start-arrow'})` : ''}
				style:--prop-stroke-width={width ? width + 'px' : null}
			/>
		{@/render}

		{#if renderLabel}
			<foreignObject x={$state.labelPoint.x} y={$state.labelPoint.y} width="100%" height="100%">
				<span class="label-wrapper">
						{@render name="label"}
						<div
							class="default-label"
							style:--prop-label-color={labelColor}
							style:--prop-label-text-color={textColor}
						>
							{labelText}
						</div>
					{@/render}
				</span>
			</foreignObject>
		{/if}
	</svg>
{/if}

<style>
	.arrow {
		fill: var(--prop-edge-color, var(--edge-color, var(--default-edge-color))) !important;
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
