<script lang="ts">
	export let size = 200;
	export let strokeWidth = 4;
	export let dashCount = 5;
	export let scale = 30;
	export let animation = 0;
	export let color = 'red';
	export let noise = 0; // Add noise parameter

	interface Circle {
		cx: number;
		cy: number;
		r: number;
		strokeWidth: number;
		dashArray: string;
		angle: number;
	}

	let circles: Array<Circle> = [];
	let dashLength;
	let gapLength;
	$: animate = animation;

	$: {
		circles = generateCircles(size, strokeWidth, dashCount, scale, noise);
	}

	const random = Array(50)
		.fill(null)
		.map((_, i) => Math.random() - 0.5);

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
</script>

<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
	{#each circles as circle (circle.r)}
		<circle
			cx="50%"
			cy="50%"
			r={circle.r}
			style:--animation-speed={animation + 's'}
			stroke={color}
			style:transform-origin="50% 50%"
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
