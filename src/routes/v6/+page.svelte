<script lang="ts">
	import { Svelvet, Node } from '$lib';
	import type { Connections, NodeProps } from '$lib/types';

	const initialNodes: Array<NodeProps> = [
		{
			id: 1,
			position: { x: 50, y: 50 },
			data: { label: 'default styling' },
			width: 150,
			height: 40
		},
		{
			id: 2,
			position: { x: 50, y: 110 },
			data: { label: 'borderColor' },
			width: 150,
			height: 40,
			borderColor: 'red',
			bgColor: 'white'
		},
		{
			id: 3,
			position: { x: 220, y: 50 },
			data: { label: 'textColor' },
			width: 150,
			height: 40,
			textColor: '#3F6FD6',
			bgColor: 'white'
		},
		{
			id: 4,
			position: { x: 220, y: 110 },
			data: { label: 'bgColor' },
			width: 150,
			height: 40,
			textColor: 'white',
			borderColor: 'transparent',
			bgColor: '#FF9ABD'
		},
		{
			id: 5,
			position: { x: 85, y: 170 },
			data: { label: 'width and height' },
			width: 90,
			height: 110,
			bgColor: 'white'
		},
		{
			id: 6,
			position: { x: 250, y: 175 },
			data: { label: 'borderRadius' },
			width: 100,
			height: 100,
			bgColor: 'yellow',
			borderRadius: 50
		},
		{
			id: 7,
			position: { x: 50, y: 300 },
			data: { label: 'clickCallback' },
			width: 150,
			height: 40,
			bgColor: 'white',
			clickCallback: (node) => console.log(node)
		}
	];

	const initialEdges = [
		{ id: 'e1-2', source: 1, target: 2, label: 'connection' },
		{ id: 'e2-3', source: 2, target: 3, label: 'label' },
		{
			id: 'e1-4',
			source: 1,
			target: 4,
			label: 'box',
			animate: true,
			arrow: true
		},
		{ id: 'e2-5', source: 1, target: 5, animate: true },
		{ id: 'e1-6', source: 1, target: 6, arrow: true },
		{ id: 'e1-7', source: 1, target: 7, animate: true },
		{
			id: 'e7-8',
			source: 7,
			target: 8,
			arrow: true,
			animate: true,
			label: 'child'
		},
		{
			id: 'e7-8',
			source: 7,
			target: 9,
			arrow: true,
			animate: true,
			label: 'child'
		}
	];

	const connections = initialEdges.reduce<Record<string | number, Connections>>((acc, edge) => {
		if (acc[edge.source]) {
			acc[edge.source].push(edge.target);
		} else {
			acc[edge.source] = [edge.target];
		}
		return acc;
	}, {});
</script>

<body>
	<div class="wrapper">
		<Svelvet translation={{ x: 0, y: 0 }} width={800} height={500} theme="dark" controls>
			{#each initialNodes as node}
				<Node
					{...node}
					label={node.data.label || ''}
					connections={node.id ? connections[node?.id] : []}
				/>
			{/each}
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
