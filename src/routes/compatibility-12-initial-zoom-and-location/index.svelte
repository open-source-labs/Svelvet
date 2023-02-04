<script>
  import Svelvet from 'svelvet';

  const initialNodes = [
    {
      id: 1,
      position: { x: 0, y: 0 },
      data: { label: 'Input Node' },
      width: 175,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 2,
      position: { x: 10, y: 150 },
      data: { label: 'bezier' },
      width: 70,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 3,
      position: { x: 152, y: 150 },
      data: { label: 'straight' },
      width: 70,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 4,
      position: { x: 294, y: 150 },
      data: { label: 'animated/labeled' },
      width: 140,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 5,
      position: { x: 80, y: 225 },
      data: { label: 'no handle' },
      width: 80,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 6,
      position: { x: 250, y: 225 },
      data: { label: 'arrow handle' },
      width: 100,
      height: 40,
      bgColor: 'white',
    },
  ];

  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2, type: 'bezier' },
    { id: 'e1-3', source: 1, target: 3, type: 'straight' },
    {
      id: 'e1-4',
      source: 1,
      target: 4,
      type: 'bezier',
      animate: true,
      label: 'labeled',
    },
    {
      id: 'e1-5',
      source: 1,
      target: 5,
      type: 'bezier',
      noHandle: true,
    },
    {
      id: 'e1-6',
      source: 1,
      target: 6,
      type: 'bezier',
      arrow: true,
    },
  ];
</script>

<Svelvet
  nodes={initialNodes}
  edges={initialEdges}
  initialZoom={5}
  initialLocation={{ x: 100, y: 0 }}
  background
/>
