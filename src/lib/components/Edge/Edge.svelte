<!-- <script>
	export let sourcePosition: XYPair;
	export let targetPosition: XYPair;
</script>

<div
	class="wrapper"
	style:width={CSSwidth}
	style:height={CSSheight}
	style:top={CSStop}
	style:left={CSSleft}
>
	<svg class:active>
		<path
			class:animate
			d={path}
			style:--default-edge-color={EDGE_COLOR}
			style:--default-edge-stroke-width={EDGE_WIDTH}
			stroke-width={strokeWidth}
			fill="transparent"
		/>
	</svg>
	{#if label}
		<EdgeLabel {label} top={labelTop} left={labelLeft} />
	{/if}
</div>

<style>
	path {
		pointer-events: auto;
		cursor: pointer;
		stroke: var(--edge-color, var(--default-edge-color));
		stroke-width: var(--edge-stroke-width, var(--default-edge-stroke-width));
	}
	svg {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: -1;
		pointer-events: none;
		/* border: solid 0.5px red; */
	}
	path:hover {
		stroke: red;
	}
	.wrapper {
		position: absolute;
		pointer-events: none;
	}

	.active {
		z-index: 10;
	}

	.animate {
		stroke-dasharray: 5;
		animation: dash 1s linear infinite;
		will-change: stroke-dashoffset;
	}

	@keyframes dash {
		from {
			stroke-dashoffset: 30;
		}
	}
</style> -->
