<!-- <script context="module" lang="ts"> -->
	<!-- interface GetSimpleBezierPathParams {
		sourceX: number;
		sourceY: number;
		sourcePosition?: Position;
		targetX: number;
		targetY: number;
		targetPosition?: Position;
	}

	interface GetControlParams {
		pos: Position;
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	} 

	function getControl({ pos, x1, y1, x2, y2 }: GetControlParams): [number, number] {
	// 	let ctX: number, ctY: number;
	// 	switch (pos) {
	// 		case Position.Left:
	// 		case Position.Right:
	// 			{
	// 				ctX = 0.5 * (x1 + x2);
	// 				ctY = y1;
	// 			}
	// 			break;
	// 		case Position.Top:
	// 		case Position.Bottom:
	// 			{
	// 				ctX = x1;
	// 				ctY = 0.5 * (y1 + y2);
	// 			}
	// 			break;
	// 	}
	// 	return [ctX, ctY];
	// }
	// export function getSimpleBezierPath({
	// 	sourceX,
	// 	sourceY,
	// 	sourcePosition = Position.Bottom,
	// 	targetX,
	// 	targetY,
	// 	targetPosition = Position.Top
	// }: GetSimpleBezierPathParams): string {
	// 	const [sourceControlX, sourceControlY] = getControl({
	// 		pos: sourcePosition,
	// 		x1: sourceX,
	// 		y1: sourceY,
	// 		x2: targetX,
	// 		y2: targetY
	// 	});
	// 	const [targetControlX, targetControlY] = getControl({
	// 		pos: targetPosition,
	// 		x1: targetX,
	// 		y1: targetY,
	// 		x2: sourceX,
	// 		y2: sourceY
	// 	});
	// 	return `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`;
	// }

	// @TODO: this function will recalculate the control points
	// one option is to let getXXXPath() return center points
	// but will introduce breaking changes
	// the getCenter() of other types of edges might need to change, too
	// export function getSimpleBezierCenter({
	// 	sourceX,
	// 	sourceY,
	// 	sourcePosition = Position.Bottom,
	// 	targetX,
	// 	targetY,
	// 	targetPosition = Position.Top
	// }: GetSimpleBezierPathParams): [number, number, number, number] {
	// 	const [sourceControlX, sourceControlY] = getControl({
	// 		pos: sourcePosition,
	// 		x1: sourceX,
	// 		y1: sourceY,
	// 		x2: targetX,
	// 		y2: targetY
	// 	});
	// 	const [targetControlX, targetControlY] = getControl({
	// 		pos: targetPosition,
	// 		x1: targetX,
	// 		y1: targetY,
	// 		x2: sourceX,
	// 		y2: sourceY
	// 	});
	// 	// cubic bezier t=0.5 mid point, not the actual mid point, but easy to calculate
	// 	// https://stackoverflow.com/questions/67516101/how-to-find-distance-mid-point-of-bezier-curve
	// 	const centerX =
	// 		sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;
	// 	const centerY =
	// 		sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;
	// 	const xOffset = Math.abs(centerX - sourceX);
	// 	const yOffset = Math.abs(centerY - sourceY);
	// 	return [centerX, centerY, xOffset, yOffset];
	// }
</script> -->

<script>
	// import type { EdgeProps } from '$lib/types';
	// import { Position } from '$lib/types';
	// import BaseEdge from './BaseEdge.svelte';

	// export let test: any;
	// export let edge: EdgeProps;
	// export let edge;
	// // $: ({ 
	// // 	sourceX,
	// // 	sourceY,
	// // 	targetX,
	// // 	targetY,
	// // 	sourcePosition = Position.Bottom,
	// // 	targetPosition = Position.Top,
	// // 	label,
	// // 	// markerEnd,
	// // 	// markerStart
	// // } = edge);
 	// //  $: sourceX = edge.sourceX;
	// //  $: sourceY = edge.sourceY;
	// //  $: targetX = edge.targetX;
	// //  $: targetY = edge.targetY;
	// //  $: sourcePosition = Position.Bottom;
	// //  $: targetPosition = Position.Top;
	// //  $: label = edge.label;
	// const { 
	// 	sourceX,
	// 	sourceY,
	// 	targetX,
	// 	targetY,
	// 	sourcePosition = Position.Bottom,
	// 	targetPosition = Position.Top,
	// 	label,
	// 	markerEnd,
	// 	markerStart
	// } = edge;

	// const params = {
	// 	sourceX,
	// 	sourceY,
	// 	sourcePosition,
	// 	targetX,
	// 	targetY,
	// 	targetPosition
	// };
	// const path = getSimpleBezierPath(params);
	// const [centerX, centerY] = getSimpleBezierCenter(params);

	// temoporary props object
	// const baseEdgeProps = {
	// 	...edge,
	// 	// path: path,
	// 	// centerX: centerX,
	// 	// centerY: centerY
	// };
	export let edge;
	
	$: x0 = edge.sourceX;
	$: y0 = edge.sourceY;
	$: x2 = edge.targetX;
	$: y2 = edge.targetY;
	let [x1, y1] = [30, 55];

</script>
<!-- <svg viewBox="0 0 200 90"> -->
<path d="M {x0} {y0} Q {x1} {y1} {x2} {y2}" stroke="black" stroke-width=1
  fill="transparent" />
<!--     <path d={path} stroke="black" stroke-width=1
  fill="transparent" /> -->
<!-- </svg>
-->
<!-- <div>Source: {edge.source} Target: {edge.target}</div>
<div>SourceX: {edge.sourceX} SourceY: {edge.sourceY}</div>
<div>TargetX: {edge.targetX} TargetY: {edge.targetY}</div> -->

<!-- <EachEdgeBase {baseEdgeProps} />
-->

<!--  style="overflow:visible" -->
<!-- Iterate through the edges array -->
<!-- <BaseEdge {baseEdgeProps} /> -->

<!-- <BaseEdge
	{baseEdgeProps}
	{path}
	{centerX}
	{centerY}
	{label}
	{labelStyle}
	{labelShowBg}
	{labelBgStyle}
	{labelBgPadding}
	{labelBgBorderRadius}
	{style}
	{markerEnd}
	{markerStart}
/> -->