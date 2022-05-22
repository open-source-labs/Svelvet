<script>
	import Svelvet from '$lib/Containers/Svelvet/index.svelte';

	// Example data for how library is to be used
	const initialNodes = [
		{
			id: 1,
			type: 'input',
			position: { x: 100, y: 50 },
			data: { label: 'Input' },
			width: 175,
			height: 40,
			bgColor: 'white'
		},
		{
			id: 2,
			type: 'default',
			position: { x: 200, y: 250 },
			data: { label: 'Default' },
			width: 175,
			height: 40,
			bgColor: 'white'
		},
		{
			id: 3,
			type: 'output',
			position: { x: 100, y: 550 },
			data: { label: 'Output' },
		 	width: 175,
			height: 40,
			bgColor: 'white'
		},
		// {
		// 	id: 4,
		// 	type: 'output',
		// 	position: { x: 400, y: 550 },
		// 	data: { label: 'Bye!' },
		// 	width: 175,
		// 	height: 40,
		// 	bgColor: 'white'
		// }
	];

	const initialEdges = [
		{ id: 'e1-2', source: 1, target: 2, data: { label: 'yay!' } },
		{ id: 'e2-3', source: 2, target: 3 },
		// { id: 'e2-4', source: 2, target: 4 }
	];
</script>
<h1>Hello, this is a h1 element</h1>
<div class="Example">This is a div element</div>
<Svelvet nodes={initialNodes} edges={initialEdges} />
<h1>Goodbye</h1>
<div class="Example">Another div element</div>

<style>
	.Example {
		display: grid; 
		width: 100px;
		height: 50px;
		border: 2px solid black; 
		position: relative;
	}
</style>