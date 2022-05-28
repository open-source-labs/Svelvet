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
			position: { x: 350, y: 250 },
			data: { label: 'Default' },
			width: 175,
			height: 40,
			bgColor: 'white'
		},
		{
			id: 3,
			type: 'output',
			position: { x: 40, y: 400 },
			data: { label: 'Output' },
			width: 175,
			height: 40,
			bgColor: 'white'
		},
		{
			id: 4,
			type: 'output',
			position: { x: 400, y: 500 },
			data: { label: 'Bye!' },
			width: 175,
			height: 40,
			bgColor: 'white'
		},
		{
			id: 5,
			type: 'output',
			position: { x: 50, y: 200 },
			data: { label: 'another Output!' },
			width: 175,
			height: 40,
			bgColor: 'white'
		}
	];

	const initialEdges = [
		{ id: 'e1-2', source: 1, target: 2, label: 'labeled edge' },
		{ id: 'e2-3', source: 2, target: 3, label: 'another label' },
		{ id: 'e2-4', source: 2, target: 4, label: 'animated edge', animate: true },
		{ id: 'e1-5', source: 1, target: 5 }
	];
</script>

<Svelvet nodes={initialNodes} edges={initialEdges} />

<style>
</style>
