<script lang="ts">
	import type { Node, XYPosition } from '$lib/types';
	import { cursorPosition } from '$lib/stores/CursorStore';
	import { get } from 'svelte/store';
	export let sourceNode: Node;
	export let targetNode: Node;
	export let sourceAnchor: string;
	export let targetAnchor: string;
	export let curve = true;
	export let active = false;

	// const targetNode: Node = get(nodeStore.get('5'));

	const { x: sourceAnchorOffsetX, y: sourceAnchorOffsetY } = sourceNode.anchors[sourceAnchor];
	const { x: targetAnchorOffsetX, y: targetAnchorOffsetY } = targetNode.anchors[targetAnchor];

	let flipHorizontal = false;
	let flipVertical = false;
	let strokeWidth = 3;

	const { width: sourceWidth, height: sourceHeight } = sourceNode.dimensions;
	const { width: targetWidth, height: targetHeight } = targetNode.dimensions;
	const { x: sourceNodeX, y: sourceNodeY } = sourceNode.position;
	const { x: targetNodeX, y: targetNodeY } = targetNode.position;

	let curveStrength = 0.4;
	let buffer = 30;
	let cornerRadiusConstant = 10;

	$: deltaY = $targetNodeY - $sourceNodeY;
	$: deltaX = $targetNodeX - $sourceNodeX;

	$: flipHorizontal = deltaX < 0;
	$: flipVertical = deltaY < 0;

	$: boxHeight = Math.abs(deltaY) + (flipVertical ? $sourceHeight : $targetHeight);
	$: boxWidth = Math.abs(deltaX) + $targetWidth;

	$: stepFlip = deltaY - buffer - $targetHeight;

	$: sourceAnchorX = sourceAnchorOffsetX;
	$: sourceAnchorY = flipVertical
		? boxHeight + buffer - $sourceHeight + sourceAnchorOffsetY
		: sourceAnchorOffsetY + buffer;

	$: targetAnchorY = flipVertical
		? buffer + targetAnchorOffsetY
		: boxHeight - $targetHeight + buffer + targetAnchorOffsetY;
	$: targetAnchorX = boxWidth - $targetWidth;

	$: sourceControlPointX = sourceAnchorX + (targetAnchorX - sourceAnchorX) * curveStrength;
	$: targetControlPointX = sourceAnchorX - (sourceAnchorX - targetAnchorX) * curveStrength;

	$: cornerRadiusX = Math.min(cornerRadiusConstant, Math.abs(deltaX));
	$: cornerRadiusY = Math.min(cornerRadiusConstant, Math.abs(deltaY));
	$: cornerRadiusString = `${cornerRadiusX} ${cornerRadiusY}`;
	$: cornerRadiusFlipped = `${cornerRadiusX} -${cornerRadiusY}`;

	$: rightDownArc = `${cornerRadiusString} 0 0 1 ${cornerRadiusString}`;
	$: downRightArc = `${cornerRadiusString} 0 0 0 ${cornerRadiusString}`;
	$: rightUpArc = `${cornerRadiusString} 0 0 0 ${cornerRadiusFlipped}`;
	$: upRightArc = `${cornerRadiusString} 0 0 1 ${cornerRadiusFlipped}`;

	$: bezierPath = `M ${sourceAnchorX}, ${sourceAnchorY}
	${
		curve
			? `C ${sourceControlPointX}, ${sourceAnchorY} ${targetControlPointX}, ${targetAnchorY}`
			: ''
	}
	${targetAnchorX}, ${targetAnchorY}`;

	$: stepPath = `M ${sourceAnchorX}, ${sourceAnchorY}
		l 0 ${Math.max(10, (targetAnchorY - sourceAnchorY) / 2 - cornerRadiusX)} 
		a ${downRightArc}
		l ${
			stepFlip < 0
				? Math.abs(sourceAnchorX - targetAnchorX) / 2 - cornerRadiusX * 2
				: Math.abs(sourceAnchorX - targetAnchorX) - cornerRadiusX * 2
		} 0
		a ${stepFlip < 0 ? rightUpArc : rightDownArc}
		l 0 ${
			stepFlip < 0
				? -(sourceAnchorY - targetAnchorY + cornerRadiusX * 2)
				: Math.max(10, (targetAnchorY - sourceAnchorY) / 2 - cornerRadiusX)
		}
		
		${
			stepFlip < 0
				? `a ${upRightArc}
		l  ${Math.abs(sourceAnchorX - targetAnchorX) / 2 - cornerRadiusX * 2} 0
		a ${rightDownArc}
		l  0 ${Math.abs(sourceAnchorX - targetAnchorX) / 2 - cornerRadiusX * 2}`
				: ''
		}`;
</script>

<svg
	width={boxWidth}
	height={boxHeight + buffer * 2}
	style="top: {Math.min($sourceNodeY, $targetNodeY) - buffer};
    left: {flipHorizontal ? $targetNodeX : $sourceNodeX};
	transform: scaleX({flipHorizontal ? -1 : 1});
	z-index: {active ? 10 : -10}"
>
	<path d={bezierPath} stroke="black" stroke-width={strokeWidth + 1.5} fill="transparent" />
	<path d={bezierPath} stroke="white" stroke-width={strokeWidth} fill="transparent" />
</svg>

<style>
	svg {
		position: absolute;
		pointer-events: none;
		/* border: solid 0.5px red; */
	}

	.animate {
		stroke-dasharray: 5;
		animation: dash 50000s linear;
	}
	@keyframes dash {
		from {
			stroke-dashoffset: 1000000;
		}
	}
</style>
