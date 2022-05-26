<script>
	// import EdgeText from '$lib/Edges/EdgeText.svelte';
	export let baseEdgeProps;

	$: ({ path } = baseEdgeProps);
</script>

<path d={path} fill="transparent" stroke="black" aria-label="svg-path" />

<!-- {#if label}
	<EdgeText {edgeTextProps} />
{/if} -->
