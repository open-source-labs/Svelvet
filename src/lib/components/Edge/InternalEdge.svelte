<script lang="ts">
	import type { Direction, Graph, XYPair, Theme, WritableEdge } from '$lib/types';
	import { getContext } from 'svelte';
	import { readable, writable } from 'svelte/store';
	import { EDGE_WIDTH } from '$lib/constants';
	import { THEMES } from '$lib/constants/themes';

	const graph = getContext<Graph>('graph');
	const theme = getContext<Theme>('theme');

	const { cursor } = graph;

	export let strokeWidth = EDGE_WIDTH;
	export let strokeColor = THEMES[theme].edge;
	export let straight = false;
	export let step = false;
	export let animate = false;

	export let edge: WritableEdge;

	$: edgeKey = edge.id;
	$: label = edge.label;
	$: source = edge.source;
	$: target = edge.target;
	$: Component = edge.component;

	const buffer = 200;
	let active = false;

	const directionVectors: Record<Direction, XYPair> = {
		north: { x: 0, y: -1 },
		south: { x: 0, y: 1 },
		east: { x: 1, y: 0 },
		west: { x: -1, y: 0 },
		self: { x: 0, y: 0 }
	};

	$: sourceDirection = source?.direction || writable('self' as Direction);
	$: targetDirection = target?.direction || writable('self' as Direction);

	$: sourceControlVector = directionVectors[$sourceDirection];
	$: targetControlVector = directionVectors[$targetDirection];

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

	let path: string;

	$: if (!step) {
		path = `M ${sourcePointX.toPrecision(6)}, ${sourcePointY.toPrecision(6)}
	${
		!straight
			? `C ${sourceControlX}, ${sourceControlY}
	${targetControlX}, ${targetControlY}`
			: ''
	}
	${targetPointX.toPrecision(6)}, ${targetPointY.toPrecision(6)}`;
	}

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

	let cornerRadiusX = 0;
	let cornerRadiusY = 0;

	let cornerRadiusConstant = 8;
	let stepBuffer = 20;
	type StepDirection = 'left' | 'right' | 'up' | 'down';
	type ArcStringKey =
		| 'leftup'
		| 'leftdown'
		| 'rightup'
		| 'rightdown'
		| 'upleft'
		| 'upright'
		| 'downleft'
		| 'downright';

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

		const { steps, distance } = calculateStepPath();

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
		}, `M ${sourcePointX}, ${sourcePointY}`);
	}
	type XorY = 'x' | 'y';

	function calculateStepPath(): { steps: StepDirection[]; distance: number[] } {
		const steps: StepDirection[] = [];
		const distance = [];
		const directionMap: Record<Direction, StepDirection> = {
			north: 'up',
			south: 'down',
			east: 'right',
			west: 'left',
			self: 'right'
		};

		const sourceSide: StepDirection = directionMap[$sourceDirection];
		const targetSide: StepDirection = directionMap[$targetDirection];
		const axis = ['left', 'right'].includes(sourceSide) ? 'x' : 'y';
		const oppositeAxis = axis === 'x' ? 'y' : 'x';

		const oppositeSide = (side: StepDirection): StepDirection =>
			({ left: 'right', right: 'left', up: 'down', down: 'up' }[side] as StepDirection);
		const getSign = (side: StepDirection) => (['left', 'up'].includes(side) ? -1 : 1);

		const oppositeSourceSide = oppositeSide(sourceSide);
		const oppositeTargetSide = oppositeSide(targetSide);
		const targetAxis = ['left', 'right'].includes(targetSide) ? 'x' : 'y';
		const targetSign = getSign(targetSide);
		const sourceSign = getSign(sourceSide);
		const direction = { x: deltaX, y: deltaY };

		const parallel = axis === targetAxis;

		const oppositeSource = direction[axis] * sourceSign < 0;
		const oppositeTarget = direction[targetAxis] * targetSign > 0;

		const initialDirection =
			axis === 'x' ? (deltaY > 0 ? 'down' : 'up') : deltaX > 0 ? 'right' : 'left';

		steps.push(sourceSide);
		if (!oppositeTarget) {
			distance.push(oppositeSource ? stepBuffer : Math.abs(direction[axis]) / (parallel ? 2 : 1));
			steps.push(initialDirection);
			distance.push(
				Math.abs(direction[oppositeAxis]) / (parallel ? 1 : oppositeSource ? 2 : 1) +
					stepBuffer * (parallel ? 0 : 1)
			);

			if (parallel) {
				steps.push(sourceSide);
				distance.push(Math.abs(direction[axis]) / 2);
			} else if (oppositeSource) {
				steps.push(oppositeSourceSide);
				distance.push(Math.abs(direction[axis]) + stepBuffer);
				steps.push(oppositeTargetSide);
				distance.push(Math.abs(direction[oppositeAxis]) / 2);
			}
		} else {
			distance.push(
				parallel ? stepBuffer : oppositeSource ? stepBuffer : Math.abs(direction[axis]) / 2
			);
			steps.push(initialDirection);
			distance.push(
				Math.abs(direction[oppositeAxis]) / (parallel ? 2 : 1) + (parallel ? 0 : stepBuffer)
			);

			steps.push(oppositeSource ? oppositeSourceSide : sourceSide);
			distance.push(
				Math.abs(direction[axis]) / (oppositeSource ? 1 : 2) +
					stepBuffer * (oppositeSource && parallel ? 2 : oppositeSource ? 1 : 0)
			);

			if (parallel) {
				steps.push(initialDirection);
				distance.push(Math.abs(direction[oppositeAxis]) / 2);
				steps.push(sourceSide);
				distance.push(stepBuffer);
			} else {
				steps.push(oppositeTargetSide);
				distance.push(stepBuffer);
			}
		}

		return { steps, distance };
	}
</script>

{#if source || target}
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
			/>
			{#if Component}
				<Component {path} />
			{/if}
		</svg>

		<div
			role="note"
			style:top={pathMidPointY + 'px'}
			style:left={pathMidPointX + 'px'}
			class="edge-label"
		>
			{#if Component}
				<Component name="label" />
			{:else if label}
				<div class="default-label">{label}</div>
			{/if}
		</div>
	</div>
{/if}

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
		fill: transparent;
	}

	.active:hover {
		stroke: red;
	}

	.animate {
		stroke-dasharray: 5;
		animation: dash 1s linear infinite;
		will-change: stroke-dashoffset;
	}

	.edge-label {
		position: absolute;
		width: fit-content;
		z-index: -3;
		cursor: pointer !important;
		transform: translate(-50%, -50%);
		pointer-events: auto;
	}
	.default-label {
		background: white;
		display: flex;
		justify-content: center;
		align-items: center;
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
