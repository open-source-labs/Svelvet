<script lang="ts">
	import { Node, Resizer } from '$lib';
</script>

<Node dimensions={{ width: 220, height: 87 }}>
	<div class="node">Percent Value</div>
	<Resizer width />
</Node>

<style>
	.node {
		background-color: green;
		width: 100%;
		height: 100%;
	}
</style>
