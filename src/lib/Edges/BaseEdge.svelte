<script lang="typescript">
	// import React from 'react';

	import EdgeText from './EdgeText.svelte';
	import type { BaseEdgeProps } from '../types';

	export let baseEdgeProps: BaseEdgeProps;
	const {
		path,
		centerX,
		centerY,
		label,
		labelStyle,
		labelShowBg,
		labelBgStyle,
		labelBgPadding,
		labelBgBorderRadius,
		style,
		markerEnd,
		markerStart
	} = baseEdgeProps;

	// const text = label ? (
	// 	<EdgeText
	// 		x={centerX}
	// 		y={centerY}
	// 		label={label}
	// 		labelStyle={labelStyle}
	// 		labelShowBg={labelShowBg}
	// 		labelBgStyle={labelBgStyle}
	// 		labelBgPadding={labelBgPadding}
	// 		labelBgBorderRadius={labelBgBorderRadius}
	// 	/>
	// ) : null;
	const edgeTextProps = {
		x: centerX,
		y: centerY,
		label: label,
		labelStyle: labelStyle,
		labelShowBg: labelShowBg,
		labelBgStyle: labelBgStyle,
		labelBgPadding: labelBgPadding,
		labelBgBorderRadius: labelBgBorderRadius
	};
</script>

This is the path in BaseEdge {path}
<br />
<path
	{style}
	d={path}
	class="react-flow__edge-path"
	marker-end={markerEnd}
	marker-start={markerStart}
/>
{#if label}
	<EdgeText {edgeTextProps} />
{/if}
<!-- {text} -->
