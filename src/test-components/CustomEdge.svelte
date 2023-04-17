<script lang="ts">
	import Edge from '$lib/components/Edge/Edge.svelte';
	import { getRandomColor } from '$lib/utils';
	const color = getRandomColor();
</script>

<Edge let:path let:destroy {color} width={4}>
	<div slot="label">Hello</div>
</Edge>

<style>
	p {
		color: rgb(255, 238, 0);
		line-height: 0;
		font-size: 16px;
	}
	div {
		width: 50px;
		height: 10px;
		background-color: white;
	}
</style>
