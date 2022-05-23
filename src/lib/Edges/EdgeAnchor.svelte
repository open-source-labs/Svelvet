<script lang="ts">
	import { Position } from '$lib/types/types';

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
	const { position, centerX, centerY, radius = 10 } = EdgeAnchor;
</script>

<circle
	cx={shiftX(centerX, radius, position)}
	cy={shiftY(centerY, radius, position)}
	r={radius}
	stroke="transparent"
	fill="transparent"
/>
