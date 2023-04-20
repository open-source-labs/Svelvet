<script lang="ts">
	import { Svelvet, Node } from '$lib';
	import type { NodeConfig } from '$lib';
	import CustomNode from '../example-components/CustomNode.svelte';
	import CustomEdge from '../example-components/CustomEdge.svelte';

	function randomColor() {
		return Math.floor(Math.random() * 255);
	}

	function updateConnected(e: CustomEvent) {
		const { node } = e.detail;
		node.label.set('Connected');
	}

	function updateDisconnected(e: CustomEvent) {
		const { node } = e.detail;
		node.label.set('Disconnected');
	}

	const mermaidConfig: Record<string, NodeConfig> = {
		A: { bgColor: 'blue' },
		B: { dimensions: { width: 600, height: 100 } },
		C: { dimensions: { width: 100, height: 600 } }
	};
</script>

<body>
	<div class="wrapper">
		<Svelvet controls edgeStyle="step" edge={CustomEdge} TD theme="dark" zoom={0.6} minimap>
			<CustomNode />
			<Node position={{ x: -200, y: 200 }} connections={[1]} id="NODE" label="NODE" resizable />
		</Svelvet>
	</div>
</body>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
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
		margin: 0;
		padding: 0;
	}
</style>
