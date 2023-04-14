<script lang="ts">
	import { Svelvet, Controls, Minimap, Node, Group, Anchor } from '$lib';
	import TestComponent from '../test-components/TestComponent.svelte';
	import CustomControls from '../test-components/CustomControls.svelte';
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

	const flowConfig = {Aprops: {bgColor: 'blue'}, Bprops: {width: 600}}

	const mermaid = `A|Default|Aprops --> B|Default|Bprops
	A --> K
	B --> C & D
	D --> F
	C --> L & X`;


</script>

<body>
	<div class="wrapper">
		<Svelvet {mermaid} {flowConfig} width={500} height={500} theme="dark" initialZoom={0.6} controls>
			<Minimap slot="minimap" corner="NE" />
			<CustomControls slot="controls" />
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
