<script lang="ts">
	import { Svelvet, Node, Anchor } from '$lib';

	let position = { x: 300, y: 300 };
	$: console.log(position);
</script>

<body>
	<Svelvet minimap title="test">
		<Node bgColor="red" inputs={4} bind:position>
			<div class="node-body">
				<p>{JSON.stringify(position)}</p>
				<button
					on:click={() => {
						position = { x: 100, y: 100 };
					}}>Move</button
				>
			</div>
		</Node>
	</Svelvet>
</body>

<style>
	.node-body {
		width: 200px;
		height: 300px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>
