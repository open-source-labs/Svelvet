<script>
	import { Svelvet, Node, Resizer } from '$lib';
</script>

<Svelvet width={800} height={500}>
	<Node id="node1" dimensions={{ width: 200, height: 100 }} position={{ x: 300, y: 200 }}>
		<div class="node">
			<Resizer width height rotation />
		</div>
	</Node>
	<Node id="node2" position={{ x: 350, y: 350 }} />
</Svelvet>

<style>
	.node {
		width: 100%;
		height: 100%;
		background-color: red;
		border-radius: 8px;
		border: 2px solid black;
	}
</style>
