<script>
  import Svelvet from 'svelvet-lime';
  import Login from './DummyComponent.svelte';
  import Home from './DummyComponent.svelte';
  import About from './DummyComponent.svelte';

  const initialNodes = [
    {
      id: 1,
      position: { x: -550, y: -200 },
      data: { custom: Login },
      width: 300 * 0.8,
      height: 300 * 0.8,
      bgColor: 'white',
    },
    {
      id: 2,
      position: { x: -850, y: 250 },
      data: { custom: Home },
      width: 300,
      height: 300,
      bgColor: 'white',
    },
    {
      id: 3,
      position: { x: -450, y: 250 },
      data: { custom: About },
      width: 300,
      height: 300,
      bgColor: 'white',
    },
  ];

  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2, label: 'connection' },
  ];
</script>

<Svelvet
  nodes={initialNodes}
  width={500}
  height={500}
  initialZoom={0}
  initialLocation={initialNodes[2].position}
  edges={initialEdges}
  bgColor={'#EEEEEE'}
  nodeLink
  nodeCreate
  background
/>
