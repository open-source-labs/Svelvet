<script>
	import Svelvet from '$lib/Containers/Svelvet/index.svelte';

	// Example data for how library is to be used
	const initialNodes = [{
		id: 1,
		type: 'input',
		position: {x: 100, y: 50},
		data: {label: 'Input'},
		width: 200,
		height: 100,
		bgColor: 'white',
	},
	{
		id: 2, 
		type: 'default',
		position: {x: 200, y: 250},
		data: {label: 'Default'},
		width: 200,
		height: 100,
		bgColor: 'white',
	},
	{
		id: 3, 
		type: 'output',
		position: {x: 100, y: 550},
		data: {label: 'Output'},
		width: 200,
		height: 100,
		bgColor: 'white'
	},
	{
		id: 4, 
		type: 'output',
		position: {x: 400, y: 550},
		data: {label: 'Bye!'},
		width: 200,
		height: 100,
		bgColor: 'white'
	}
];

	const initialEdges = [
		{ id: 'e1-2', source: 1, target: 2, data: {label: 'yay!'} }, 
		{ id: 'e2-3', source: 2, target: 3 },
		{ id: 'e2-4', source: 2, target: 4 }
	];

</script>

<Svelvet nodes={initialNodes} edges={initialEdges} />
