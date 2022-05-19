<script lang="ts">
	import Svelvet from 'svelvet';
	const initialNodes = [
		{
			id: 1,
			type: 'input',
			position: { x: 300, y: 50 },
			data: { label: 'Input' },
			width: 200,
			height: 100,
			bgColor: 'white'
		},
		{
			id: 2,
			type: 'default',
			position: { x: 300, y: 200 },
			data: { label: 'Default' },
			width: 200,
			height: 100,
			bgColor: 'white'
		},
		{
			id: 4,
			type: 'output',
			position: { x: 450, y: 400 },
			data: { label: 'Bye!' },
			width: 200,
			height: 100,
			bgColor: 'pink'
		},
		{
			id: 3,
			type: 'output',
			position: { x: 150, y: 400 },
			data: { label: 'Output' },
			width: 200,
			height: 100,
			bgColor: 'white'
		}
	];

	const initialEdges = [
		{ id: 'e1-2', source: 1, target: 2, data: { label: 'yay!' } },
		{ id: 'e2-4', source: 2, target: 4 },
		{ id: 'e2-3', source: 2, target: 3 }
	];
</script>

<div class="m-12 ">
	<div class="">
		<h2 class="text-3xl font-semibold my-4">Basic Usage</h2>
		<p class="my-4 text-gray-700">
			This is a very basic example of a Svelvet graph. You can see different node types (input,
			default, output), edge types (bezier, step and straight), edge labels and custom styled edge
			labels.
		</p>
		<Svelvet nodes={initialNodes} edges={initialEdges} />
	</div>
</div>
