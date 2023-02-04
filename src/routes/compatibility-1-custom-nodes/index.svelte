<script>
  import Svelvet from 'svelvet-lime';

  const initialNodes = [
    {
      id: 1,
      position: { x: 50, y: 50 },
      data: { label: 'default styling' },
      width: 150,
      height: 40,
      bgColor: 'white',
    },
    {
      id: 2,
      position: { x: 50, y: 110 },
      data: { label: 'borderColor' },
      width: 150,
      height: 40,
      borderColor: 'red',
      bgColor: 'white',
    },
    {
      id: 3,
      position: { x: 220, y: 50 },
      data: { label: 'textColor' },
      width: 150,
      height: 40,
      textColor: '#3F6FD6',
      bgColor: 'white',
    },
    {
      id: 4,
      position: { x: 220, y: 110 },
      data: { label: 'bgColor' },
      width: 150,
      height: 40,
      textColor: 'white',
      borderColor: 'transparent',
      bgColor: '#FF9ABD',
    },
    {
      id: 5,
      position: { x: 85, y: 170 },
      data: { label: 'width and height' },
      width: 90,
      height: 110,
      bgColor: 'white',
    },
    {
      id: 6,
      position: { x: 250, y: 175 },
      data: { label: 'borderRadius' },
      width: 100,
      height: 100,
      bgColor: 'white',
      borderRadius: 50,
    },
    {
      id: 7,
      position: { x: 50, y: 300 },
      data: { label: 'clickCallback' },
      width: 150,
      height: 40,
      bgColor: 'white',
      clickCallback: (node) => console.log(node),
    },
  ];

  const initialEdges = [];
</script>

<Svelvet
  nodes={initialNodes}
  edges={initialEdges}
  width={500}
  height={500}
  initialLocation={{ x: 250, y: 250 }}
  background
/>
