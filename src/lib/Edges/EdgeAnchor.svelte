<script lang="typescript">
	// import React, { FC, HTMLAttributes } from 'react';
	import cc from 'classcat';

	import { Position } from '../types';

	const shiftX = (x: number, shift: number, position: Position): number => {
		if (position === Position.Left) return x - shift;
		if (position === Position.Right) return x + shift;
		return x;
	};

	const shiftY = (y: number, shift: number, position: Position): number => {
		if (position === Position.Top) return y - shift;
		if (position === Position.Bottom) return y + shift;
		return y;
	};

	// interface EdgeAnchorProps extends HTMLAttributes<HTMLDivElement> {
	// 	position: Position;
	// 	centerX: number;
	// 	centerY: number;
	// 	radius?: number;
	// }

	export let EdgeAnchor: any;
	const { className, position, centerX, centerY, radius = 10 } = EdgeAnchor;
</script>

<circle
	class={cc(['react-flow__edgeupdater', className])}
	cx={shiftX(centerX, radius, position)}
	cy={shiftY(centerY, radius, position)}
	r={radius}
	stroke="transparent"
	fill="transparent"
/>
