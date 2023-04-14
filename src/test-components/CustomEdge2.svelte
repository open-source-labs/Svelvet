<script lang="ts">
	import type { WritableEdge } from '$lib';
	import Edge from '$lib/components/Edge/Edge.svelte';
</script>

<Edge let:path label="GraphEdge" labelColor="white" textColor="black">
	<path d={path} />
</Edge>

<style>
	path {
		stroke: rgb(76, 20, 246);
		stroke-width: 6px;
	}
</style>
