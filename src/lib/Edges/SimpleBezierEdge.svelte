<script>
	import BaseEdge from '$lib/Edges/BaseEdge.svelte';
	import { Position } from '$lib/types/utils';

	function getControl({ pos, x1, y1, x2, y2 }) {
		let ctX;
		let ctY;
		switch (pos) {
			case Position.Left:
			case Position.Right:
				{
					ctX = 0.5 * (x1 + x2);
					ctY = y1;
				}
				break;
			case Position.Top:
			case Position.Bottom:
				{
					ctX = x1;
					ctY = 0.5 * (y1 + y2);
				}
				break;
		}
		return [ctX, ctY];
	}

	function getSimpleBezierPath({ srcX, srcY, sourcePosition, trgX, trgY, targetPosition }) {
		const [sourceControlX, sourceControlY] = getControl({
			pos: sourcePosition,
			x1: srcX,
			y1: srcY,
			x2: trgX,
			y2: trgY
		});
		const [targetControlX, targetControlY] = getControl({
			pos: targetPosition,
			x1: trgX,
			y1: trgY,
			x2: srcX,
			y2: srcY
		});
		return `M${srcX},${srcY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${trgX},${trgY}`;
	}

	// function getSimpleBezierCenter({ srcX, srcY, sourcePosition, trgX, trgY, targetPosition }) {
	// 	const [sourceControlX, sourceControlY] = getControl({
	// 		pos: sourcePosition,
	// 		x1: srcX,
	// 		y1: srcY,
	// 		x2: trgX,
	// 		y2: trgY
	// 	});
	// 	const [targetControlX, targetControlY] = getControl({
	// 		pos: targetPosition,
	// 		x1: trgX,
	// 		y1: trgY,
	// 		x2: srcX,
	// 		y2: srcY
	// 	});
	// 	const centerX =
	// 		srcX * 0.1125 + sourceControlX * 0.3375 + targetControlX * 0.3375 + trgX * 0.1125;
	// 	const centerY = srcY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + trgY * 0.125;
	// 	const xOffset = Math.abs(centerX - srcX);
	// 	const yOffset = Math.abs(centerY - srcY);
	// 	return [centerX, centerY, xOffset, yOffset];
	// }

	export let edge;

	$: params = {
		srcX: edge.sourceX,
		srcY: edge.sourceY,
		sourcePosition: Position.Top,
		trgX: edge.targetX,
		trgY: edge.targetY,
		targetPosition: Position.Bottom
	};

	$: path = getSimpleBezierPath(params);

	// $: [centerX, centerY, xOffset, yOffset] = getSimpleBezierCenter(params);

	$: baseEdgeProps = {
		...edge,
		path: path,
		// centerX: centerX,
		// centerY: centerY,
		// xOffset: xOffset,
		// yOffset: yOffset
	};
</script>

<BaseEdge {baseEdgeProps} />
