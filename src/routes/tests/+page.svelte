<script lang="ts">
	import { Svelvet, Minimap, Node } from '$lib';
	import CustomEdge from '../../example-components/CustomEdge.svelte';
</script>

<body>
	<div class="wrapper">
		<Svelvet translation={{ x: 0, y: 0 }} width={800} height={500} theme="dark" controls>
			<Node id="node1" label="test" resizable />
			<Node
				on:connection={() => console.log('node2 connected')}
				on:disconnection={() => console.log('node2 disconnected')}
				position={{ x: 300, y: 300 }}
				dimensions={{ width: 400, height: 100 }}
				id="node2"
				label="test"
				edge={CustomEdge}
			/>
			<Node label="what" position={{ x: 10, y: 200 }} inputs={3} TD />
			<Minimap slot="minimap" />
		</Svelvet>
	</div>
</body>

<style>
	.wrapper {
		display: flex;
		border: solid 1px black;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 0 40px 0 rgba(37, 37, 37, 0.5);
	}
	body {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: gray;
		width: 100vw;
		height: 100vh;
		padding: 0;
		margin: 0;
	}
</style>
