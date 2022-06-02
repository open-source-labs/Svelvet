<script>
  import Svelvet from '$lib/Containers/Svelvet/index.svelte';
  import logo from '../assets/Logo 1 white.svg';
  // import Svelvet from 'svelvet';

  const initialNodes = [
    {
      id: 1,
      position: { x: 300, y: 50 },
      data: { label: 'Input Node' },
      width: 175,
      height: 40,
      bgColor: 'white'
    },
    {
      id: 2,
      position: { x: 125, y: 150 },
      data: { label: 'Option #1' },
      width: 175,
      height: 40,
      bgColor: '#B8FFC6',
      borderColor: 'transparent'
    },
    {
      id: 3,
      position: { x: 475, y: 150 },
      data: { label: 'Option #2' },
      width: 175,
      height: 40,
      bgColor: '#FFB8B8',
      borderColor: 'transparent'
    },
    {
      id: 4,
      position: { x: 300, y: 250 },
      data: { label: 'Output Node' },
      width: 175,
      height: 40,
      bgColor: 'white'
    }
  ];
  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2, label: '  YES  ' },
    { id: 'e2-3', source: 1, target: 3, label: '  NO  ' },
    { id: 'e2-4', source: 2, target: 4, animate: true },
    { id: 'e2-5', source: 3, target: 4, animate: true }
  ];

  // const initialNodes = [
  // 	{
  // 		id: 1,
  // 		position: { x: 350, y: 50 },
  // 		data: { label: 'Input Node' },
  // 		width: 175,
  // 		height: 40,
  // 		bgColor: 'white'
  // 	},
  // 	{
  // 		id: 2,
  // 		position: { x: 350, y: 150 },
  // 		data: { label: 'Default Node' },
  // 		width: 175,
  // 		height: 40,
  // 		bgColor: 'white'
  // 	},
  // 	{
  // 		id: 3,
  // 		position: { x: 200, y: 275 },
  // 		data: { label: 'Output Node #1' },
  // 		width: 175,
  // 		height: 40,
  // 		bgColor: 'white'
  // 	},
  // 	{
  // 		id: 4,
  // 		position: { x: 500, y: 275 },
  // 		data: { label: 'Output Node #2' },
  // 		width: 175,
  // 		height: 40,
  // 		bgColor: 'white'
  // 	},
  // 	{
  // 		id: 5,
  // 		position: { x: 350, y: 350 },
  // 		data: { label: 'Output Node #3' },
  // 		width: 175,
  // 		height: 40,
  // 		bgColor: 'white'
  // 	}
  // ];
  // const initialEdges = [
  // 	{ id: 'e1-2', source: 1, target: 2, type: 'straight', label: 'label', arrow: true },
  // 	{ id: 'e2-3', source: 2, target: 3, label: 'another label' },
  // 	{ id: 'e2-4', source: 2, target: 4, label: 'animated edge', animate: true, noHandle: true },
  // 	{ id: 'e2-5', source: 2, target: 5, arrow: true }
  // ];
</script>

<Svelvet nodes={initialNodes} edges={initialEdges} width={1000} background={true} />

<!-- <div
	class="flex items-center justify-center p-16 w-[400px] bg-gradient-to-r from-[#F66F52] to-rose-400"
>
	<img src={logo} alt="Logo" class="aspect-ratio-auto h-8" />
	<a
		id="home"
		href="/"
		class="text-3xl text-white font-nunito font-medium tracking-wide ml-2 mr-6 svelvet">svelvet</a
	>
</div>

<style>
	/* .svelvet {
		text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
	}

	img {
		filter: drop-shadow(1px 1px 1px rgb(0, 0, 0, 0.2));
	} */
</style> -->
