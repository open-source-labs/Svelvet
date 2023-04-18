<script lang="ts">
	export let size = 200;
	export let strokeWidth = 4;
	export let dashFactor = 5;
	export let numCircles = 30;
	export let spacing = 5;
	export let color = 'red';
	export let noise = 20; // Add noise parameter

	interface Circle {
		cx: number;
		cy: number;
		r: number;
		strokeWidth: number;
		dashArray: string;
		angle: number;
	}

	let circles: Array<Circle> = [];
	let previousNoiseFactor = 0;
	let previousNoise = noise;
	let dashLength;
	let gapLength;

	$: {
		circles = generateCircles(size, strokeWidth, dashFactor, numCircles, spacing, noise);
	}

	function generateCircles(
		size: number,
		strokeWidth: number,
		dashFactor: number,
		numCircles: number,
		spacing: number,
		noise: number
	) {
		let generatedCircles = [];
		let radius = strokeWidth / 2;

		for (let i = 0; i < numCircles; i++) {
			let angle;
			let circumference = 2 * Math.PI * radius;
			dashLength = circumference / dashFactor;
			gapLength = (circumference - dashLength) / (dashFactor - 1);

			const noiseFactor = Math.random() * (2 * noise) - noise;

			if (previousNoise !== noise) {
				dashLength += noiseFactor;
				gapLength -= noiseFactor;
				angle = noiseFactor * i;
				previousNoiseFactor = noiseFactor;
				previousNoise = noise;
			} else {
				dashLength += previousNoiseFactor;
				gapLength -= previousNoiseFactor;
				angle = previousNoiseFactor * i;
			}

			let circle = {
				cx: size / 2,
				cy: size / 2,
				r: radius,
				strokeWidth: strokeWidth,
				dashArray: `${dashLength},${gapLength}`,
				angle
			};

			generatedCircles.push(circle);
			radius += spacing;
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
			stroke={color}
			style:transform-origin="50% 50%"
			fill="none"
			stroke-width={circle.strokeWidth}
			stroke-dasharray={circle.dashArray}
		/>
	{/each}
</svg>

<style>
	svg {
		pointer-events: auto;
	}
</style>
