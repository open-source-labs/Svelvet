<script lang="typescript">
	// import React from 'react';

	import EdgeText from './EdgeText.svelte';
	import type { BaseEdgeProps } from '../types';

	export let {
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
	}: BaseEdgeProps;

	const text = label ? (
		<EdgeText
			x={centerX}
			y={centerY}
			label={label}
			labelStyle={labelStyle}
			labelShowBg={labelShowBg}
			labelBgStyle={labelBgStyle}
			labelBgPadding={labelBgPadding}
			labelBgBorderRadius={labelBgBorderRadius}
		/>
	) : null;
</script>

<path {style} d={path} class="react-flow__edge-path" {markerEnd} {markerStart} />
{text}
