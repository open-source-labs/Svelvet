<script lang="ts">
	import { DOT_WIDTH, GRID_SCALE } from '$lib/constants';
	import { getContext } from 'svelte';
	import type { Graph, CSSColorString } from '$lib/types';
	import type { BackgroundStyles } from '$lib/types/general';

	const graph = getContext<Graph>('graph');

	// Props
	export let style: BackgroundStyles = 'dots';
	export let gridWidth = GRID_SCALE; // Distance between dots when scale = 1
	export let dotSize = DOT_WIDTH; // Dot size when scale = 1
	export let bgColor: CSSColorString | null = null;
	export let dotColor: CSSColorString | null = null;

	// External stores
	const transforms = graph.transforms;
	const scaleStore = transforms.scale;
	const translationStore = transforms.translation;

	// Reactive variables
	let backgroundWrapper: HTMLDivElement;
	let svgWidth;
	let svgHeight;
	let backgroundOffsetX: number;
	let backgroundOffsetY: number;

	//Subscriptions
	$: graphTranslation = $translationStore;
	$: scale = $scaleStore;

	// Reactive declarations
	$: gridScale = scale * gridWidth; // Update grid scale when scale changes
	$: radius = (scale * dotSize) / 2; // Update dot radius when scale changes
	$: dotCenterCoordinate = gridScale / 2; // Place dot in the center of the grid

	// Update background offset when scale or offset changes
	$: {
		svgWidth = backgroundWrapper?.offsetWidth || 0;
		svgHeight = backgroundWrapper?.offsetHeight || 0;
		backgroundOffsetX = ((svgWidth + radius) * (1 - scale)) / 2 + graphTranslation.x;
		backgroundOffsetY = ((svgHeight + radius) * (1 - scale)) / 2 + graphTranslation.y;
	}
</script>

<!-- BACKGROUND COMPONENT START -->
<div
	id="background-wrapper"
	style:--calculated-background-color={bgColor}
	bind:this={backgroundWrapper}
>
	<svg>
		<defs>
			<pattern
				id="graph-pattern"
				x={backgroundOffsetX}
				y={backgroundOffsetY}
				width={gridScale}
				height={gridScale}
				patternUnits="userSpaceOnUse"
			>
				{#if style === 'dots'}
					<circle
						class="background-dot"
						style:--calculated-dot-color={dotColor}
						r={radius}
						cx={dotCenterCoordinate}
						cy={dotCenterCoordinate}
					/>
				{:else if style === 'lines'}
					<line
						x1={dotCenterCoordinate}
						y1={0}
						x2={dotCenterCoordinate}
						y2={gridScale}
						stroke-width={radius}
					/>
					<line
						y1={dotCenterCoordinate}
						x1={0}
						y2={dotCenterCoordinate}
						x2={gridScale}
						stroke-width={radius}
					/>
				{/if}
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#graph-pattern)" />
	</svg>
</div>

<!-- BACKGROUND COMPONENT END -->

<!-- STYLES -->
<style>
	#background-wrapper {
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: -10;
		box-sizing: border-box;
		background-color: var(
			--calculated-background-color,
			var(--background-color, var(--default-background-color))
		);
	}

	.background-dot {
		fill: var(--calculated-dot-color, var(--dot-color, var(--default-dot-color)));
	}
	svg {
		width: 100%;
		height: 100%;
	}
</style>
