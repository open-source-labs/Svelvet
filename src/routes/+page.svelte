<script lang="ts">
	import { Svelvet, Controls, Minimap, Node, Group, Anchor } from '$lib';
	import TestComponent from '../test-components/TestComponent.svelte';
	import MyNode from '../test-components/MyNode.svelte';
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
</script>

<body>
	<div class="wrapper">
		<Svelvet width={500} height={500} theme="dark" initialZoom={0.6} minimap>
			<Node />
			<Node label="Demo Node" TD />
			<Node id="node-id" inputs={2} />
			<Node bgColor="red" inputs={10} outputs={5} height={200} position={{ x: 100, y: 100 }} />
			<Node let:grabHandle let:selected width={200} height={100}>
				<div use:grabHandle class:selected class="my-node">
					<Anchor
						let:linked
						output
						connections={[
							['4', '12'],
							['node-id', '1']
						]}
					>
						<div class="my-anchor" class:linked />
					</Anchor>
					<Anchor input />
				</div>
			</Node>
			<Controls slot="controls" />
		</Svelvet>
	</div>
</body>

<style>
	.my-node {
		width: 100%;
		height: 100%;
		background-color: black;
		border-radius: 20px;
	}
	.my-anchor {
		display: block;
		width: 10px;
		height: 10px;
		background-color: red;
		border-radius: 50%;
	}
	.trade {
		background-color: green;
	}
	.selected {
		background-color: white;
	}
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
