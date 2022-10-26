<script>
  import Svelvet from 'svelvetcake';
  // import Svelvet from 'svelvet';

	// const initialNodes = [
	// 	{
	// 		id: 1,
	// 		type: 'input',
	// 		position: { x: 0, y: 0 },
	// 		data: { label: 'Input' },
	// 		width: 175,
	// 		height: 40,
	// 		bgColor: 'white',
	// 		sourcePosition: 'bottom'
	// 	},
	// 	{
	// 		id: 2,
	// 		type: 'default',
	// 		position: { x: 0, y: 100 },
	// 		data: { label: 'Default' },
	// 		width: 175,
	// 		height: 40,
	// 		bgColor: 'white'
	// 	},
	// 	{
	// 		id: 3,
	// 		type: 'output',
	// 		position: { x: 0, y: 200 },
	// 		data: { label: 'Output' },
	// 		width: 175,
	// 		height: 40,
	// 		bgColor: 'white'
	// 	},
	// 	{
	// 		id: 4,
	// 		type: 'output',
	// 		position: { x: 200, y: 200 },
	// 		data: { label: 'Bye!' },
	// 		width: 175,
	// 		height: 40,
	// 		bgColor: 'white'
	// 	}
	// ];

	const initialNodes = [
		{
			id: 1,
			type: 'input',
			position: { x: 450, y: 0 },
			data: { label: '1' },
			width: 175,
			height: 40,
			bgColor: 'white',
			sourcePosition: 'bottom'
		},
		{
			id: 2,
			type: 'default',
			position: { x: 550, y: 150 },
			data: { label: '2' },
			width: 175,
			height: 40,
			bgColor: 'white',
			sourcePosition: 'right',
			targetPositon: 'top'
		},
		{
			id: 3,
			type: 'default',
			position: { x: 350, y: 150 },
			data: { label: '3' },
			width: 175,
			height: 40,
			bgColor: 'white',
			targetPositon: 'right',
			sourcePosition: 'left'
		},
		{
			id: 4,
			type: 'default',
			position: { x: 50, y: 200 },
			data: { label: '4' },
			width: 175,
			height: 40,
			bgColor: 'white',
			targetPosition: 'right',
			sourcePosition: 'bottom'
		},
		{
			id: 5,
			type: 'output',
			position: { x: 750, y: 250 },
			data: { label: '5' },
			width: 175,
			height: 40,
			bgColor: 'white',
			targetPosition: 'top',
			sourcePosition: 'left'
		},
		{
			id: 6,
			type: 'output',
			position: { x: 450, y: 750 },
			data: { label: '6' },
			width: 175,
			height: 40,
			bgColor: 'white',
			targetPosition: 'bottom',
			sourcePosition: 'top'
		},
		{
			id: 7,
			type: 'output',
			position: { x: 550, y: 600 },
			data: { label: '7' },
			width: 175,
			height: 40,
			bgColor: 'white',
			targetPosition: 'bottom',
			sourcePosition: 'right'
		},
		{
			id: 8,
			type: 'output',
			position: { x: 250, y: 600 },
			data: { label: '8' },
			width: 175,
			height: 40,
			bgColor: 'white',
			targetPosition: 'bottom',
			sourcePosition: 'top'
		},
		{
			id: 9,
			type: 'output',
			position: { x: 25, y: 475 },
			data: { label: '9' },
			width: 175,
			height: 40,
			bgColor: 'white',
			targetPosition: 'right',
			sourcePosition: 'left'
		},
		{
			id: 10,
			type: 'output',
			position: { x: 750, y: 475 },
			data: { label: '10' },
			width: 175,
			height: 40,
			bgColor: 'white',
			targetPosition: 'left',
			sourcePosition: 'left'
		},
	];
  const initialEdges = [
		{ id: 'e1-2', source: 1, type: 'straight', target: 2, label: 'e1-2' },
		{ id: 'e1-3', source: 1, type: 'bezier', target: 3, label: 'e1-3' },
		{ id: 'e2-3', source: 2, target: 5,type: 'smoothstep',  label: 'e2-3' },
		{ id: 'e2-4', source: 3, target: 4, type: 'step', label: 'e2-4', animate: true },
		{ id: 'e6-7', source: 6, target: 7, type: 'straight', label: 'e6-7', animate: true },
		{ id: 'e6-8', source: 6, target: 8, type: 'straight', label: 'e6-8', animate: true },
		{ id: 'e8-9', source: 8, target: 9, type: 'bezier', label: 'e8-9', animate: true },
		{ id: 'e7-10', source: 7, target: 10, type: 'smoothstep', label: 'e7-10', animate: false },
	];
</script>

<Svelvet nodes={initialNodes} edges={initialEdges} width={900} height={900} background />
