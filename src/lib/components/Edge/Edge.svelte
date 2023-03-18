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

	$: boxWidth = Math.abs($targetX - $x) + $width;
	$: boxHeight = $targetY - $y - $height;

	$: flipHorizontal = $targetX - $x < 0;
	$: flipVertical = boxHeight < 0;

	$: buffer = Math.min(30, Math.abs(boxHeight) * 1.1);

	let curveStrength = 0.5;

	$: path = `M ${$width / 2}, ${flipVertical ? Math.abs(boxHeight) + buffer : 0}
    ${
			curve
				? `C ${$width / 2}, ${
						flipVertical ? Math.abs(boxHeight) + buffer * 3 : boxHeight * (1 - curveStrength)
				  }
				${Math.abs(boxWidth) - $width / 2}, ${flipVertical ? -buffer : Math.abs(boxHeight) * curveStrength}`
				: ''
		}
    ${boxWidth - $width / 2}, ${flipVertical ? buffer : Math.abs(boxHeight)} `;
</script>

<svg
	width={Math.abs(boxWidth)}
	height={flipVertical ? Math.abs(boxHeight) + buffer * 2 : Math.abs(boxHeight) + strokeWidth}
	style="top: {flipVertical ? $targetY - buffer : $y + $height};
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
		/* border: solid 0.5px red; */
	}
</style>
