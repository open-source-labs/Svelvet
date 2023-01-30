<script>
  import Svelvet from '$lib/container/views/Svelvet.svelte';

  const initialNodes = [
    {
      id: 1,
      position: { x: 225, y: 10 },
      data: { label: 'id=1' },
      width: 100,
      height: 100,
      bgColor: 'white',
      borderColor: 'transparent',
      image: true,
      src: 'https://svelvet.io/_app/assets/Logo%201-cc7b0baf.svg',
      sourcePosition: 'right',
    },
    {
      id: 2,
      position: { x: 390, y: 180 },
      data: { label: 'id=2' },
      width: 125,
      height: 40,
      bgColor: 'white',
      textColor: 'black',
    },
  ];

  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2, label: 'edge label' },
  ];
</script>

<!-- <Svelvet
  nodes={initialNodes}
  edges={initialEdges}
  width={900}
  height={900}
  background
/> -->

<Svelvet nodes={initialNodes} edges={initialEdges} nodeCreate />
<Svelvet nodes={initialNodes} edges={initialEdges} />
