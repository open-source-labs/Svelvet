<script lang="ts">
	import type { Graph } from '$lib/types';
	import type { BackgroundStyles } from '../../types/general';

	export let style: BackgroundStyles;
	export let graph: Graph;
	export let GRID_SCALE = 22; // Distance between dots when scale = 1
	export let DOT_WIDTH = 1.4; // Dot size when scale = 1

	// Import relevant data from store
	const { transforms } = graph;
	const { scale, translation, cursor } = transforms;
	const { x: translateX, y: translateY } = translation;
	const { x: xCoord, y: yCoord } = cursor;

	// Update dot radius and perceived grid width when scale changes
	$: gridScale = $scale * GRID_SCALE;
	$: radius = ($scale * DOT_WIDTH) / 2;

	let backgroundWrapper: HTMLDivElement;
	let svgWidth;
	let svgHeight;
	let backgroundOffsetX: number;
	let backgroundOffsetY: number;

	// Update background offset when scale or offset changes
	// This logic can definitely be simplified
	$: {
		svgWidth = backgroundWrapper?.offsetWidth || 0;
		svgHeight = backgroundWrapper?.offsetHeight || 0;
		backgroundOffsetX = ((svgWidth + radius) * (1 - $scale)) / 2 + $translateX + $xCoord;
		backgroundOffsetY = ((svgHeight + radius) * (1 - $scale)) / 2 + $translateY + $yCoord;
	}

	// Place dot in the center of the grid
	$: dotCenterCoordinate = gridScale / 2;
</script>

<!-- BACKGROUND COMPONENT START -->
<div id="background-wrapper" bind:this={backgroundWrapper}>
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
					<circle r={radius} cx={dotCenterCoordinate} cy={dotCenterCoordinate} />
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
		background-color: var(--background-color);
	}

	svg {
		width: 100%;
		height: 100%;
	}
	circle {
		fill: hsl(0, 0%, 49%);
	}

	line {
		stroke: hsl(0, 0%, 49%);
	}
</style>
