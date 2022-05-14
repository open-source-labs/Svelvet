<script lang="typescript">
	// import React, { memo, useRef, useState, useEffect, FC, PropsWithChildren } from 'react';
	import { onMount } from 'svelte';
	import cc from 'classcat';

	import { EdgeTextProps, Rect } from '../../types';

	export let {
		//FC<PropsWithChildren<EdgeTextProps>>
		x,
		y,
		label,
		labelStyle = {},
		labelShowBg = true,
		labelBgStyle = {},
		labelBgPadding = [2, 4],
		labelBgBorderRadius = 2,
		children,
		className,
		...rest
	};

	// const EdgeText: any = ({
	// 	//FC<PropsWithChildren<EdgeTextProps>>
	// 	x,
	// 	y,
	// 	label,
	// 	labelStyle = {},
	// 	labelShowBg = true,
	// 	labelBgStyle = {},
	// 	labelBgPadding = [2, 4],
	// 	labelBgBorderRadius = 2,
	// 	children,
	// 	className,
	// 	...rest
	// }) => {
	const edgeRef: SVGTextElement;
	const [edgeTextBbox, setEdgeTextBbox]: Rect = { x: 0, y: 0, width: 0, height: 0 };
	const edgeTextClasses = cc(['svelvet__edge-textwrapper', className]);

	onMount(() => {
		if (edgeRef.current) {
			const textBbox = edgeRef.current.getBBox();

			setEdgeTextBbox({
				x: textBbox.x,
				y: textBbox.y,
				width: textBbox.width,
				height: textBbox.height
			});
		}
	}, [label]); //the typescript error on this line will be fixed once EdgeTextProps is uncommented

	if (typeof label === 'undefined' || !label) {
		return null;
	}
	// };
</script>

<g
	transform={`translate(${x - edgeTextBbox.width / 2} ${y - edgeTextBbox.height / 2})`}
	class={edgeTextClasses}
	{...rest}
>
	<!-- {labelShowBg && ( -->
	{#if labelShowBg}
		<rect
			width={edgeTextBbox.width + 2 * labelBgPadding[0]}
			x={-labelBgPadding[0]}
			y={-labelBgPadding[1]}
			height={edgeTextBbox.height + 2 * labelBgPadding[1]}
			className="react-flow__edge-textbg"
			style={labelBgStyle}
			rx={labelBgBorderRadius}
			ry={labelBgBorderRadius}
		/>
	{/if}
	<!-- )} -->
	<text
		class="react-flow__edge-text"
		y={edgeTextBbox.height / 2}
		dy="0.3em"
		ref={edgeRef}
		style={labelStyle}
	>
		{label}
	</text>
	{children}
</g>
