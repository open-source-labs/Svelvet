<script lang="ts">
	import { Svelvet, Minimap, Node } from '$lib';
	import { getRandomColor } from '$lib/utils';
	import type { CSSColorString, NodeConfig } from '$lib/types';

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

	let nodes: NodeConfig[] = [
		{
			bgColor: 'red',
			label: 'Color Will Change',
			position: { x: 100, y: 100 }
		},
		{
			bgColor: 'green',
			label: 'Node 2',
			position: { x: 200, y: 200 }
		},
		{
			bgColor: 'blue',
			label: 'Node 3',
			position: { x: 300, y: 300 }
		}
	];

	function addNode() {
		const random: CSSColorString = `rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`;

		nodes.push({
			bgColor: random,
			label: `Node ${nodes.length + 1}`,
			position: { x: Math.random() * 400, y: Math.random() * 600 }
		});

		// Change existing node
		nodes[0].bgColor = getRandomColor();
		nodes[1].label = 'Changed Label';
		nodes = nodes;
	}
</script>

<body>
	<div class="wrapper">
		<Svelvet edgeStyle="step" width={800} height={500} theme="dark" controls>
			<Node id="node1" label="test" resizable />
			<Node
				position={{ x: 300, y: 300 }}
				dimensions={{ width: 400, height: 100 }}
				id="node2"
				label="test"
			/>
			<Node position={{ x: 10, y: 200 }} inputs={3} TD />
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
	}
</style>
