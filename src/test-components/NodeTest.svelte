<script>
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	import Node from '$lib/components/Node/Node.svelte';
	import Resizer from '$lib/components/Resizer/Resizer.svelte';
</script>

<Node let:selected dimensions={{ width: 400, height: 100 }}>
	<div class:selected><Anchor input /></div>
	<Resizer width height />
</Node>

<style>
	div {
		width: 100%;
		height: 100%;
		background-color: red;
		border-radius: 8px;
		border: 2px solid black;
	}
	.selected {
		border: 2px solid white;
	}
</style>
