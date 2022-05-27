<script>
	import EdgeText from '$lib/Edges/EdgeText.svelte';
	export let baseEdgeProps;

	$: ({ sourceX, sourceY, targetX, targetY, path, centerX, centerY, xOffset, yOffset } = baseEdgeProps);
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
		d={path}
		fill="transparent"
		stroke="black"
	/>

{#if edgeTextProps.label}
	<EdgeText {edgeTextProps} />
{/if}

<!-- <style>
	path {
		position: absolute;
	}
</style> -->