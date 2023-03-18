<script lang="ts">
	import type { Node } from '$lib/types';
	import { cursorPosition } from '$lib/stores/CursorStore';

	export let inputNode: Node;
	export let targetPosition = cursorPosition;
	export let curve: boolean = true;
	export let edgeNumber = 1;
	export let edgeCount = 1;

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

	$: deltaY = $targetY - $y;
	$: deltaX = $targetX - $x;

	$: boxHeight = Math.abs(deltaY) + $height;
	$: boxWidth = Math.abs(deltaX) + $width;

	$: targetCenter = $width / 2;
	$: sourceCenter = $width / 2;

	$: flipHorizontal = deltaX < 0;
	$: flipVertical = deltaY < 0;

	$: buffer = 30;
	$: sourceAnchorX = sourceCenter;
	$: targetAnchorX = boxWidth - targetCenter;
	$: sourceAnchorY = flipVertical ? boxHeight + buffer : $height + buffer;
	$: targetAnchorY = flipVertical ? buffer : boxHeight - $height + buffer;

	$: sourceControlPointY = sourceAnchorY + Math.max(boxHeight * curveStrength, 60);
	$: targetControlPointY = targetAnchorY - Math.max(boxHeight * curveStrength, 60);

	$: path = `M ${sourceAnchorX}, ${sourceAnchorY}
    ${
			curve
				? `C ${sourceAnchorX}, ${sourceControlPointY} ${targetAnchorX}, ${targetControlPointY}`
				: ''
		}
    ${targetAnchorX}, ${targetAnchorY} `;
</script>

<svg
	width={boxWidth}
	height={boxHeight + buffer * 2}
	style="top: {Math.min($y - buffer, $targetY - buffer)};
    left: {flipHorizontal ? $targetX : $x};
	transform: scaleX({flipHorizontal ? -1 : 1});"
>
	<path d={path} stroke="gray" stroke-width={strokeWidth} fill="transparent" />
</svg>

<style>
	svg {
		box-sizing: border-box;
		z-index: 10;
		position: absolute;
		pointer-events: none;
		border: solid 0.5px red;
	}
</style>
