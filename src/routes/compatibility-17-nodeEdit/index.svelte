<script>
  // import Svelvet from 'svelvet-lime';
  import Svelvet from '$lib/container/views/Svelvet.svelte';

  const initialNodes = [
    {
      id: 1,
      position: { x: 10, y: 10 },
      data: { label: 'default styling' },
      width: 150,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 2,
      position: { x: 50, y: 100 },
      data: { label: 'borderColor' },
      width: 150,
      height: 40,
      borderColor: 'red',
      bgColor: 'white',
    },
    {
      id: 3,
      position: { x: 220, y: 30 },
      data: { label: 'textColor' },
      width: 150,
      height: 40,
      textColor: '#3F6FD6',
      bgColor: 'white',
    },
    {
      id: 4,
      position: { x: 300, y: 110 },
      data: { label: 'bgColor' },
      width: 150,
      height: 40,
      textColor: 'white',
      borderColor: 'transparent',
      bgColor: '#FF9ABD',
    },
    {
      id: 5,
      position: { x: 85, y: 220 },
      data: { label: 'width and height' },
      width: 90,
      height: 90,
      bgColor: 'white',
    },
    {
      id: 6,
      position: { x: 250, y: 225 },
      data: { label: 'borderRadius' },
      width: 100,
      height: 100,
      bgColor: 'white',
      borderRadius: 50,
    },
  ];

  const initialEdges = [];
</script>

<Svelvet
  height={500}
  width={500}
  nodes={initialNodes}
  edges={initialEdges}
  initialZoom={3}
  initialLocation={initialNodes[5].position}
  background
  nodeCreate
/>
