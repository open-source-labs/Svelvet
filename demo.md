<script> 
  import Svelvet from 'svelvet';

  const initialNodes = [
    {
      id: 1,
      position: { x: 190, y: 40 },
      data: { label: 'Input Node' },
      width: 175,
      height: 40,
      bgColor: '#FF4121'
    },
    {
      id: 2,
      position: { x: 355, y: 160 },
      data: { label: 'Default Node' },
      width: 175,
      height: 40,
      bgColor: 'yellow'
    },
    {
      id: 3,
      position: { x: 190, y: 260 },
      data: { label: 'Output Node' },
      width: 175,
      height: 40,
      bgColor: 'red'
    },
    {
      id: 4,
      position: { x: 25, y: 160 },
      data: { label: 'Drag me!' },
      width: 175,
      height: 40,
      bgColor: 'rgb(246,111,83)'
    },
    {
      id: 5,
      position: { x: 355, y: 360 },
      data: { label: 'Custom Node' },
      width: 175,
      height: 40,
      bgColor: 'rgb(251,113,133)',
      borderColor: 'transparent',
      borderRadius: 0
    },
    {
      id: 6,
      position: { x: 72.5, y: 360 },
      data: { label: 'Custom Node' },
      width: 80,
      height: 80,
      borderColor: '#FF4121',
      borderRadius: 30,
      bgColor: 'white',
      textColor: '#FF4121'
    }
  ];

  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2, label: 'edge label' },
    { id: 'e2-3', source: 2, target: 3, animate: true },
    { id: 'e1-4', source: 1, target: 4 },
    { id: 'e2-5', source: 2, target: 5, label: 'animated edge', animate: true, arrow: true },
    { id: 'e2-5', source: 4, target: 6, type: 'straight' },
    { id: 'e2-5', source: 3, target: 6 }
  ];
</script>
<Svelvet nodes={initialNodes} edges={initialEdges} width={710} height={700} background />