<script>
	import Component from '$lib/Component.svelte';
	import SimpleBezierEdge from '$lib/Edges/SimpleBezierEdge.svelte';
	import { Position } from '$lib/types';
	// import GraphView from '$lib/Containers/GraphView/index.svelte';
	// import Svelvet from '$lib/Containers/Svelvet/index.svelte';

	const initialNodes = [
		{
			id: '1',
			type: 'input',
			data: { label: 'Input Node' },
			position: { x: 75, y: 50 }
		},

		{
			id: '2',
			type: 'default',

			data: { label: 'Default Node' },
			position: { x: 150, y: 150 }
		},
		{
			id: '3',
			type: 'output',
			data: { label: 'Output Node' },
			position: { x: 200, y: 250 }
		}
	];

	const initialEdges = [
		{ id: 'e1-2', source: '1', target: '2', animated: true },
		{ id: 'e1-3', source: '1', target: '3' }
	];

	const propsObj = {
		sourceX: 2,
		sourceY: 5,
		targetX: 10,
		targetY: 2,
		sourcePosition: Position.Bottom,
		targetPosition: Position.Top,
		label: 'LABEL'
	};
</script>

<Component />
<SimpleBezierEdge {propsObj} />

<!-- <Svelvet nodes={initialNodes} /> -->
