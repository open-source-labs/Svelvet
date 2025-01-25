<script lang="ts">
	import { run } from 'svelte/legacy';

	interface Props {
		size?: number;
		strokeWidth?: number;
		dashCount?: number;
		scale?: number;
		animation?: number;
		color?: string;
		noise?: number; // Add noise parameter
	}

	let {
		size = 200,
		strokeWidth = 4,
		dashCount = 5,
		scale = 30,
		animation = 0,
		color = 'red',
		noise = 0
	}: Props = $props();

	interface Circle {
		cx: number;
		cy: number;
		r: number;
		strokeWidth: number;
		dashArray: string;
		angle: number;
	}

	let circles: Array<Circle> = $state([]);
	let dashLength;
	let gapLength;


	const random = Array(50)
		.fill(null)
		.map(() => Math.random() - 0.5);

	function generateCircles(
		size: number,
		strokeWidth: number,
		dashFactor: number,
		numCircles: number,
		noise: number
	) {
		let generatedCircles = [];

		for (let i = 0; i < numCircles; i++) {
			let radius = size * (i / numCircles) * 2;
			let angle = 0;
			let circumference = 2 * Math.PI * radius;

			dashLength = circumference / dashFactor / 2;
			gapLength = (circumference - dashLength) / (dashFactor - 1);

			dashLength += random[i] * noise * 15;
			angle = 1440 * random[i] * noise;
			strokeWidth += (random[i] * noise) / 2;

			let circle = {
				cx: size / 2,
				cy: size / 2,
				r: radius,
				strokeWidth: strokeWidth,
				dashArray: `${dashLength + random[i] * noise * 5},${dashLength - random[i] * noise * 5}`,
				angle
			};

			generatedCircles.push(circle);
		}
		return generatedCircles;
	}
	let animate = $derived(animation);
	run(() => {
		circles = generateCircles(size, strokeWidth, dashCount, scale, noise);
	});
</script>

<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
	{#each circles as circle (circle.r)}
		<circle
			cx="50%"
			cy="50%"
			r={circle.r}
			style:--animation-speed={animation + 's'}
			stroke={color}
			style:transform={`rotate(${circle.angle}deg)`}
			fill="none"
			style:--stroke-width={circle.strokeWidth + 'px'}
			stroke-width={circle.strokeWidth}
			stroke-dasharray={circle.dashArray}
			class:animate
		/>
	{/each}
</svg>

<style>
	svg {
		pointer-events: auto;
	}

	.animate {
		animation: dash var(--animation-speed) linear infinite,
			pulse-width var(--animation-speed) linear infinite;
	}

	@keyframes dash {
		to {
			rotate: 360deg;
		}
	}

	@keyframes pulse-width {
		0% {
			stroke-width: calc(var(--stroke-width));
		}
		50% {
			stroke-width: calc(var(--stroke-width) * 2);
		}
		100% {
			stroke-width: calc(var(--stroke-width));
		}
	}
</style>
