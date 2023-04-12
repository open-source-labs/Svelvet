<script lang="ts">
	import { Svelvet, Controls, Minimap, Node, Group, Anchor } from '$lib';
	import TestComponent from '../test-components/TestComponent.svelte';
	import CustomControls from '../test-components/CustomControls.svelte';
	import MyNode from '../test-components/MyNode.svelte';
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
	<button on:click={addNode}>ADD NODE</button>
	<div class="wrapper">
		<Svelvet width={500} height={500} theme="dark" initialZoom={0.6}>
			{#each nodes as node}
				<Node {...node} />
			{/each}
			<Node>
				<div>Helo</div>
			</Node>
			<Controls slot="controls" corner="NW" />
			<Minimap mapColor="purple" nodeColor="white" slot="minimap" />
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
