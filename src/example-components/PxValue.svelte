<script lang="ts">
	import { Node, Resizer } from '$lib';
</script>

<Node bgColor="red">
	<div class="node">Pixel Value</div>
	<Resizer width />
</Node>

<style>
	.node {
		background-color: blue;
		width: 250px;
		height: 300px;
	}
</style>
