<script lang="ts">
	import { Svelvet, Controls, Minimap, Node } from '$lib';
	import MinimapNode from '$lib/components/Minimap/MinimapNode.svelte';
	import type { ConfigObject, NodeConfig, Inputs, Properties } from '$lib/types';
	import type { UserConfig } from 'vitest/config';
	import CircleNode from '../components/CircleNode.svelte';
	import TestComponent from '../components/TestComponent.svelte';
	import MyNode from '../components/MyNode.svelte';
	const mermaid = `A & B --> C
	C--> D
	D --> E
	E --> F`;
</script>

<body>
	<div class="wrapper">
		<Svelvet theme="dark" width={600} height={600} LR minimap>
			<TestComponent />
			<TestComponent />
			<TestComponent />

			<MyNode id="sam" />
			<MyNode />
			<MyNode />
			<MyNode />
			<MyNode />
			<MyNode />
			<MyNode />
			<Node
				position={{ x: 100, y: 100 }}
				TD
				id="special"
				inputs={5}
				width={400}
				height={200}
				label="Thanks For Coming"
				editable
			/>
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
	}
</style>
