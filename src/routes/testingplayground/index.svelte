<script>

//   import Svelvet from 'svelvet';
	import DevTools from '$lib/Containers/DevTools/index.svelte';
	

	const initialNodes = [
		{
			id: 'node1',
			type: 'input',
			position: { x: 450, y: 0 },
			data: { label: '1' },
			width: 175,
			height: 40,
			bgColor: 'black',
			sourcePosition: 'bottom'
		},
	];
	
    const initialEdges = [
		{ id: 'e1-2', source: 1, type: 'straight', target: 2, label: 'e1-2' },
	];


</script>

<!-- <Svelvet nodes={initialNodes} edges={initialEdges} width={900} height={900} background /> -->

<DevTools nodes={initialNodes} edges={initialEdges} /> 
