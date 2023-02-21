<script>
  import Svelvet from '$lib/container/views/Svelvet.svelte';

  const initialNodes = [
    {
      id: 1,
      position: { x: 50, y: 300 },
      data: { label: 'borderColor' },
      targetPosition: 'right',
      sourcePosition: 'left',
      width: 80,
      height: 40,
      borderColor: 'red',
      bgColor: 'white',
    },
    {
      id: 2,
      position: { x: 50, y: 150 },
      data: { label: 'textColor' },
      width: 80,
      height: 40,
      textColor: '#3F6FD6',
      bgColor: 'white',
    },
    {
      id: 3,
      position: { x: 250, y: 150 },
      data: {},
      width: 75,
      height: 50,
      textColor: 'white',
      borderColor: 'transparent',
      bgColor: 'black',
      image: true,
      src: 'https://www.dropbox.com/s/bunxvjowj5fxosa/de3t.jpg?raw=1',
      alt: 'a carrot',
    },
    {
      id: 4,
      position: { x: 250, y: 500 },
      data: { label: 'Apple' },
      width: 100,
      height: 50,
      bgColor: 'red',
      borderRadius: 30,
    },
    {
      id: 5,
      position: { x: 450, y: 400 },
      data: { label: 'borderRadius' },
      width: 100,
      height: 50,
      bgColor: 'orange',
      borderRadius: 30,
    },
    {
      id: 7,
      position: { x: -500, y: -500 },
      data: { label: '123' },
      width: 100,
      height: 100,
      bgColor: 'orange',
      borderRadius: 30,
    },
    {
      id: 6,
      position: { x: -450, y: 400 },
      data: { label: 'I am far' },
      width: 100,
      height: 50,
      bgColor: 'green',
      borderRadius: 30,
    },
  ];
  const initialEdges = [
    { id: 'e3-4', source: 3, target: 4, animate: true, type: 'step' },
    { id: 'e1-6', source: 1, target: 6, animate: false },
    { id: 'e6-7', source: 6, target: 7, animate: false, type: 'step' },
  ];
</script>

<main>
  <Svelvet
    nodes={initialNodes}
    width={500}
    height={425}
    initialZoom={6}
    initialLocation={{ x: 150, y: 300 }}
    edges={initialEdges}
    bgColor={'#EEEEEE'}
    background
    minimap={true}
    nodeCreate
    nodeLink
  />
</main>
