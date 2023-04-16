<script lang="ts">
	import { Svelvet, Controls, Minimap, Node, Group, Anchor, type NodeConfig } from '$lib';
	import TestComponent from '../test-components/TestComponent.svelte';
	import CustomControls from '../test-components/CustomControls.svelte';
	import MyNode from '../test-components/MyNode.svelte';
	import Background from '$lib/containers/Background/Background.svelte';
	import CustomEdge from '../test-components/CustomEdge.svelte';
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

	const mermaid = `Dad & Mom --> Child
	Child --> Frank`;
</script>

<body>
	<div class="wrapper">
		<Svelvet
			edgeStyle="step"
			width={800}
			theme="dark"
			height={500}
			initialZoom={0.6}
			edge={CustomEdge}
		>
			<Node position={{ x: 200, y: 300 }} />

			<Node position={{ x: 100, y: 20 }} TD />
			<Node />
			<Node connections={[['3', '2'], 3, 1]} />
			<Node TD />
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
	}
</style>
