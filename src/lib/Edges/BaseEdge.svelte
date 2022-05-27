<script>
	import EdgeText from '$lib/Edges/EdgeText.svelte';
	export let baseEdgeProps;

	$: ({ sourceX, sourceY, targetX, targetY, path, centerX, centerY, xOffset, yOffset, animate } =
		baseEdgeProps);
	$: edgeTextProps = {
		x: centerX,
		y: centerY,
		// xOffset: xOffset,
		// yOffset: yOffset,
		// label: baseEdgeProps.data.label
		label: baseEdgeProps.label
	};
</script>

<path
	class={animate ? 'animate' : ''}
	d={path}
	fill="transparent"
	stroke="gray"
	aria-label="svg-path"
/>

{#if edgeTextProps.label}
	<EdgeText {edgeTextProps} />
{/if}

<style>
	.animate {
		stroke-dasharray: 5;
		animation: dash 50000s linear;
	}
	@keyframes dash {
		from {
			stroke-dashoffset: 1000000;
		}
	}
</style>
