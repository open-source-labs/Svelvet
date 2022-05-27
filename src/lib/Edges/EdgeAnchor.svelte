<script lang="ts">
<<<<<<< HEAD
	import { Position } from '$lib/types/utils';

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
=======
	export let x;
	export let y;
>>>>>>> main
</script>

<circle
	cx={x}
	cy={y}
	r={5}
	stroke="white"
	fill="black"
/>

<style>
	circle {
		position: absolute;
	}
</style>