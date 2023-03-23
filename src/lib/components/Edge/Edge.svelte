<script lang="ts">
	import type { Node } from '$lib/types';
	import { cursorPosition } from '$lib/stores/CursorStore';

	export let inputNode: Node;
	export let targetPosition = cursorPosition;
	export let curve: boolean = true;
	export let edgeNumber = 1;
	export let edgeCount = 1;
	export let active = false;

	let flipHorizontal = false;
	let flipVertical = false;
	let anchorGap = 5;
	let offset = anchorGap * (edgeNumber - Math.ceil(edgeCount / 2));
	let strokeWidth = 4;

	const parentPosition = inputNode.position;
	const { width, height } = inputNode.dimensions;
	const { x, y } = parentPosition;
	const { x: targetX, y: targetY } = targetPosition;

	let curveStrength = 0.2;
	let buffer = 30;

	$: deltaY = $targetY - $y;
	$: deltaX = $targetX - $x;

	$: boxHeight = Math.abs(deltaY) + $height;
	$: boxWidth = Math.abs(deltaX) + $width;

	$: stepFlip = deltaY - buffer - $height;

	$: targetCenter = $width / 2;
	$: sourceCenter = $width / 2;

	$: flipHorizontal = deltaX < 0;
	$: flipVertical = deltaY < 0;

	$: sourceAnchorX = sourceCenter;
	$: targetAnchorX = boxWidth - targetCenter;
	$: sourceAnchorY = flipVertical ? boxHeight + buffer : $height + buffer;
	$: targetAnchorY = flipVertical ? buffer : boxHeight - $height + buffer;

	$: sourceControlPointY = boxHeight - 60;
	$: targetControlPointY = 60;

	$: cornerRadius = 10;
	$: cornerRadiusString = `${cornerRadius} ${cornerRadius}`;
	$: cornerRadiusFlipped = `${cornerRadius} -${cornerRadius}`;

	$: rightDownArc = `${cornerRadiusString} 0 0 1 ${cornerRadiusString}`;
	$: downRightArc = `${cornerRadiusString} 0 0 0 ${cornerRadiusString}`;
	$: rightUpArc = `${cornerRadiusString} 0 0 0 ${cornerRadiusFlipped}`;
	$: upRightArc = `${cornerRadiusString} 0 0 1 ${cornerRadiusFlipped}`;

	$: bezierPath = `M ${sourceAnchorX}, ${sourceAnchorY}
	${
		curve
			? `C ${sourceAnchorX}, ${sourceControlPointY} ${targetAnchorX}, ${targetControlPointY}`
			: ''
	}
	${targetAnchorX}, ${targetAnchorY}`;

	$: stepPath = `M ${sourceAnchorX}, ${sourceAnchorY}
		l 0 ${Math.max(10, (targetAnchorY - sourceAnchorY) / 2 - cornerRadius)} 
		a ${downRightArc}
		l ${
			stepFlip < 0
				? Math.abs(sourceAnchorX - targetAnchorX) / 2 - cornerRadius * 2
				: Math.abs(sourceAnchorX - targetAnchorX) - cornerRadius * 2
		} 0
		a ${stepFlip < 0 ? rightUpArc : rightDownArc}
		l 0 ${
			stepFlip < 0
				? -(sourceAnchorY - targetAnchorY + cornerRadius * 2)
				: Math.max(10, (targetAnchorY - sourceAnchorY) / 2 - cornerRadius)
		}
		
		${
			stepFlip < 0
				? `a ${upRightArc}
		l  ${Math.abs(sourceAnchorX - targetAnchorX) / 2 - cornerRadius * 2} 0
		a ${rightDownArc}
		l  0 ${Math.abs(sourceAnchorX - targetAnchorX) / 2 - cornerRadius * 2}`
				: ''
		}`;
</script>

<svg
	width={boxWidth}
	height={boxHeight + buffer * 2}
	style="top: {Math.min($y, $targetY) - buffer};
    left: {flipHorizontal ? $targetX : $x};
	transform: scaleX({flipHorizontal ? -1 : 1});
	z-index: {active ? 10 : -10}"
>
	<path d={stepPath} stroke="gray" stroke-width={strokeWidth} fill="transparent" />
</svg>

<style>
	svg {
		box-sizing: border-box;
		position: absolute;
		pointer-events: none;
		border: solid 0.5px red;
	}
</style>
