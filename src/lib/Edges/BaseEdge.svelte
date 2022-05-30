<script>
	import EdgeText from '$lib/Edges/EdgeText.svelte';
	export let baseEdgeProps;

	$: ({ sourceX, sourceY, targetX, targetY, path, animate, 
		// centerX, centerY, xOffset, yOffset 
		} = baseEdgeProps);
	$: edgeTextProps = {
		// x: centerX,
		// y: centerY,
		sourceX: sourceX,
		sourceY: sourceY,
		targetX: targetX,
		targetY: targetY,
		label: baseEdgeProps.label
		// xOffset: xOffset,
		// yOffset: yOffset,
		// label: baseEdgeProps.data.label
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
