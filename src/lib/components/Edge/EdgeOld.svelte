<script lang="ts">
	import type { InputKey, DummyNode, Node, OutputKey, WritableEdge, XYPosition } from '$lib/types';
	import EdgeLabel from '../EdgeLabel/EdgeLabel.svelte';
	import { EDGE_WIDTH, EDGE_COLOR } from '$lib/constants';
	import { get } from 'svelte/store';

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

	export let sourceNode: Node;
	export let targetNode: Node | DummyNode;
	export let sourceAnchor: OutputKey;
	export let targetAnchor: InputKey = 'I-cursor/N-?';
	export let curve = true;
	export let active = false;
	export let cursor = false;
	export let label: string | null = null;
	export let cursorStore: XYPosition;
	export let animate = false;
	export let dynamic = false;
	export let step = false;

	let curveStrength = 0.4;
	let buffer = 60;
	let cornerRadiusConstant = 8;
	let strokeWidth = 3;
	let path: string;

	$: source = sourceNode.anchors.get(sourceAnchor);
	// $: target = targettargetNode.anchors.get(targetAnchor);
	$: sourcePosition = source.position;
	$: x = sourcePosition.x;
	$: y = sourcePosition.y;

	let anchorRadius = -2;

	$: sourceAnchorPercentageX = $x / $sourceWidth;
	$: sourceAnchorPercentageY = $y / $sourceHeight;

	const { dimensions, position } = sourceNode;
	const { width: sourceWidth, height: sourceHeight } = dimensions;
	const { x: sourceNodeX, y: sourceNodeY } = position;

	const { dimensions: targetDimensions, position: targetPosition } = targetNode;
	const { width: targetWidth, height: targetHeight } = targetDimensions;
	const { x: targetNodeX, y: targetNodeY } = targetPosition;

	// let sourceAnchorPercentageX = 1;
	// let sourceAnchorPercentageY = initSourceAnchorOffsetY / ($sourceHeight + 2 * anchorRadius);

	// let targetAnchorPercentageX = initTargetAnchorOffsetX / ($targetWidth + anchorRadius);
	// let targetAnchorPercentageY = initTargetAnchorOffsetY / ($targetHeight + anchorRadius);

	// let sourceAnchorPercentageX = 0.5;
	// let sourceAnchorPercentageY = 0;

	let targetAnchorPercentageX = 0.5;
	let targetAnchorPercentageY = 1;

	let offsetY = 0;
	let offsetX = 0;

	$: preferHorizontal = horizontalGap > verticalGap;

	$: if (dynamic) {
		sourceAnchorPercentageX = preferHorizontal ? (sourceRight < $targetNodeX ? 1 : 0) : 0.5;
		sourceAnchorPercentageY = preferHorizontal ? 0.5 : sourceBottom < $targetNodeY ? 1 : 0;
		targetAnchorPercentageX = preferHorizontal ? (sourceRight < $targetNodeX ? 0 : 1) : 0.5;
		targetAnchorPercentageY = preferHorizontal ? 0.5 : sourceBottom < $targetNodeY ? 0 : 1;
	}

	$: horizontalGap = Math.max($targetNodeX - sourceRight, 0, $sourceNodeX - targetRight);
	$: verticalGap = Math.max($targetNodeY - sourceBottom, 0, $sourceNodeY - targetBottom);

	// Pixel value of the anchor point on the source node
	$: sourceAnchorOffsetX = $sourceWidth * sourceAnchorPercentageX;
	$: sourceAnchorOffsetY = $sourceHeight * sourceAnchorPercentageY;
	let sourceAnchorOffsetNoResizeX = $sourceWidth * sourceAnchorPercentageX;
	let sourceAnchorOffsetNoResizeY = $sourceHeight * sourceAnchorPercentageY;
	let targetAnchorOffsetNoResizeX = $targetWidth * targetAnchorPercentageX;
	let targetAnchorOffsetNoResizeY = $targetHeight * targetAnchorPercentageY;

	// Pixel value of the anchor point on the target node
	$: targetAnchorOffsetX = $targetWidth * targetAnchorPercentageX;
	$: targetAnchorOffsetY = $targetHeight * targetAnchorPercentageY;

	$: sourceRight = $sourceNodeX + $sourceWidth;
	$: sourceBottom = $sourceNodeY + $sourceHeight;
	$: targetRight = $targetNodeX + $targetWidth;
	$: targetBottom = $targetNodeY + $targetHeight;

	$: deltaX = $targetNodeX - $sourceNodeX;
	$: deltaY = $targetNodeY - $sourceNodeY;

	$: minX = Math.min($sourceNodeX, $targetNodeX);
	$: minY = Math.min($sourceNodeY, $targetNodeY);
	$: maxX = Math.max(sourceRight, targetRight);
	$: maxY = Math.max(sourceBottom, targetBottom);

	$: minWidth = Math.min($sourceWidth, $targetWidth);

	$: boxHeight = maxY - minY + 2 * buffer;
	$: boxWidth = maxX - minX + 2 * buffer;

	$: sourceAnchorPosX =
		buffer +
		(dynamic || sourceAnchorPercentageX === 1 ? sourceAnchorOffsetX : sourceAnchorOffsetNoResizeX) +
		Math.max(-deltaX, 0);
	$: sourceAnchorPosY =
		buffer +
		(dynamic || sourceAnchorPercentageY === 1 ? sourceAnchorOffsetY : sourceAnchorOffsetNoResizeY) +
		Math.max(-deltaY, 0);

	$: targetAnchorPosX =
		buffer +
		(dynamic || targetAnchorPercentageX === 1 ? targetAnchorOffsetX : targetAnchorOffsetNoResizeX) +
		Math.max(deltaX, 0);
	$: targetAnchorPosY =
		buffer +
		(dynamic || targetAnchorPercentageY === 1 ? targetAnchorOffsetY : targetAnchorOffsetNoResizeY) +
		Math.max(deltaY, 0);

	let sourceControlPointX: number = 0;
	let sourceControlPointY: number = 0;
	let targetControlPointX: number = 0;
	let targetControlPointY: number = 0;

	$: sourceControlPointX =
		sourceAnchorPercentageX === 1
			? sourceAnchorPosX + offsetX
			: sourceAnchorPercentageX === 0
			? sourceAnchorPosX - offsetX
			: sourceAnchorPosX;

	$: sourceControlPointY =
		sourceAnchorPercentageY === 1
			? sourceAnchorPosY + offsetY
			: sourceAnchorPercentageY === 0
			? sourceAnchorPosY - offsetY
			: sourceAnchorPosY;

	$: targetControlPointX = cursor
		? targetAnchorPosX
		: targetAnchorPercentageX === 1
		? targetAnchorPosX + offsetX
		: targetAnchorPercentageX === 0
		? targetAnchorPosX - offsetX
		: targetAnchorPosX;

	$: targetControlPointY = cursor
		? targetAnchorPosY
		: targetAnchorPercentageY === 1
		? targetAnchorPosY + offsetY
		: targetAnchorPercentageY === 0
		? targetAnchorPosY - offsetY
		: targetAnchorPosY;

	$: anchorDeltaX = targetAnchorPosX - sourceAnchorPosX;
	$: anchorDeltaY = targetAnchorPosY - sourceAnchorPosY;

	$: {
		const curveStrengthY = Math.max(10, Math.abs(verticalGap) * curveStrength);

		offsetY = Math.min(
			150,
			Math.abs(anchorDeltaX) > minWidth / 2 || Math.abs(anchorDeltaY) > 0
				? Math.min(150, Math.abs(Math.max(0, growth(verticalGap, 30)))) + curveStrengthY
				: curveStrengthY
		);
	}

	$: {
		const curveStrengthX = Math.max(10, Math.abs(horizontalGap) * curveStrength);

		offsetX = Math.min(
			150,
			Math.abs(anchorDeltaY) > minWidth / 2 || Math.abs(anchorDeltaX) > 0
				? Math.min(150, Math.abs(Math.max(0, growth(horizontalGap, 30)))) + curveStrengthX
				: curveStrengthX
		);
	}

	function growth(x: number, threshold: number) {
		if (x < threshold) {
			return (threshold - x) * 0.6;
		} else {
			return 0;
		}
	}
	$: console.log($cursorStore.x);

	$: path = `M ${$x + $sourceNodeX}, ${$y + $sourceNodeY}
	C ${0}, ${0}
	${0}, ${0}
	${$cursorStore.x}, ${$cursorStore.y}`;

	let straight = false;
	$: if (straight) {
		path = `M ${sourceAnchorPosX}, ${sourceAnchorPosY} L ${targetAnchorPosX}, ${targetAnchorPosY}`;
	}

	let cornerRadiusX = 0;
	let cornerRadiusY = 0;
	let cornerRadiusString = '0 0';
	let cornerRadiusFlipped = '0 0';
	let rightDownArc = '0 0 0 0 0 0';
	let downRightArc = '0 0 0 0 0 0';
	let rightUpArc = '0 0 0 0 0 0';
	let upRightArc = '0 0 0 0 0 0';
	let leftDownArc = '0 0 0 0 0 0';
	let downLeftArc = '0 0 0 0 0 0';
	let leftUpArc = '0 0 0 0 0 0';
	let upLeftArc = '0 0 0 0 0 0';

	$: stepFlip = targetAnchorPosX < sourceAnchorPosX;
	let lineGap = 20;
	$: if (step) {
		cornerRadiusX =
			Math.abs(anchorDeltaX) > cornerRadiusConstant * 2
				? cornerRadiusConstant
				: Math.floor(Math.abs(anchorDeltaX) / 2 + 1);
		cornerRadiusY =
			Math.abs(anchorDeltaY) > cornerRadiusConstant * 2
				? cornerRadiusConstant
				: Math.floor(Math.abs(anchorDeltaY) / 2 + 1);
		cornerRadiusString = `${cornerRadiusX} ${cornerRadiusY}`;
		cornerRadiusFlipped = `${cornerRadiusX} -${cornerRadiusY}`;

		rightDownArc = `a ${cornerRadiusString} 0 0 1 ${cornerRadiusString} `;
		downRightArc = `a ${cornerRadiusString} 0 0 0 ${cornerRadiusString} `;
		rightUpArc = `a ${cornerRadiusString} 0 0 0 ${cornerRadiusFlipped} `;
		upRightArc = `a ${cornerRadiusString} 0 0 1 ${cornerRadiusFlipped} `;
		leftDownArc = `a ${cornerRadiusFlipped} 0 0 0 -${cornerRadiusString} `;
		downLeftArc = `a ${cornerRadiusFlipped} 0 0 1 -${cornerRadiusString} `;
		leftUpArc = `a ${cornerRadiusFlipped} 0 0 1 -${cornerRadiusFlipped} `;
		upLeftArc = `a ${cornerRadiusFlipped} 0 0 0 -${cornerRadiusFlipped} `;

		const arcStrings = {
			rightdown: rightDownArc,
			downright: downRightArc,
			rightup: rightUpArc,
			upright: upRightArc,
			leftdown: leftDownArc,
			downleft: downLeftArc,
			leftup: leftUpArc,
			upleft: upLeftArc
		};

		function buildArcStringKey(a: StepDirection, b: StepDirection): ArcStringKey {
			return `${a}${b}` as ArcStringKey;
		}

		const { steps, distance } = calculatePath();

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
		}, `M ${sourceAnchorPosX}, ${sourceAnchorPosY}`);
	}
	type XorY = 'x' | 'y';

	function calculatePath(): { steps: StepDirection[]; distance: number[] } {
		const steps: StepDirection[] = [];
		const distance = [];
		let sourceSide: StepDirection =
			sourceAnchorPercentageX === 1
				? 'right'
				: sourceAnchorPercentageX === 0
				? 'left'
				: sourceAnchorPercentageY === 1
				? 'down'
				: 'up';

		let axis: XorY = sourceSide === 'left' || sourceSide === 'right' ? 'x' : 'y';
		let oppositeAxis: XorY = axis === 'x' ? 'y' : 'x';

		let oppositeSourceSide: StepDirection =
			sourceSide === 'left'
				? 'right'
				: sourceSide === 'right'
				? 'left'
				: sourceSide === 'up'
				? 'down'
				: 'up';

		let oppositeTargetSide: StepDirection =
			oppositeSourceSide === 'left'
				? 'right'
				: oppositeSourceSide === 'right'
				? 'left'
				: oppositeSourceSide === 'up'
				? 'down'
				: 'up';
		let targetSide: StepDirection =
			targetAnchorPercentageX === 1
				? 'right'
				: targetAnchorPercentageX === 0
				? 'left'
				: targetAnchorPercentageY === 1
				? 'down'
				: 'up';

		let sourceTargetFacing = targetSide === oppositeSourceSide;
		let oppositeInitialDirection: StepDirection =
			sourceSide === 'left' || sourceSide === 'right'
				? anchorDeltaY > 0
					? 'down'
					: 'up'
				: anchorDeltaX > 0
				? 'right'
				: 'left';

		let direction = {
			x: anchorDeltaX,
			y: anchorDeltaY
		};

		steps.push(sourceSide);
		if (sourceTargetFacing) {
			distance.push(Math.abs(direction[axis]) / 2);
			steps.push(oppositeInitialDirection);
			distance.push(Math.abs(direction[oppositeAxis]));
			steps.push(sourceSide);
			distance.push(Math.abs(direction[axis]) / 2);
		} else {
			distance.push(buffer);
		}
		return { steps, distance };
	}

	$: CSSwidth = `${boxWidth}px`;
	$: CSSheight = `${boxHeight}px`;
	$: CSStop = `${minY - buffer}px`;
	$: CSSleft = `${minX - buffer}px`;

	$: labelTop = sourceAnchorPosY + anchorDeltaY / 2;
	$: labelLeft = sourceAnchorPosX + anchorDeltaX / 2;
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
			style:--default-edge-color={EDGE_COLOR}
			style:--default-edge-stroke-width={EDGE_WIDTH}
			stroke-width={strokeWidth}
			fill="transparent"
		/>
	</svg>
	{#if label}
		<EdgeLabel {label} top={labelTop} left={labelLeft} />
	{/if}
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
		z-index: -1;
		pointer-events: none;
		/* border: solid 0.5px red; */
	}
	path:hover {
		stroke: red;
	}
	.wrapper {
		position: absolute;
		pointer-events: none;
	}

	.active {
		z-index: 10;
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
</style>
