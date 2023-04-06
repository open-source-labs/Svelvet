<script lang="ts">
	import { Svelvet, Controls, Minimap, Node, SpecialNode } from '$lib';
	import CustomAnchor from '$lib/components/CustomAnchor/CustomAnchor.svelte';
	import CustomComponent from '$lib/components/CustomComponent/CustomComponent.svelte';
	import MinimapNode from '$lib/components/Minimap/MinimapNode.svelte';
	import NodeAdder from '$lib/components/NodeAdder/NodeAdder.svelte';
	import type { ConfigObject, NodeConfig, Inputs, Properties } from '$lib/types';
	import type { UserConfig } from 'vitest/config';
	import CircleNode from '../components/CircleNode.svelte';
	import TestComponent from '../components/TestComponent.svelte';
	const mermaid = `A & B --> C
	C--> D
	D --> E
	E --> F`;
</script>

<body>
	<div class="wrapper">
		<Svelvet theme="dark" width={600} height={600} initialZoom={0.5}>
			<TestComponent />
			<TestComponent />
			<SpecialNode
				width={200}
				height={200}
				borderRadius={20}
				label="I DON'T HAVE TIME FOR THIS MIKE"
			/>
			<SpecialNode
				width={600}
				height={300}
				inputs={2}
				outputs={3}
				TD
				borderRadius={30}
				label="Hello"
			/>
			<SpecialNode />
		</Svelvet>
		<!-- <Controls /> -->
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
