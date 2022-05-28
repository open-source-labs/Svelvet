<script>
	import BaseEdge from '$lib/Edges/BaseEdge.svelte';

	export let edge;

	$: yOffset = Math.abs(edge.targetY - edge.sourceY) / 2;
	$: centerY = edge.targetY < edge.sourceY ? edge.targetY + yOffset : edge.targetY - yOffset;

	$: xOffset = Math.abs(edge.targetX - edge.sourceX) / 2;
	$: centerX = edge.targetX < edge.sourceX ? edge.targetX + xOffset : edge.targetX - xOffset;

	$: path = `M ${edge.sourceX},${edge.sourceY}L ${edge.targetX},${edge.targetY}`;

	// $: [centerX, centerY, xOffset, yOffset] = [
	//     (edge.targetX < edge.sourceX ? edge.targetX + xOffset : edge.targetX - xOffset),
	//     (edge.targetY < edge.sourceY ? edge.targetY + yOffset : edge.targetY - yOffset),
	//     (Math.abs(edge.targetX - edge.sourceX) / 2),
	//     (Math.abs(edge.targetY - edge.sourceY) / 2)

	$: baseEdgeProps = {
		...edge,
		path: path,
		centerX: centerX,
		centerY: centerY,
		xOffset: xOffset,
		yOffset: yOffset
	};
</script>

<BaseEdge {baseEdgeProps} />
