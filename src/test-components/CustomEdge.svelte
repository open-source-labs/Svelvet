<script lang="ts">
	import Edge from '$lib/components/Edge/Edge.svelte';
	import { getRandomColor } from '$lib/utils';
	const color = 'green';
</script>

<Edge let:path let:destroy {color} width={4}>
	<div slot="label">Custom Edges and Labels</div>
</Edge>

<style>
	div {
		width: 50px;
		height: 10px;
		background-color: white;
	}
</style>
