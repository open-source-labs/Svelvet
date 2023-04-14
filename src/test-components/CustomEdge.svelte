<script lang="ts">
	import Edge from '$lib/components/Edge/Edge.svelte';
</script>

<Edge let:path let:destroy color="red" width={4}>
	<button slot="label" on:click={destroy}>
		<p>ANCHOREDGE</p>
	</button>
</Edge>

<style>
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
