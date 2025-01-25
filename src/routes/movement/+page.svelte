<script lang="ts">
	import { run } from 'svelte/legacy';

	import { Svelvet, Node, Anchor } from '$lib';

	let position = $state({ x: 300, y: 300 });
	run(() => {
		console.log(position);
	});
</script>

<body>
	<Svelvet minimap title="test">
		<Node bgColor="red" inputs={4} bind:position>
			<div class="node-body">
				<p>{JSON.stringify(position)}</p>
				<button
					onclick={() => {
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
