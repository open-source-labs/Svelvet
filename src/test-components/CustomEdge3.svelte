<script lang="ts">
	import type { WritableEdge } from '$lib';
	import Edge from '$lib/components/Edge/Edge.svelte';
</script>

<Edge let:path strokeColor="green">
	<div class="my-label" slot="label">
		<p>NODE EDGE</p>
	</div>
</Edge>

<style>
	path {
		stroke: rgb(20, 246, 80);
		stroke-width: 6px;
	}

	.my-label {
		background-color: rgb(172, 2, 2);
		width: 150px;
		height: 100px;
		border-radius: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		/* pointer-events: auto; */
	}

	button {
		background-color: rgb(172, 2, 2);
		width: 150px;
		height: 100px;
		border-radius: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		/* pointer-events: auto; */
	}

	p {
		color: rgb(255, 238, 0);
		line-height: 0;
		font-size: 16px;
	}
</style>
