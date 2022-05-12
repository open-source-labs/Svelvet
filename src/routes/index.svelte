<script>
	import Component from '$lib/Component.svelte';
	import GraphView from '$lib/GraphView/index.svelte';
	import Svelvet from '$lib/Containers/Svelvet/index.svelte';

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
			position: { x: 250, y: 250 }
		}
	];
</script>

<Component />

<Svelvet nodes={initialNodes} />
