<script>
  import Svelvet from 'svelvet-lime';

  const initialNodes = [
    {
      id: 1,
      position: { x: 150, y: 50 },
      data: { label: 'default styling' },
      width: 150,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 2,
      position: { x: 50, y: 300 },
      data: { label: 'borderColor' },
      width: 150,
      height: 40,
      borderColor: 'red',
      bgColor: 'white',
    },
    {
      id: 3,
      position: { x: 50, y: 150 },
      data: { label: 'textColor' },
      width: 150,
      height: 40,
      textColor: '#3F6FD6',
      bgColor: 'white',
    },
    {
      id: 4,
      position: { x: 250, y: 150 },
      data: { label: 'Danny Pink' },
      width: 150,
      height: 40,
      textColor: 'white',
      borderColor: 'transparent',
      bgColor: '#FF9ABD',
    },
    {
      id: 5,
      position: { x: 250, y: 250 },
      data: { label: 'width and height' },
      width: 90,
      height: 110,
      bgColor: 'white',
    },
    {
      id: 6,
      position: { x: 250, y: 400 },
      data: { label: 'borderRadius' },
      width: 100,
      height: 100,
      bgColor: 'orange',
      borderRadius: 30,
    },
    {
      id: 7,
      position: { x: 50, y: 500 },
      data: { label: 'clickCallback' },
      width: 150,
      height: 40,
      bgColor: 'white',
      clickCallback: (node) => console.log(node),
    },
  ];

  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2, label: 'connection' },
    { id: 'e2-3', source: 2, target: 5, label: 'label' },
    {
      id: 'e1-4',
      source: 5,
      target: 6,
      label: 'box',
      animate: true,
      arrow: true,
    },
    { id: 'e2-5', source: 6, target: 7, animate: true },
  ];
</script>

<Svelvet
  nodes={initialNodes}
  width={500}
  height={500}
  edges={initialEdges}
  initialLocation={initialNodes[4].position}
  initialZoom={2}
  bgColor={'pink'}
  background
/>
